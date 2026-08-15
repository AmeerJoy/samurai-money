import React, { useState } from 'react';
import { 
  TradingAssetDefinition, 
  TradingAssetRuntime, 
  PlayerHolding, 
  TimeRange 
} from '../../types/trading';
import { formatMoney, formatNumber } from '../../systems/formatting';
import { getAssetUrl } from '../../assets/assets';
import { TradingPriceChart } from './TradingPriceChart';
import { 
  Star, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Plus, 
  Info, 
  Layers, 
  X 
} from 'lucide-react';

interface AssetDetailViewProps {
  asset: TradingAssetDefinition;
  runtime: TradingAssetRuntime;
  holding?: PlayerHolding;
  playerMoney: number;
  numberFormat?: 'standard' | 'scientific';
  isWatchlisted: boolean;
  onToggleWatchlist: (assetId: string) => void;
  onBuy: (assetId: string, quantity: number) => void;
  onSell: (assetId: string, quantity: number) => void;
  onClose?: () => void;
}

export const AssetDetailView: React.FC<AssetDetailViewProps> = ({
  asset,
  runtime,
  holding,
  playerMoney,
  numberFormat = 'standard',
  isWatchlisted,
  onToggleWatchlist,
  onBuy,
  onSell,
  onClose
}) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('7D');
  const [activeMode, setActiveMode] = useState<'BUY' | 'SELL'>('BUY');
  const [quantity, setQuantity] = useState<number>(1);

  const ownedQuantity = holding?.quantity || 0;
  const avgBuyPrice = holding?.averageBuyPrice || 0;
  const currentPrice = runtime.currentPrice;
  const positionValue = ownedQuantity * currentPrice;
  const costBasis = ownedQuantity * avgBuyPrice;
  const unrealizedProfit = positionValue - costBasis;
  const returnPercentage = costBasis > 0 ? (unrealizedProfit / costBasis) * 100 : 0;

  // Max calculations
  const maxAffordable = Math.floor(playerMoney / currentPrice);
  const maxBuyAllowed = Math.min(asset.maxTransactionQuantity, maxAffordable);
  const maxSellAllowed = ownedQuantity;

  const currentMax = activeMode === 'BUY' ? maxBuyAllowed : maxSellAllowed;

  // Quick percentage selection
  const handleSetPercent = (pct: number) => {
    if (activeMode === 'BUY') {
      const target = Math.floor(maxAffordable * (pct / 100));
      setQuantity(Math.max(1, Math.min(maxBuyAllowed, target)));
    } else {
      const target = Math.floor(ownedQuantity * (pct / 100));
      setQuantity(Math.max(1, Math.min(maxSellAllowed, target)));
    }
  };

  const handleAdjustQuantity = (delta: number) => {
    setQuantity(prev => {
      const next = prev + delta;
      return Math.max(1, Math.min(currentMax || 1, next));
    });
  };

  const handleExecuteTrade = () => {
    if (quantity <= 0) return;
    if (activeMode === 'BUY') {
      onBuy(asset.id, quantity);
      setQuantity(1);
    } else {
      onSell(asset.id, quantity);
      setQuantity(1);
    }
  };

  // Calculations for trade confirmation preview
  const totalCost = quantity * currentPrice;
  const moneyRemaining = playerMoney - totalCost;
  const estimatedRevenue = quantity * currentPrice;
  const estimatedProfit = avgBuyPrice > 0 ? (currentPrice - avgBuyPrice) * quantity : 0;
  const remainingOwned = ownedQuantity - quantity;

  const isPositive24h = runtime.priceChange24h >= 0;

  return (
    <div className="trading-detail-view">
      {/* Top Asset Identity Header */}
      <div className="detail-header-card">
        <div className="detail-header-left">
          <div className="detail-asset-avatar-box">
            <img 
              src={getAssetUrl(asset.assetId)} 
              alt={asset.name} 
              className="detail-asset-img" 
            />
          </div>

          <div className="detail-asset-meta">
            <div className="detail-title-row">
              <h2 className="detail-asset-name">{asset.name}</h2>
              <button 
                type="button"
                className={`watchlist-star-btn ${isWatchlisted ? 'starred' : ''}`}
                onClick={() => onToggleWatchlist(asset.id)}
                title={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
              >
                <Star size={16} fill={isWatchlisted ? '#F59E0B' : 'none'} />
              </button>
            </div>

            <div className="detail-tags-row">
              <span className="asset-cat-tag">{asset.category}</span>
              <span className={`asset-risk-badge risk-${asset.risk.toLowerCase().replace(' ', '-')}`}>
                {asset.risk} Risk
              </span>
              <span className="asset-personality-tag">{asset.personality.replace('_', ' ').toUpperCase()}</span>
            </div>
          </div>
        </div>

        {onClose && (
          <button type="button" className="detail-close-btn" onClick={onClose} title="Close Asset Details">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Main Big Price Display */}
      <div className="detail-price-display-row">
        <div className="detail-price-main">
          <span className="price-big-number">
            {formatMoney(currentPrice, numberFormat)}
          </span>
          <div className={`price-change-pill ${isPositive24h ? 'change-up' : 'change-down'}`}>
            {isPositive24h ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            <span>{isPositive24h ? '+' : ''}{runtime.priceChange24h}% (24H)</span>
          </div>
        </div>

        {/* Market Position Gauge */}
        <div className="market-position-card" title="Historical Price Range Position">
          <span className="position-label">MARKET POSITION</span>
          <span className={`position-val position-${runtime.marketPosition.toLowerCase().replace(' ', '-')}`}>
            {runtime.marketPosition}
          </span>
          <div className="position-bar-track">
            <div 
              className="position-bar-thumb"
              style={{
                left: `${Math.min(95, Math.max(5, ((currentPrice - asset.minimumPrice) / (asset.maximumPrice - asset.minimumPrice || 1)) * 100))}%`
              }}
            />
          </div>
        </div>
      </div>

      {/* Interactive Price History Chart */}
      <TradingPriceChart
        history={runtime.history}
        currentPrice={currentPrice}
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        numberFormat={numberFormat}
      />

      {/* Market Statistics Grid */}
      <div className="detail-stats-grid">
        <div className="stat-card">
          <span className="stat-title">24H HIGH</span>
          <span className="stat-val">{formatMoney(runtime.high24h, numberFormat)}</span>
        </div>
        <div className="stat-card">
          <span className="stat-title">24H LOW</span>
          <span className="stat-val">{formatMoney(runtime.low24h, numberFormat)}</span>
        </div>
        <div className="stat-card">
          <span className="stat-title">24H AVERAGE</span>
          <span className="stat-val">{formatMoney(runtime.averagePrice, numberFormat)}</span>
        </div>
        <div className="stat-card">
          <span className="stat-title">MAX TRANSACTION</span>
          <span className="stat-val">{formatNumber(asset.maxTransactionQuantity)}</span>
        </div>
      </div>

      {/* Player Holdings Information Card */}
      <div className="detail-holdings-card">
        <div className="holdings-header">
          <div className="holdings-title">
            <Layers size={14} color="#F59E0B" />
            <span>YOUR HOLDINGS</span>
          </div>
          {ownedQuantity > 0 && (
            <span className="holdings-owned-badge">{formatNumber(ownedQuantity)} units</span>
          )}
        </div>

        {ownedQuantity > 0 ? (
          <div className="holdings-metrics-grid">
            <div className="holding-metric">
              <span className="hm-label">Total Value</span>
              <span className="hm-val">{formatMoney(positionValue, numberFormat)}</span>
            </div>
            <div className="holding-metric">
              <span className="hm-label">Avg Buy Price</span>
              <span className="hm-val">{formatMoney(avgBuyPrice, numberFormat)}</span>
            </div>
            <div className="holding-metric">
              <span className="hm-label">Unrealized P/L</span>
              <span className={`hm-val ${unrealizedProfit >= 0 ? 'text-green' : 'text-crimson'}`}>
                {unrealizedProfit >= 0 ? '+' : ''}{formatMoney(unrealizedProfit, numberFormat)}
              </span>
            </div>
            <div className="holding-metric">
              <span className="hm-label">Return</span>
              <span className={`hm-val ${returnPercentage >= 0 ? 'text-green' : 'text-crimson'}`}>
                {returnPercentage >= 0 ? '+' : ''}{returnPercentage.toFixed(2)}%
              </span>
            </div>
          </div>
        ) : (
          <div className="holdings-empty-state">
            <span>You currently own no {asset.name}. Buy low to start building a trading position!</span>
          </div>
        )}
      </div>

      {/* Trade Execution Action Panel */}
      <div className="detail-trade-panel">
        <div className="trade-mode-tabs">
          <button
            type="button"
            className={`trade-mode-btn buy-tab ${activeMode === 'BUY' ? 'active' : ''}`}
            onClick={() => {
              setActiveMode('BUY');
              setQuantity(1);
            }}
          >
            BUY {asset.name.toUpperCase()}
          </button>
          <button
            type="button"
            className={`trade-mode-btn sell-tab ${activeMode === 'SELL' ? 'active' : ''}`}
            onClick={() => {
              setActiveMode('SELL');
              setQuantity(Math.min(1, ownedQuantity));
            }}
            disabled={ownedQuantity <= 0}
          >
            SELL {asset.name.toUpperCase()} {ownedQuantity > 0 ? `(${formatNumber(ownedQuantity)})` : ''}
          </button>
        </div>

        <div className="trade-body">
          {/* Quantity Controls */}
          <div className="trade-qty-control-row">
            <span className="qty-label">Quantity:</span>
            <div className="qty-stepper-box">
              <button 
                type="button" 
                className="qty-step-btn"
                onClick={() => handleAdjustQuantity(-1)}
                disabled={quantity <= 1}
              >
                <Minus size={14} />
              </button>

              <input
                type="number"
                min="1"
                max={currentMax || 1}
                value={quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (!isNaN(val)) {
                    setQuantity(Math.max(1, Math.min(currentMax || 1, val)));
                  }
                }}
                className="qty-number-input"
              />

              <button 
                type="button" 
                className="qty-step-btn"
                onClick={() => handleAdjustQuantity(1)}
                disabled={quantity >= (currentMax || 1)}
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Quick Percentage Chips */}
          <div className="trade-pct-chips">
            <button type="button" className="pct-chip" onClick={() => handleSetPercent(10)}>10%</button>
            <button type="button" className="pct-chip" onClick={() => handleSetPercent(25)}>25%</button>
            <button type="button" className="pct-chip" onClick={() => handleSetPercent(50)}>50%</button>
            <button type="button" className="pct-chip pct-max" onClick={() => handleSetPercent(100)}>MAX</button>
          </div>

          {/* Trade Cost / Revenue Summary Box */}
          <div className="trade-summary-card">
            {activeMode === 'BUY' ? (
              <>
                <div className="summary-line">
                  <span className="sl-label">Total Cost:</span>
                  <span className="sl-val cost-val">{formatMoney(totalCost, numberFormat)}</span>
                </div>
                <div className="summary-line">
                  <span className="sl-label">Money Remaining:</span>
                  <span className={`sl-val ${moneyRemaining < 0 ? 'text-crimson' : ''}`}>
                    {formatMoney(Math.max(0, moneyRemaining), numberFormat)}
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="summary-line">
                  <span className="sl-label">Estimated Revenue:</span>
                  <span className="sl-val revenue-val">+{formatMoney(estimatedRevenue, numberFormat)}</span>
                </div>
                <div className="summary-line">
                  <span className="sl-label">Estimated Profit:</span>
                  <span className={`sl-val ${estimatedProfit >= 0 ? 'text-green' : 'text-crimson'}`}>
                    {estimatedProfit >= 0 ? '+' : ''}{formatMoney(estimatedProfit, numberFormat)}
                  </span>
                </div>
                <div className="summary-line">
                  <span className="sl-label">Remaining Units:</span>
                  <span className="sl-val">{formatNumber(remainingOwned)}</span>
                </div>
              </>
            )}
          </div>

          {/* Main Execution Button */}
          <button
            type="button"
            className={`trade-execute-btn ${activeMode === 'BUY' ? 'btn-buy' : 'btn-sell'}`}
            onClick={handleExecuteTrade}
            disabled={
              activeMode === 'BUY' 
                ? (quantity <= 0 || totalCost > playerMoney)
                : (quantity <= 0 || quantity > ownedQuantity)
            }
          >
            {activeMode === 'BUY' ? (
              totalCost > playerMoney ? 'INSUFFICIENT FUNDS' : `BUY ${formatNumber(quantity)} ${asset.name.toUpperCase()}`
            ) : (
              ownedQuantity <= 0 ? 'NO ASSETS OWNED' : `SELL ${formatNumber(quantity)} ${asset.name.toUpperCase()}`
            )}
          </button>
        </div>
      </div>

      {/* Description & Lore Text */}
      <div className="detail-lore-card">
        <div className="lore-title">
          <Info size={13} color="#9CA3AF" />
          <span>ABOUT THIS COMMODITY</span>
        </div>
        <p className="lore-description">{asset.description}</p>
        <p className="lore-flavor">{asset.lore}</p>
      </div>
    </div>
  );
};
