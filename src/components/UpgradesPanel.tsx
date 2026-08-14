import React, { useState, useMemo } from 'react';
import { useGame } from '../context/GameContext';
import { UPGRADES } from '../data/upgrades';
import { UpgradeCategory } from '../types';
import { calculateUpgradeCost, calculateMaxAffordableUpgrades, simulateUpgradeImpact, getMasteryContribution } from '../systems/economy';
import { formatMoney, formatPerClick, formatPerSecond } from '../systems/formatting';
import { getAssetUrl } from '../assets/assets';
import { 
  Zap, 
  Users, 
  Building2, 
  BookOpen, 
  Coins, 
  Castle, 
  ArrowUpDown, 
  TrendingUp, 
  ArrowRight, 
  Eye,
  Sparkles,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  RotateCcw,
  Award,
  X
} from 'lucide-react';

type SortMetric = 'cost' | 'level' | 'income' | 'name';
type SortOrder = 'asc' | 'desc';

interface UpgradesPanelProps {
  isDashboard?: boolean;
}

export const UpgradesPanel: React.FC<UpgradesPanelProps> = ({ isDashboard = false }) => {
  const { state, buyUpgrade } = useGame();
  const [selectedCategory, setSelectedCategory] = useState<UpgradeCategory | 'all'>('all');
  const [buyMode, setBuyMode] = useState<1 | 10 | 'max'>(1);
  const [sortMetric, setSortMetric] = useState<SortMetric>('cost');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [onlyAffordable, setOnlyAffordable] = useState<boolean>(false);
  const [hoveredUpgrade, setHoveredUpgrade] = useState<{ id: string; rect: DOMRect } | null>(null);
  const [activeMasteryId, setActiveMasteryId] = useState<string | null>(null);

  const categories: { id: UpgradeCategory | 'all'; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All', icon: <Zap size={14} /> },
    { id: 'click', label: 'Click Power', icon: <Zap size={14} /> },
    { id: 'workers', label: 'Workers', icon: <Users size={14} /> },
    { id: 'buildings', label: 'Buildings', icon: <Building2 size={14} /> },
    { id: 'training', label: 'Training', icon: <BookOpen size={14} /> },
    { id: 'wealth', label: 'Wealth', icon: <Coins size={14} /> },
    { id: 'empire', label: 'Empire', icon: <Castle size={14} /> }
  ];

  // Process, Filter and Sort Upgrades dynamically
  const sortedUpgrades = useMemo(() => {
    // 1. Filter by category
    const categoryFiltered = UPGRADES.filter(u => {
      if (selectedCategory === 'all') return true;
      return u.category === selectedCategory;
    });

    // 2. Attach current cost and affordability based on active buyMode
    const withMetadata = categoryFiltered.map(u => {
      const level = state.upgradeLevels[u.id] || 0;
      let currentCost = 0;

      if (buyMode === 1) {
        currentCost = calculateUpgradeCost(u.baseCost, u.growthRate, level, 1);
      } else if (buyMode === 10) {
        currentCost = calculateUpgradeCost(u.baseCost, u.growthRate, level, 10);
      } else if (buyMode === 'max') {
        const maxAffordable = calculateMaxAffordableUpgrades(u.baseCost, u.growthRate, level, state.money);
        currentCost = maxAffordable.totalCost || calculateUpgradeCost(u.baseCost, u.growthRate, level, 1);
      }

      const canAfford = state.money >= currentCost && currentCost > 0;
      return {
        upgrade: u,
        level,
        currentCost,
        canAfford
      };
    });

    // If viewing any specific category tab (not 'all'), preserve the exact authored default order without sorting
    if (selectedCategory !== 'all') {
      return withMetadata;
    }

    // On the main dashboard 'all' view: strictly sort by value (lowest cost at top, highest at bottom)
    if (isDashboard) {
      withMetadata.sort((a, b) => a.currentCost - b.currentCost);
      return withMetadata;
    }

    // In the dedicated upgrades 'all' view: apply multi-filter & sort
    const filtered = onlyAffordable 
      ? withMetadata.filter(item => item.canAfford)
      : withMetadata;

    filtered.sort((a, b) => {
      let cmp = 0;
      switch (sortMetric) {
        case 'cost':
          cmp = a.currentCost - b.currentCost;
          break;
        case 'level':
          cmp = a.level - b.level || a.currentCost - b.currentCost;
          break;
        case 'income': {
          const incA = a.upgrade.baseIncome > 0 ? a.upgrade.baseIncome : (a.upgrade.multiplier ? (a.upgrade.multiplier - 1) * 50000 : 0);
          const incB = b.upgrade.baseIncome > 0 ? b.upgrade.baseIncome : (b.upgrade.multiplier ? (b.upgrade.multiplier - 1) * 50000 : 0);
          cmp = incA - incB || a.currentCost - b.currentCost;
          break;
        }
        case 'name':
          cmp = a.upgrade.name.localeCompare(b.upgrade.name);
          break;
        default:
          cmp = a.currentCost - b.currentCost;
      }

      return sortOrder === 'asc' ? cmp : -cmp;
    });

    return filtered;
  }, [selectedCategory, sortMetric, sortOrder, onlyAffordable, buyMode, isDashboard, state.upgradeLevels, state.money]);

  // Active hovered upgrade data
  const hoveredData = useMemo(() => {
    if (!hoveredUpgrade) return null;
    const upgrade = UPGRADES.find(u => u.id === hoveredUpgrade.id);
    if (!upgrade) return null;
    const level = state.upgradeLevels[upgrade.id] || 0;
    const impact = simulateUpgradeImpact(state, upgrade.id, buyMode);
    return {
      upgrade,
      level,
      impact,
      rect: hoveredUpgrade.rect
    };
  }, [hoveredUpgrade, buyMode, state]);

  // Active clicked mastery impact breakdown
  const activeMasteryData = useMemo(() => {
    if (!activeMasteryId) return null;
    return getMasteryContribution(state, activeMasteryId);
  }, [activeMasteryId, state]);

  const getLevelTier = (lvl: number) => {
    if (lvl === 0) return 'tier-unowned';
    if (lvl < 10) return 'tier-novice';
    if (lvl < 25) return 'tier-adept';
    if (lvl < 50) return 'tier-master';
    if (lvl < 100) return 'tier-grandmaster';
    return 'tier-legendary';
  };

  // Continuous micro-scaling per level (Interpolates hue, saturation, border-alpha, and glow radius)
  const getLevelCardStyle = (lvl: number): React.CSSProperties => {
    if (lvl === 0) {
      return {
        '--card-accent-border': 'rgba(255, 255, 255, 0.08)',
        '--card-accent-glow': 'none',
        '--card-tint-bg': 'transparent',
        '--badge-bg': 'rgba(255, 255, 255, 0.04)',
        '--badge-color': '#6B7280',
        '--badge-border': 'rgba(255, 255, 255, 0.08)',
        '--border-left-width': '1px',
        '--border-left-color': 'rgba(255, 255, 255, 0.08)'
      } as React.CSSProperties;
    }

    const glowRadius = Math.min(22, 3 + lvl * 0.18);
    const borderAlpha = Math.min(0.85, 0.28 + lvl * 0.006);
    const bgAlpha = Math.min(0.12, 0.025 + lvl * 0.0009);

    let hue = 38;
    let sat = 90;
    let light = 50;

    if (lvl < 15) {
      hue = 38 - (lvl / 15) * 12; // 38 -> 26 (Bronze -> Amber)
      sat = 80 + lvl * 1;
      light = 48 + lvl * 0.4;
    } else if (lvl < 45) {
      const p = (lvl - 15) / 30;
      hue = 26 - p * 34; // 26 -> -8 (352deg Red Samurai Crimson)
      if (hue < 0) hue += 360;
      sat = 90 + p * 8;
      light = 52 - p * 2;
    } else if (lvl < 90) {
      const p = (lvl - 45) / 45;
      hue = 352 + p * 53; // 352 -> 405 (45deg Radiant Gold)
      if (hue >= 360) hue -= 360;
      sat = 95;
      light = 50 + p * 7;
    } else {
      hue = 45;
      sat = 100;
      light = 58;
    }

    const accentColor = `hsl(${Math.round(hue)}, ${Math.round(sat)}%, ${Math.round(light)}%)`;
    const accentBorder = `hsla(${Math.round(hue)}, ${Math.round(sat)}%, ${Math.round(light)}%, ${borderAlpha.toFixed(2)})`;
    const tintBg = `hsla(${Math.round(hue)}, ${Math.round(sat)}%, ${Math.round(light)}%, ${bgAlpha.toFixed(3)})`;
    const glow = `0 0 ${glowRadius.toFixed(1)}px hsla(${Math.round(hue)}, ${Math.round(sat)}%, ${Math.round(light)}%, ${(borderAlpha * 0.4).toFixed(2)})`;

    return {
      '--card-accent-border': accentBorder,
      '--card-accent-glow': glow,
      '--card-tint-bg': tintBg,
      '--badge-bg': `hsla(${Math.round(hue)}, ${Math.round(sat)}%, ${Math.round(light)}%, 0.18)`,
      '--badge-color': accentColor,
      '--badge-border': accentBorder,
      '--border-left-width': lvl >= 15 ? '3px' : '2px',
      '--border-left-color': accentColor
    } as React.CSSProperties;
  };

  return (
    <div className={`panel-card upgrades-panel ${isDashboard ? 'dashboard-upgrades-panel' : 'full-upgrades-panel'}`}>
      {/* Pinned Panel Header */}
      <div className="upgrades-panel-sticky-head">
        <div className="panel-header-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h2 className="panel-title">
              <Zap size={18} color="#D20A2E" />
              UPGRADES & MASTERY
            </h2>
            <span className="upgrade-count-pill">{sortedUpgrades.length}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            {/* Multi-Criteria Sort & Filter Controls (Dedicated Upgrades Tab & 'All' Tab Only) */}
            {!isDashboard && selectedCategory === 'all' && (
              <div className="multi-sort-bar">
                {/* Affordable Only Filter Toggle */}
                <button
                  id="toggle-affordable-only"
                  className={`filter-pill-btn ${onlyAffordable ? 'active-affordable' : ''}`}
                  onClick={() => setOnlyAffordable(prev => !prev)}
                  title="Filter: Show only items you can afford right now"
                  aria-pressed={onlyAffordable}
                >
                  <CheckCircle2 size={12} />
                  <span>Affordable</span>
                </button>

                {/* Sort Metric Selector */}
                <div className="sort-filter-wrapper">
                  <ArrowUpDown size={12} className="sort-icon" />
                  <select 
                    id="upgrade-sort-select"
                    className="sort-select"
                    value={sortMetric}
                    onChange={(e) => setSortMetric(e.target.value as SortMetric)}
                    aria-label="Sort metric"
                  >
                    <option value="cost">Price / Cost</option>
                    <option value="level">Level / Mastery</option>
                    <option value="income">Income Boost</option>
                    <option value="name">Name (A-Z)</option>
                  </select>
                </div>

                {/* Direction Toggle (Low-High vs High-Low) */}
                <button
                  id="toggle-sort-order"
                  className="sort-order-btn"
                  onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                  title={`Sort Order: ${sortOrder === 'asc' ? 'Ascending (Low to High)' : 'Descending (High to Low)'}`}
                  aria-label={`Sort direction ${sortOrder}`}
                >
                  {sortOrder === 'asc' ? (
                    <>
                      <ArrowUp size={12} />
                      <span>Low</span>
                    </>
                  ) : (
                    <>
                      <ArrowDown size={12} />
                      <span>High</span>
                    </>
                  )}
                </button>

                {/* Reset Filters Icon Button */}
                <button
                  id="reset-filter-btn"
                  className={`sort-reset-btn ${sortMetric !== 'cost' || sortOrder !== 'asc' || onlyAffordable ? 'has-modifications' : ''}`}
                  onClick={() => {
                    setSortMetric('cost');
                    setSortOrder('asc');
                    setOnlyAffordable(false);
                  }}
                  title="Reset all filters and sorting to default"
                  aria-label="Reset filters"
                >
                  <RotateCcw size={12} />
                </button>
              </div>
            )}

            {/* Buy Mode Multiplier Toggle */}
            <div className="buy-mode-toggle">
              <button 
                id="buy-mode-1"
                className={`buy-mode-btn ${buyMode === 1 ? 'active' : ''}`}
                onClick={() => setBuyMode(1)}
              >
                1x
              </button>
              <button 
                id="buy-mode-10"
                className={`buy-mode-btn ${buyMode === 10 ? 'active' : ''}`}
                onClick={() => setBuyMode(10)}
              >
                10x
              </button>
              <button 
                id="buy-mode-max"
                className={`buy-mode-btn ${buyMode === 'max' ? 'active' : ''}`}
                onClick={() => setBuyMode('max')}
              >
                MAX
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="category-tabs">
          {categories.map(cat => (
            <button
              key={cat.id}
              id={`cat-tab-${cat.id}`}
              className={`category-tab-btn ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable Upgrades List */}
      <div 
        className="upgrade-list upgrade-list-scrollable" 
        tabIndex={0} 
        aria-label="Upgrades List"
        onScroll={() => setHoveredUpgrade(null)}
      >
        {sortedUpgrades.length === 0 ? (
          <div className="empty-upgrades-notice">
            <Coins size={24} color="#6B7280" />
            <p>No affordable upgrades available right now.</p>
            <button 
              className="reset-filter-btn"
              onClick={() => setOnlyAffordable(false)}
            >
              Show All Upgrades
            </button>
          </div>
        ) : (
          sortedUpgrades.map(({ upgrade, level }) => {
            let count = 1;
            let cost = 0;

            if (buyMode === 1) {
              count = 1;
              cost = calculateUpgradeCost(upgrade.baseCost, upgrade.growthRate, level, 1);
            } else if (buyMode === 10) {
              count = 10;
              cost = calculateUpgradeCost(upgrade.baseCost, upgrade.growthRate, level, 10);
            } else if (buyMode === 'max') {
              const maxAffordable = calculateMaxAffordableUpgrades(upgrade.baseCost, upgrade.growthRate, level, state.money);
              count = Math.max(1, maxAffordable.count);
              cost = maxAffordable.totalCost || calculateUpgradeCost(upgrade.baseCost, upgrade.growthRate, level, 1);
            }

            const canAfford = state.money >= cost && count > 0;
            const effectiveCount = buyMode === 'max' ? (canAfford ? count : 1) : buyMode;
            const isInspectingThis = hoveredUpgrade?.id === upgrade.id;
            const progressPct = Math.min(100, Math.max(0, cost > 0 ? (state.money / cost) * 100 : 0));

            // Dynamic batch benefit description scaled by purchase quantity
            let benefitText = '';
            if (upgrade.baseIncome > 0) {
              const batchIncome = upgrade.baseIncome * effectiveCount;
              benefitText = upgrade.isClickUpgrade
                ? formatPerClick(batchIncome, state.settings.numberFormat)
                : formatPerSecond(batchIncome, state.settings.numberFormat);
              
              if (effectiveCount > 1) {
                const singleRate = upgrade.isClickUpgrade
                  ? formatPerClick(upgrade.baseIncome, state.settings.numberFormat)
                  : formatPerSecond(upgrade.baseIncome, state.settings.numberFormat);
                benefitText += ` (${singleRate}/lvl)`;
              }
            } else if (upgrade.multiplier) {
              const basePct = Math.round((upgrade.multiplier - 1) * 100);
              const batchPct = basePct * effectiveCount;
              const targetLabel = upgrade.multiplierType === 'click' 
                ? 'Click' 
                : upgrade.multiplierType === 'passive' 
                  ? 'Passive' 
                  : 'Global';

              if (effectiveCount > 1) {
                benefitText = `+${batchPct}% ${targetLabel} (+${basePct}%/lvl)`;
              } else {
                benefitText = level > 0 
                  ? `+${basePct}% ${targetLabel} / lvl (+${basePct * level}% Active)` 
                  : `+${basePct}% ${targetLabel} / lvl`;
              }
            }

            const tierClass = getLevelTier(level);

            return (
              <div 
                key={upgrade.id}
                id={`upgrade-card-${upgrade.id}`}
                className={`upgrade-card ${tierClass} ${canAfford ? 'affordable' : ''} ${isInspectingThis ? 'hover-active-card' : ''}`}
                style={getLevelCardStyle(level)}
              >
                <div className="upgrade-left">
                  <div className="upgrade-icon-box">
                    <img 
                      src={getAssetUrl(upgrade.iconAssetId || 'emblem-sword')} 
                      alt={upgrade.name} 
                      loading="lazy"
                    />
                  </div>
                  <div className="upgrade-info">
                    <div className="upgrade-name-row">
                      <span className="upgrade-name">{upgrade.name}</span>
                      <button 
                        type="button"
                        className={`upgrade-level-badge level-badge-clickable ${tierClass}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMasteryId(upgrade.id);
                        }}
                        title={`Click to view LVL ${level} mastery contributions & lifetime impact`}
                        aria-label={`View ${upgrade.name} LVL ${level} mastery stats`}
                      >
                        LVL {level}
                      </button>
                      <button 
                        className={`eye-inspect-btn ${isInspectingThis ? 'active-eye' : ''}`}
                        title="Hover to preview Before -> After Empire Impact"
                        onMouseEnter={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setHoveredUpgrade({ id: upgrade.id, rect });
                        }}
                        onMouseLeave={() => setHoveredUpgrade(null)}
                        onClick={(e) => {
                          e.stopPropagation();
                          const rect = e.currentTarget.getBoundingClientRect();
                          setHoveredUpgrade(prev => prev?.id === upgrade.id ? null : { id: upgrade.id, rect });
                        }}
                        aria-label={`Inspect ${upgrade.name} impact`}
                      >
                        <Eye size={13} />
                      </button>
                    </div>
                    <span className="upgrade-benefit">{benefitText}</span>
                    <span className="upgrade-desc" title={upgrade.description}>
                      {upgrade.description}
                    </span>
                  </div>
                </div>

                {/* Buy Button */}
                <button
                  id={`buy-btn-${upgrade.id}`}
                  className={`upgrade-buy-btn ${canAfford ? 'affordable' : ''}`}
                  disabled={!canAfford}
                  onClick={(e) => {
                    e.stopPropagation();
                    buyUpgrade(upgrade.id, buyMode);
                  }}
                  aria-label={`Buy ${upgrade.name} for ${formatMoney(cost, state.settings.numberFormat)}`}
                >
                  <span>BUY {buyMode === 'max' ? (canAfford ? count : 1) : buyMode}</span>
                  <span>{formatMoney(cost, state.settings.numberFormat)}</span>
                </button>

                {/* Stylish Visual Affordability Progress Track */}
                {!canAfford && (
                  <div className="card-afford-progress-track">
                    <div 
                      className="card-afford-progress-fill" 
                      style={{ width: `${progressPct}%` }} 
                    />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Professional Fixed Floating Hover Popover (Always Above Eye) */}
      {hoveredData && (
        <div 
          className="upgrade-floating-popover" 
          role="tooltip"
          style={{
            position: 'fixed',
            left: Math.max(12, Math.min(window.innerWidth - 380, hoveredData.rect.left - 130)),
            bottom: Math.max(10, window.innerHeight - hoveredData.rect.top + 8),
            zIndex: 9999
          }}
        >
          <div className="popover-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <Sparkles size={13} color="#F59E0B" />
              <span className="popover-title">PROJECTED IMPACT</span>
            </div>
            <span className="popover-level-tag">LVL {hoveredData.level} → {hoveredData.level + hoveredData.impact.count}</span>
          </div>

          <div className="popover-metrics-grid">
            {/* Click Comparison */}
            {(() => {
              const hasClick = hoveredData.impact.clickDelta > 0;
              return (
                <div className={`popover-metric-row ${!hasClick ? 'metric-dimmed' : 'metric-active'}`}>
                  <div className="popover-metric-label">
                    <Zap size={12} color={hasClick ? "#F01835" : "#6B7280"} />
                    <span>Click Power:</span>
                  </div>
                  <div className="popover-metric-compare">
                    {hasClick ? (
                      <>
                        <span className="popover-val-before">
                          {formatPerClick(hoveredData.impact.currentClick, state.settings.numberFormat)}
                        </span>
                        <ArrowRight size={10} color="#6B7280" />
                        <span className="popover-val-after click-highlight">
                          {formatPerClick(hoveredData.impact.projectedClick, state.settings.numberFormat)}
                        </span>
                        <span className="popover-delta delta-click">
                          +{formatMoney(hoveredData.impact.clickDelta, state.settings.numberFormat)}
                        </span>
                      </>
                    ) : (
                      <span className="popover-no-change">
                        {formatPerClick(hoveredData.impact.currentClick, state.settings.numberFormat)} <span className="no-change-tag">(No Change)</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Passive Comparison */}
            {(() => {
              const hasPassive = hoveredData.impact.passiveDelta > 0;
              return (
                <div className={`popover-metric-row ${!hasPassive ? 'metric-dimmed' : 'metric-active'}`}>
                  <div className="popover-metric-label">
                    <TrendingUp size={12} color={hasPassive ? "#10B981" : "#6B7280"} />
                    <span>Passive Revenue:</span>
                  </div>
                  <div className="popover-metric-compare">
                    {hasPassive ? (
                      <>
                        <span className="popover-val-before">
                          {formatPerSecond(hoveredData.impact.currentPassive, state.settings.numberFormat)}
                        </span>
                        <ArrowRight size={10} color="#6B7280" />
                        <span className="popover-val-after passive-highlight">
                          {formatPerSecond(hoveredData.impact.projectedPassive, state.settings.numberFormat)}
                        </span>
                        <span className="popover-delta delta-passive">
                          +{formatMoney(hoveredData.impact.passiveDelta, state.settings.numberFormat)}/s
                        </span>
                      </>
                    ) : (
                      <span className="popover-no-change">
                        {formatPerSecond(hoveredData.impact.currentPassive, state.settings.numberFormat)} <span className="no-change-tag">(No Change)</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Total Wealth / Treasury Balance Comparison */}
            <div className="popover-metric-row metric-treasury-row">
              <div className="popover-metric-label">
                <Coins size={12} color="#F59E0B" />
                <span>Treasury Wealth:</span>
              </div>
              <div className="popover-metric-compare">
                <span className="popover-val-before">
                  {formatMoney(state.money, state.settings.numberFormat)}
                </span>
                <ArrowRight size={10} color="#6B7280" />
                <span className="popover-val-after gold-highlight">
                  {formatMoney(hoveredData.impact.remainingMoney, state.settings.numberFormat)}
                </span>
                <span className="popover-delta delta-cost">
                  -{formatMoney(hoveredData.impact.totalCost, state.settings.numberFormat)}
                </span>
              </div>
            </div>
          </div>

          <div className="popover-footer">
            <span className="popover-cost-label">Investment Cost:</span>
            <span className="popover-cost-val">
              {formatMoney(hoveredData.impact.totalCost, state.settings.numberFormat)}
            </span>
          </div>
        </div>
      )}

      {/* Interactive Mastery Lifetime Impact Modal */}
      {activeMasteryData && (
        <div className="modal-backdrop" onClick={() => setActiveMasteryId(null)}>
          <div className="modal-content mastery-impact-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Award size={18} color="#F59E0B" />
                <h3 className="modal-title">MASTERY CONTRIBUTION</h3>
              </div>
              <button 
                className="modal-close-btn" 
                onClick={() => setActiveMasteryId(null)}
                aria-label="Close mastery contribution modal"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mastery-modal-body">
              {/* Upgrade Hero Info */}
              <div className="mastery-hero-card">
                <div className="mastery-icon-box">
                  <img 
                    src={getAssetUrl(activeMasteryData.upgrade.iconAssetId || 'emblem-sword')} 
                    alt={activeMasteryData.upgrade.name} 
                  />
                </div>
                <div className="mastery-hero-info">
                  <h4 className="mastery-upgrade-name">{activeMasteryData.upgrade.name}</h4>
                  <div className="mastery-tier-badge">
                    <span>{activeMasteryData.tierName}</span>
                    <span className="mastery-lvl-pill">LVL {activeMasteryData.level}</span>
                  </div>
                </div>
              </div>

              {/* Stats & Impact Grid */}
              <div className="mastery-stats-grid">
                {/* Active Empire Output */}
                <div className="mastery-stat-card">
                  <span className="mastery-stat-label">Total Empire Output</span>
                  <span className="mastery-stat-value green-val">
                    {activeMasteryData.activeBonusText}
                  </span>
                  <span className="mastery-stat-sub">
                    {activeMasteryData.upgrade.baseIncome > 0
                      ? `${activeMasteryData.percentOfTotal.toFixed(1)}% of empire ${activeMasteryData.upgrade.isClickUpgrade ? 'click power' : 'passive revenue'}`
                      : 'Active multiplier scaling'}
                  </span>
                </div>

                {/* Lifetime Gold Invested */}
                <div className="mastery-stat-card">
                  <span className="mastery-stat-label">Total Gold Invested</span>
                  <span className="mastery-stat-value gold-val">
                    {formatMoney(activeMasteryData.totalInvested, state.settings.numberFormat)}
                  </span>
                  <span className="mastery-stat-sub">
                    Accumulated across all {activeMasteryData.level} levels
                  </span>
                </div>

                {/* Next Rank Milestone */}
                <div className="mastery-stat-card mastery-milestone-card">
                  <span className="mastery-stat-label">Next Rank Milestone</span>
                  <span className="mastery-stat-value crimson-val">
                    Target LVL {activeMasteryData.nextTierLevel}
                  </span>
                  <span className="mastery-stat-sub">
                    {activeMasteryData.levelsToNextTier > 0
                      ? `${activeMasteryData.levelsToNextTier} levels remaining to advance rank`
                      : 'Maximum rank reached'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
