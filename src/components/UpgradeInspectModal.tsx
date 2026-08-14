import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { UPGRADES } from '../data/upgrades';
import { simulateUpgradeImpact } from '../systems/economy';
import { formatMoney, formatPerClick, formatPerSecond } from '../systems/formatting';
import { getAssetUrl } from '../assets/assets';
import { X, TrendingUp, Zap, Coins, Check, ShieldAlert, ArrowRight } from 'lucide-react';

interface UpgradeInspectModalProps {
  upgradeId: string | null;
  initialBuyMode?: 1 | 10 | 'max';
  onClose: () => void;
}

export const UpgradeInspectModal: React.FC<UpgradeInspectModalProps> = ({
  upgradeId,
  initialBuyMode = 1,
  onClose
}) => {
  const { state, buyUpgrade } = useGame();
  const [modalBuyMode, setModalBuyMode] = useState<1 | 10 | 'max'>(initialBuyMode);

  if (!upgradeId) return null;

  const upgrade = UPGRADES.find(u => u.id === upgradeId);
  if (!upgrade) return null;

  const currentLevel = state.upgradeLevels[upgradeId] || 0;
  const impact = simulateUpgradeImpact(state, upgradeId, modalBuyMode);
  const targetLevel = currentLevel + impact.count;

  const handlePurchase = () => {
    if (impact.canAfford) {
      buyUpgrade(upgradeId, modalBuyMode);
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-content inspect-modal-card" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <TrendingUp size={18} color="#F59E0B" />
            <h3 className="modal-title">EMPIRE IMPACT PREVIEW</h3>
          </div>
          <button 
            className="modal-close-btn" 
            onClick={onClose}
            aria-label="Close Preview"
          >
            <X size={18} />
          </button>
        </div>

        {/* Upgrade Summary Box */}
        <div className="inspect-upgrade-summary">
          <div className="inspect-icon-frame">
            <img 
              src={getAssetUrl(upgrade.iconAssetId || 'emblem-sword')} 
              alt={upgrade.name} 
            />
          </div>
          <div className="inspect-upgrade-details">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span className="inspect-upgrade-name">{upgrade.name}</span>
              <span className="inspect-category-badge">{upgrade.category.toUpperCase()}</span>
            </div>
            <p className="inspect-upgrade-desc">{upgrade.description}</p>
            <div className="inspect-level-progression">
              <span>LVL {currentLevel}</span>
              <ArrowRight size={14} color="#F59E0B" />
              <span className="level-next-tag">LVL {targetLevel}</span>
              <span className="inspect-count-label">(+{impact.count} Levels)</span>
            </div>
          </div>
        </div>

        {/* Batch Quantity Selector */}
        <div className="inspect-buy-mode-row">
          <span className="inspect-selector-label">Simulate Quantity:</span>
          <div className="buy-mode-toggle">
            <button 
              className={`buy-mode-btn ${modalBuyMode === 1 ? 'active' : ''}`}
              onClick={() => setModalBuyMode(1)}
            >
              1x
            </button>
            <button 
              className={`buy-mode-btn ${modalBuyMode === 10 ? 'active' : ''}`}
              onClick={() => setModalBuyMode(10)}
            >
              10x
            </button>
            <button 
              className={`buy-mode-btn ${modalBuyMode === 'max' ? 'active' : ''}`}
              onClick={() => setModalBuyMode('max')}
            >
              MAX
            </button>
          </div>
        </div>

        {/* Before vs After Impact Box */}
        <div className="inspect-projection-box">
          <h4 className="inspect-projection-heading">PROJECTED EMPIRE REVENUE</h4>

          {/* Click Strike Row */}
          {(() => {
            const hasClick = impact.clickDelta > 0;
            return (
              <div className={`projection-metric-row ${!hasClick ? 'metric-dimmed' : 'metric-active'}`}>
                <div className="metric-label-col">
                  <Zap size={14} color={hasClick ? "#F01835" : "#6B7280"} />
                  <span>Click Strike Power</span>
                </div>
                <div className="metric-comparison-col">
                  {hasClick ? (
                    <>
                      <span className="metric-before">
                        {formatPerClick(impact.currentClick, state.settings.numberFormat)}
                      </span>
                      <ArrowRight size={12} color="#6B7280" />
                      <span className="metric-after click-highlight">
                        {formatPerClick(impact.projectedClick, state.settings.numberFormat)}
                      </span>
                      <span className="metric-delta-pill delta-click">
                        +{formatMoney(impact.clickDelta, state.settings.numberFormat)}
                      </span>
                    </>
                  ) : (
                    <span className="metric-no-change">
                      {formatPerClick(impact.currentClick, state.settings.numberFormat)} <span className="no-change-tag">(No Change)</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })()}

          {/* Passive Revenue Row */}
          {(() => {
            const hasPassive = impact.passiveDelta > 0;
            return (
              <div className={`projection-metric-row ${!hasPassive ? 'metric-dimmed' : 'metric-active'}`}>
                <div className="metric-label-col">
                  <TrendingUp size={14} color={hasPassive ? "#10B981" : "#6B7280"} />
                  <span>Passive Revenue / sec</span>
                </div>
                <div className="metric-comparison-col">
                  {hasPassive ? (
                    <>
                      <span className="metric-before">
                        {formatPerSecond(impact.currentPassive, state.settings.numberFormat)}
                      </span>
                      <ArrowRight size={12} color="#6B7280" />
                      <span className="metric-after passive-highlight">
                        {formatPerSecond(impact.projectedPassive, state.settings.numberFormat)}
                      </span>
                      <span className="metric-delta-pill delta-passive">
                        +{formatMoney(impact.passiveDelta, state.settings.numberFormat)}/s
                      </span>
                    </>
                  ) : (
                    <span className="metric-no-change">
                      {formatPerSecond(impact.currentPassive, state.settings.numberFormat)} <span className="no-change-tag">(No Change)</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })()}

          {/* Treasury Impact Row */}
          <div className="projection-metric-row treasury-impact-row">
            <div className="metric-label-col">
              <Coins size={14} color="#F59E0B" />
              <span>Treasury Balance</span>
            </div>
            <div className="metric-comparison-col">
              <span className="metric-before">
                {formatMoney(state.money, state.settings.numberFormat)}
              </span>
              <ArrowRight size={12} color="#6B7280" />
              <span className="metric-after gold-highlight">
                {formatMoney(impact.remainingMoney, state.settings.numberFormat)}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="inspect-modal-footer">
          <button 
            className="secondary-modal-btn" 
            onClick={onClose}
          >
            Cancel
          </button>
          
          <button 
            className={`primary-modal-btn ${!impact.canAfford ? 'disabled' : ''}`}
            disabled={!impact.canAfford}
            onClick={handlePurchase}
          >
            {impact.canAfford ? (
              <>
                <Check size={16} />
                <span>CONFIRM PURCHASE — {formatMoney(impact.totalCost, state.settings.numberFormat)}</span>
              </>
            ) : (
              <>
                <ShieldAlert size={16} />
                <span>NEED {formatMoney(impact.totalCost - state.money, state.settings.numberFormat)} MORE</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
