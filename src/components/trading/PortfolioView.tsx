import React from 'react';
import { PlayerHolding, TradingAssetRuntime } from '../../types/trading';
import { TRADING_ASSETS } from '../../data/tradingAssets';
import { formatMoney, formatNumber } from '../../systems/formatting';
import { getAssetUrl } from '../../assets/assets';
import { PieChart } from 'lucide-react';

interface PortfolioViewProps {
  holdings: Record<string, PlayerHolding>;
  marketRuntimes: Record<string, TradingAssetRuntime>;
  totalInvested?: number;
  totalRealizedProfit: number;
  numberFormat?: 'standard' | 'scientific';
  onSelectAsset: (assetId: string) => void;
  onQuickSellAll: (assetId: string) => void;
}

export const PortfolioView: React.FC<PortfolioViewProps> = ({
  holdings,
  marketRuntimes,
  totalRealizedProfit,
  numberFormat = 'standard',
  onSelectAsset,
  onQuickSellAll
}) => {
  // Filter active holdings
  const activeHoldings = Object.values(holdings).filter(h => h.quantity > 0);

  // Compute total current value & unrealized profit
  let totalCurrentValue = 0;
  let totalCostBasis = 0;

  const enrichedHoldings = activeHoldings.map(h => {
    const asset = TRADING_ASSETS.find(a => a.id === h.assetId);
    const runtime = marketRuntimes[h.assetId];
    const currentPrice = runtime?.currentPrice || h.averageBuyPrice;
    const value = h.quantity * currentPrice;
    const costBasis = h.quantity * h.averageBuyPrice;
    const profit = value - costBasis;
    const returnPct = costBasis > 0 ? (profit / costBasis) * 100 : 0;

    totalCurrentValue += value;
    totalCostBasis += costBasis;

    return {
      holding: h,
      asset,
      value,
      profit,
      returnPct
    };
  });

  const totalUnrealizedProfit = totalCurrentValue - totalCostBasis;
  const totalReturnPct = totalCostBasis > 0 ? (totalUnrealizedProfit / totalCostBasis) * 100 : 0;

  if (activeHoldings.length === 0) {
    return (
      <div className="portfolio-empty-view">
        <div className="portfolio-empty-box">
          <PieChart size={48} className="empty-portfolio-icon" />
          <h3 className="empty-portfolio-title">No Active Investments</h3>
          <p className="empty-portfolio-desc">
            Your investment portfolio is currently empty. Browse the unified trading market, find undervalued commodities, and purchase assets to start building wealth!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="portfolio-view-container">
      {/* Portfolio Grand Metrics Header */}
      <div className="portfolio-metrics-card">
        <div className="pm-main-display">
          <span className="pm-label">TOTAL PORTFOLIO VALUE</span>
          <span className="pm-value">{formatMoney(totalCurrentValue, numberFormat)}</span>
        </div>

        <div className="pm-sub-grid">
          <div className="pm-sub-box">
            <span className="pm-sub-label">Cost Basis (Invested)</span>
            <span className="pm-sub-val">{formatMoney(totalCostBasis, numberFormat)}</span>
          </div>

          <div className="pm-sub-box">
            <span className="pm-sub-label">Unrealized P/L</span>
            <span className={`pm-sub-val ${totalUnrealizedProfit >= 0 ? 'text-green' : 'text-crimson'}`}>
              {totalUnrealizedProfit >= 0 ? '+' : ''}{formatMoney(totalUnrealizedProfit, numberFormat)} ({totalReturnPct.toFixed(2)}%)
            </span>
          </div>

          <div className="pm-sub-box">
            <span className="pm-sub-label">Lifetime Realized Profit</span>
            <span className={`pm-sub-val ${totalRealizedProfit >= 0 ? 'text-green' : 'text-crimson'}`}>
              {totalRealizedProfit >= 0 ? '+' : ''}{formatMoney(totalRealizedProfit, numberFormat)}
            </span>
          </div>

          <div className="pm-sub-box">
            <span className="pm-sub-label">Distinct Assets</span>
            <span className="pm-sub-val">{activeHoldings.length} Assets</span>
          </div>
        </div>
      </div>

      {/* Holdings List Header */}
      <div className="portfolio-list-header">
        <span>HOLDINGS BREAKDOWN</span>
        <span className="pl-count">{activeHoldings.length} Positions</span>
      </div>

      {/* Holdings Cards List */}
      <div className="portfolio-holdings-list">
        {enrichedHoldings.map(({ holding, asset, value, profit, returnPct }) => {
          if (!asset) return null;
          const isProfitable = profit >= 0;
          const portfolioSharePct = totalCurrentValue > 0 ? (value / totalCurrentValue) * 100 : 0;

          return (
            <div 
              key={holding.assetId} 
              className="portfolio-holding-row"
              onClick={() => onSelectAsset(holding.assetId)}
            >
              <div className="ph-left">
                <img 
                  src={getAssetUrl(asset.assetId)} 
                  alt={asset.name} 
                  className="ph-avatar" 
                />
                <div className="ph-meta">
                  <div className="ph-name-row">
                    <span className="ph-name">{asset.name}</span>
                    <span className="ph-cat-badge">{asset.category}</span>
                  </div>
                  <div className="ph-quantity-row">
                    <span>{formatNumber(holding.quantity)} units @ {formatMoney(holding.averageBuyPrice, numberFormat)}</span>
                  </div>
                </div>
              </div>

              <div className="ph-center">
                {/* Allocation bar */}
                <div className="ph-share-pill" title={`Represents ${portfolioSharePct.toFixed(1)}% of total portfolio`}>
                  {portfolioSharePct.toFixed(1)}% of Portfolio
                </div>
                <div className="ph-share-bar-track">
                  <div 
                    className="ph-share-bar-fill" 
                    style={{ width: `${portfolioSharePct}%` }} 
                  />
                </div>
              </div>

              <div className="ph-right">
                <div className="ph-value-col">
                  <span className="ph-current-val">{formatMoney(value, numberFormat)}</span>
                  <span className={`ph-profit-tag ${isProfitable ? 'profit-up' : 'profit-down'}`}>
                    {isProfitable ? '+' : ''}{formatMoney(profit, numberFormat)} ({returnPct.toFixed(1)}%)
                  </span>
                </div>

                <button
                  type="button"
                  className="ph-sell-all-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onQuickSellAll(holding.assetId);
                  }}
                  title="Liquidate full position"
                >
                  Sell All
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
