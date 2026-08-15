import React, { useState, useMemo } from 'react';
import { useGame } from '../../context/GameContext';
import { TRADING_ASSETS } from '../../data/tradingAssets';
import { formatMoney, formatNumber } from '../../systems/formatting';
import { getAssetUrl } from '../../assets/assets';
import { AssetDetailView } from './AssetDetailView';
import { PortfolioView } from './PortfolioView';
import { TradeHistoryView } from './TradeHistoryView';
import { MarketNewsView } from './MarketNewsView';
import { 
  Search, 
  Star, 
  PieChart, 
  History, 
  Newspaper, 
  Coins,
  SlidersHorizontal
} from 'lucide-react';

type TradingTab = 'market' | 'portfolio' | 'history' | 'news';
type QuickFilter = 'ALL' | 'RISING' | 'FALLING' | 'OWNED' | 'WATCHLIST';
type CategoryFilter = 'all' | 'Materials' | 'Goods' | 'Equipment' | 'Luxury' | 'Treasures';

export const TradingPanel: React.FC = () => {
  const { 
    state, 
    marketRuntimes, 
    portfolioValue, 
    unrealizedProfit, 
    buyTradingAsset, 
    sellTradingAsset, 
    toggleTradingWatchlist 
  } = useGame();

  const [activeTradingTab, setActiveTradingTab] = useState<TradingTab>('market');
  const [selectedAssetId, setSelectedAssetId] = useState<string>('trade-rice');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [quickFilter, setQuickFilter] = useState<QuickFilter>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [showAdvancedFilter, setShowAdvancedFilter] = useState<boolean>(false);
  const [mobileViewMode, setMobileViewMode] = useState<'list' | 'detail'>('list');

  const tradingState = state.trading || {
    holdings: {},
    trades: [],
    watchlist: [],
    priceAlerts: {},
    totalInvested: 0,
    totalRealizedProfit: 0,
    totalWinningTrades: 0,
    totalLosingTrades: 0,
    lastSimulationTimestamp: Date.now(),
    activeEvents: [],
    news: [],
    persistedPrices: {},
    persistedCyclePositions: {}
  };

  const holdings = tradingState.holdings || {};
  const watchlist = tradingState.watchlist || [];

  // Filtered & Sorted Asset List
  const filteredAssets = useMemo(() => {
    return TRADING_ASSETS.filter(asset => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchName = asset.name.toLowerCase().includes(query);
        const matchCategory = asset.category.toLowerCase().includes(query);
        if (!matchName && !matchCategory) return false;
      }

      // 2. Category Filter
      if (categoryFilter !== 'all' && asset.category !== categoryFilter) {
        return false;
      }

      const runtime = marketRuntimes[asset.id];
      const holding = holdings[asset.id];
      const owned = holding ? holding.quantity : 0;
      const change = runtime ? runtime.priceChange24h : 0;

      // 3. Quick Filter
      if (quickFilter === 'RISING' && change <= 0) return false;
      if (quickFilter === 'FALLING' && change >= 0) return false;
      if (quickFilter === 'OWNED' && owned <= 0) return false;
      if (quickFilter === 'WATCHLIST' && !watchlist.includes(asset.id)) return false;

      return true;
    });
  }, [searchQuery, categoryFilter, quickFilter, marketRuntimes, holdings, watchlist]);

  // Selected Asset & Runtime
  const selectedAsset = useMemo(() => {
    return TRADING_ASSETS.find(a => a.id === selectedAssetId) || TRADING_ASSETS[0];
  }, [selectedAssetId]);

  const selectedRuntime = marketRuntimes[selectedAsset.id] || {
    id: selectedAsset.id,
    currentPrice: selectedAsset.startingPrice,
    previousPrice: selectedAsset.startingPrice,
    priceChange24h: 0,
    high24h: selectedAsset.startingPrice,
    low24h: selectedAsset.startingPrice,
    averagePrice: selectedAsset.startingPrice,
    trend: 'Stable' as const,
    marketPosition: 'Fair Value' as const,
    cyclePosition: 0,
    momentum: 0,
    history: {
      '1H': [],
      '6H': [],
      '24H': [],
      '7D': [],
      '30D': [],
      '90D': [],
      '1Y': []
    }
  };

  const handleSelectAsset = (assetId: string) => {
    setSelectedAssetId(assetId);
    setMobileViewMode('detail');
  };

  const handleQuickSellAll = (assetId: string) => {
    const holding = holdings[assetId];
    if (holding && holding.quantity > 0) {
      sellTradingAsset(assetId, holding.quantity);
    }
  };

  const categories: CategoryFilter[] = ['all', 'Materials', 'Goods', 'Equipment', 'Luxury', 'Treasures'];
  const activeHoldingsCount = Object.values(holdings).filter(h => h.quantity > 0).length;

  return (
    <div className="trading-market-container">
      {/* Top Compact Financial Bar */}
      <div className="trading-top-summary-card">
        <div className="summary-item">
          <span className="summary-label">YOUR CASH</span>
          <span className="summary-val cash-val">
            {formatMoney(state.money, state.settings.numberFormat)}
          </span>
        </div>

        <div className="summary-item">
          <span className="summary-label">PORTFOLIO</span>
          <span className="summary-val portfolio-val">
            {formatMoney(portfolioValue, state.settings.numberFormat)}
          </span>
        </div>

        <div className="summary-item">
          <span className="summary-label">UNREALIZED P/L</span>
          <span className={`summary-val ${unrealizedProfit >= 0 ? 'text-green' : 'text-crimson'}`}>
            {unrealizedProfit >= 0 ? '+' : ''}{formatMoney(unrealizedProfit, state.settings.numberFormat)}
          </span>
        </div>

        <div className="summary-item">
          <span className="summary-label">TRADING PROFIT</span>
          <span className={`summary-val ${(tradingState.totalRealizedProfit || 0) >= 0 ? 'text-green' : 'text-crimson'}`}>
            {(tradingState.totalRealizedProfit || 0) >= 0 ? '+' : ''}{formatMoney(tradingState.totalRealizedProfit || 0, state.settings.numberFormat)}
          </span>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="trading-nav-tabs">
        <button
          type="button"
          className={`trading-tab-btn ${activeTradingTab === 'market' ? 'active' : ''}`}
          onClick={() => {
            setActiveTradingTab('market');
            setMobileViewMode('list');
          }}
        >
          <Coins size={15} />
          <span>Market Assets</span>
        </button>

        <button
          type="button"
          className={`trading-tab-btn ${activeTradingTab === 'portfolio' ? 'active' : ''}`}
          onClick={() => setActiveTradingTab('portfolio')}
        >
          <PieChart size={15} />
          <span>My Portfolio {activeHoldingsCount > 0 && <span className="tab-pill-badge">{activeHoldingsCount}</span>}</span>
        </button>

        <button
          type="button"
          className={`trading-tab-btn ${activeTradingTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTradingTab('history')}
        >
          <History size={15} />
          <span>Trade History</span>
        </button>

        <button
          type="button"
          className={`trading-tab-btn ${activeTradingTab === 'news' ? 'active' : ''}`}
          onClick={() => setActiveTradingTab('news')}
        >
          <Newspaper size={15} />
          <span>Market News {tradingState.activeEvents && tradingState.activeEvents.length > 0 && <span className="tab-event-badge">EVENT</span>}</span>
        </button>
      </div>

      {/* Tab 1: Market Assets Desktop 2-Column Dashboard */}
      {activeTradingTab === 'market' && (
        <div className={`trading-market-layout ${mobileViewMode === 'detail' ? 'mobile-show-detail' : 'mobile-show-list'}`}>
          {/* Left Column: Independently Scrollable Asset List */}
          <div className="market-list-col">
            {/* Simple, Non-Cluttered Search & Quick Filter Bar */}
            <div className="market-filter-card">
              <div className="search-filter-primary-row">
                <div className="search-input-wrapper">
                  <Search size={14} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search assets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="market-search-input"
                  />
                </div>

                <button
                  type="button"
                  className={`filter-dropdown-toggle ${showAdvancedFilter ? 'active' : ''}`}
                  onClick={() => setShowAdvancedFilter(prev => !prev)}
                  title="Filter by category"
                >
                  <SlidersHorizontal size={13} />
                  <span>Filter</span>
                </button>
              </div>

              {/* Default Quick Filter Pills */}
              <div className="quick-filter-pills">
                {(['ALL', 'RISING', 'FALLING', 'OWNED', 'WATCHLIST'] as QuickFilter[]).map(qf => (
                  <button
                    key={qf}
                    type="button"
                    className={`qf-pill ${quickFilter === qf ? 'active' : ''}`}
                    onClick={() => setQuickFilter(qf)}
                  >
                    {qf === 'WATCHLIST' && <Star size={10} fill={quickFilter === 'WATCHLIST' ? '#F59E0B' : 'none'} style={{ marginRight: 2 }} />}
                    {qf}
                  </button>
                ))}
              </div>

              {/* Optional Advanced Category Selector Drawer */}
              {showAdvancedFilter && (
                <div className="category-filter-chips">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      type="button"
                      className={`cat-chip ${categoryFilter === cat ? 'active' : ''}`}
                      onClick={() => setCategoryFilter(cat)}
                    >
                      {cat === 'all' ? 'All' : cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Densely Packed, Scrollable Asset Cards */}
            <div className="assets-card-grid">
              {filteredAssets.length === 0 ? (
                <div className="assets-empty-grid">
                  <Coins size={32} color="#9CA3AF" />
                  <h4>No Matching Assets</h4>
                  <p>Try clearing search or filter selections.</p>
                </div>
              ) : (
                filteredAssets.map(asset => {
                  const runtime = marketRuntimes[asset.id];
                  const currentPrice = runtime?.currentPrice || asset.startingPrice;
                  const priceChange24h = runtime?.priceChange24h || 0;
                  const isPositive = priceChange24h >= 0;
                  const holding = holdings[asset.id];
                  const owned = holding?.quantity || 0;
                  const isSelected = selectedAssetId === asset.id;
                  const isStarred = watchlist.includes(asset.id);

                  // Mini Sparkline SVG coordinates
                  const points = runtime?.history?.['24H'] || [];
                  const prices = points.map(p => p.price);
                  const min = Math.min(...prices, currentPrice);
                  const max = Math.max(...prices, currentPrice);
                  const range = max - min || 1;
                  const sparklinePath = points.length > 1
                    ? points.map((pt, idx) => {
                        const x = (idx / (points.length - 1)) * 80;
                        const y = 26 - ((pt.price - min) / range) * 20 - 3;
                        return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
                      }).join(' ')
                    : 'M 0 13 L 80 13';

                  return (
                    <div
                      key={asset.id}
                      className={`market-asset-card ${isSelected ? 'selected-card' : ''}`}
                      onClick={() => handleSelectAsset(asset.id)}
                    >
                      <div className="card-left-group">
                        <div className="asset-avatar-wrap">
                          <img 
                            src={getAssetUrl(asset.assetId)} 
                            alt={asset.name} 
                            className="asset-avatar-img" 
                          />
                        </div>

                        <div className="asset-info-wrap">
                          <div className="asset-name-row">
                            <span className="asset-name-text">{asset.name}</span>
                            {isStarred && <Star size={11} fill="#F59E0B" color="#F59E0B" />}
                            {owned > 0 && <span className="card-owned-tag">{formatNumber(owned)}</span>}
                          </div>
                          <div className="asset-sub-meta">
                            <span className="asset-cat-text">{asset.category}</span>
                            <span className="dot-sep">·</span>
                            <span className={`risk-micro-tag risk-${asset.risk.toLowerCase().replace(' ', '-')}`}>{asset.risk}</span>
                          </div>
                        </div>
                      </div>

                      <div className="card-right-group">
                        <div className="asset-price-col">
                          <span className="card-price-number">
                            {formatMoney(currentPrice, state.settings.numberFormat)}
                          </span>
                          <span className={`card-change-pill ${isPositive ? 'pill-up' : 'pill-down'}`}>
                            {isPositive ? '+' : ''}{priceChange24h}%
                          </span>
                        </div>

                        {/* Mini Sparkline Chart */}
                        <div className="asset-sparkline-wrap">
                          <svg viewBox="0 0 80 26" className="sparkline-svg">
                            <path
                              d={sparklinePath}
                              fill="none"
                              stroke={isPositive ? '#10B981' : '#F01835'}
                              strokeWidth="1.8"
                              strokeLinecap="round"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Compact, Non-Scrolling Selected Asset Panel */}
          <div className="market-detail-col">
            <AssetDetailView
              asset={selectedAsset}
              runtime={selectedRuntime}
              holding={holdings[selectedAsset.id]}
              playerMoney={state.money}
              numberFormat={state.settings.numberFormat}
              isWatchlisted={watchlist.includes(selectedAsset.id)}
              onToggleWatchlist={toggleTradingWatchlist}
              onBuy={buyTradingAsset}
              onSell={sellTradingAsset}
              onBack={() => setMobileViewMode('list')}
            />
          </div>
        </div>
      )}

      {/* Tab 2: My Portfolio View */}
      {activeTradingTab === 'portfolio' && (
        <PortfolioView
          holdings={holdings}
          marketRuntimes={marketRuntimes}
          totalInvested={tradingState.totalInvested || 0}
          totalRealizedProfit={tradingState.totalRealizedProfit || 0}
          numberFormat={state.settings.numberFormat}
          onSelectAsset={(id) => {
            setSelectedAssetId(id);
            setActiveTradingTab('market');
            setMobileViewMode('detail');
          }}
          onQuickSellAll={handleQuickSellAll}
        />
      )}

      {/* Tab 3: Trade History View */}
      {activeTradingTab === 'history' && (
        <TradeHistoryView
          trades={tradingState.trades || []}
          numberFormat={state.settings.numberFormat}
        />
      )}

      {/* Tab 4: Market News & Events View */}
      {activeTradingTab === 'news' && (
        <MarketNewsView
          news={tradingState.news || []}
          events={tradingState.activeEvents || []}
          onSelectAsset={(id) => {
            setSelectedAssetId(id);
            setActiveTradingTab('market');
            setMobileViewMode('detail');
          }}
        />
      )}
    </div>
  );
};
