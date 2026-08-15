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
  Minus, 
  Plus, 
  ChevronDown,
  ArrowLeft
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
  onBack?: () => void;
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
  onBack
}) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('6H');
  const [activeMode, setActiveMode] = useState<'BUY' | 'SELL'>('BUY');
  const [quantity, setQuantity] = useState<number>(1);
  const [showMarketDetails, setShowMarketDetails] = useState<boolean>(false);

  const ownedQuantity = holding?.quantity || 0;
  const avgBuyPrice = holding?.averageBuyPrice || 0;
  const currentPrice = runtime.currentPrice;
  const positionValue = ownedQuantity * currentPrice;
  const costBasis = ownedQuantity * avgBuyPrice;
  const unrealizedProfit = positionValue - costBasis;
  const returnPercentage = costBasis > 0 ? (unrealizedProfit / costBasis) * 100 : 0;

  // Max calculations
  const maxCapacityLeft = Math.max(0, asset.maxTransactionQuantity - ownedQuantity);
  const maxAffordable = Math.floor(playerMoney / currentPrice);
  const maxBuyAllowed = Math.min(maxCapacityLeft, maxAffordable);
  const maxSellAllowed = ownedQuantity;

  const currentMax = activeMode === 'BUY' ? maxBuyAllowed : maxSellAllowed;
  const isAtMaxCapacity = activeMode === 'BUY' && maxCapacityLeft <= 0;
  const isInsufficientFunds = activeMode === 'BUY' && !isAtMaxCapacity && (maxAffordable <= 0 || (quantity * currentPrice) > playerMoney);

  // Quick percentage selection
  const handleSetPercent = (pct: number) => {
    if (activeMode === 'BUY') {
      if (maxBuyAllowed <= 0) return;
      const target = Math.floor(maxBuyAllowed * (pct / 100));
      setQuantity(Math.max(1, Math.min(maxBuyAllowed, target || 1)));
    } else {
      if (maxSellAllowed <= 0) return;
      const target = Math.floor(ownedQuantity * (pct / 100));
      setQuantity(Math.max(1, Math.min(maxSellAllowed, target || 1)));
    }
  };

  const handleAdjustQuantity = (delta: number) => {
    if (currentMax <= 0) return;
    setQuantity(prev => {
      const next = prev + delta;
      return Math.max(1, Math.min(currentMax, next));
    });
  };

  const handleExecuteTrade = () => {
    if (quantity <= 0) return;
    if (activeMode === 'BUY') {
      if (maxBuyAllowed <= 0 || totalCost > playerMoney) return;
      onBuy(asset.id, Math.min(quantity, maxBuyAllowed));
      setQuantity(1);
    } else {
      if (ownedQuantity <= 0) return;
      onSell(asset.id, Math.min(quantity, ownedQuantity));
      setQuantity(1);
    }
  };

  // Calculations for trade confirmation preview
  const totalCost = quantity * currentPrice;
  const moneyRemaining = playerMoney - totalCost;
  const estimatedRevenue = quantity * currentPrice;
  const estimatedProfit = avgBuyPrice > 0 ? (currentPrice - avgBuyPrice) * quantity : 0;

  const isPositive24h = runtime.priceChange24h >= 0;

  return (
    <div className="trading-detail-view">
      {/* Top Header: Identity + Price + Change + Market Position */}
      <div className="detail-top-summary-header">
        {onBack && (
          <button type="button" className="detail-mobile-back-btn" onClick={onBack}>
            <ArrowLeft size={16} />
            <span>BACK TO MARKET</span>
          </button>
        )}

        <div className="detail-identity-row">
          <div className="detail-avatar-box">
            <img 
              src={getAssetUrl(asset.assetId)} 
              alt={asset.name} 
              className="detail-avatar-img"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/materials/rice.png';
              }} 
            />
          </div>

          <div className="detail-title-col">
            <div className="detail-name-star-row">
              <span className="detail-name-text">{asset.name.toUpperCase()}</span>
              <button 
                type="button" 
                className={`watchlist-star-btn ${isWatchlisted ? 'starred' : ''}`}
                onClick={() => onToggleWatchlist(asset.id)}
                title={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
              >
                <Star size={15} fill={isWatchlisted ? '#F59E0B' : 'none'} />
              </button>
            </div>
            <div className="detail-sub-meta">
              <span className="category-tag">{asset.category}</span>
              <span className="meta-dot">·</span>
              <span className="risk-tag text-green">{asset.risk} Risk</span>
            </div>
          </div>

          <div className="detail-price-col">
            <span className="detail-price-num">{formatMoney(currentPrice, numberFormat)}</span>
            <div className="detail-price-sub">
              <span className={`price-today-tag ${isPositive24h ? 'text-green' : 'text-crimson'}`}>
                {isPositive24h ? '↗ +' : '↘ '}
                {Math.abs(runtime.priceChange24h).toFixed(1)}% today
              </span>
              <span className="meta-dot">·</span>
              <span className="position-tag text-gold">{runtime.marketPosition}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Price Trend Chart */}
      <TradingPriceChart
        history={runtime.history}
        currentPrice={currentPrice}
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        numberFormat={numberFormat}
      />

      {/* 24H Quick Stats Bar */}
      <div className="market-stats-compact-bar">
        <div className="stats-metric-item">
          <span className="smi-label">24H HIGH</span>
          <span className="smi-val">{formatMoney(runtime.high24h, numberFormat)}</span>
        </div>
        <div className="stats-metric-item">
          <span className="smi-label">24H LOW</span>
          <span className="smi-val">{formatMoney(runtime.low24h, numberFormat)}</span>
        </div>
        <div className="stats-metric-item">
          <span className="smi-label">AVERAGE</span>
          <span className="smi-val">{formatMoney(runtime.averagePrice, numberFormat)}</span>
        </div>
        <button 
          type="button" 
          className="market-details-toggle-btn"
          onClick={() => setShowMarketDetails(!showMarketDetails)}
        >
          <span>DETAILS</span>
          <ChevronDown size={12} style={{ transform: showMarketDetails ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </button>
      </div>

      {showMarketDetails && (
        <div className="market-details-expanded-card">
          <div className="detail-param-row">
            <span className="param-label">Personality:</span>
            <span className="param-val">{asset.personality.replace('_', ' ').toUpperCase()}</span>
          </div>
          <div className="detail-param-row">
            <span className="param-label">Cycle Time:</span>
            <span className="param-val">{asset.cycleLengthSeconds}s</span>
          </div>
          <div className="detail-param-row">
            <span className="param-label">Min Price:</span>
            <span className="param-val">{formatMoney(asset.minimumPrice, numberFormat)}</span>
          </div>
          <div className="detail-param-row">
            <span className="param-label">Max Price:</span>
            <span className="param-val">{formatMoney(asset.maximumPrice, numberFormat)}</span>
          </div>
          <div className="detail-param-row">
            <span className="param-label">Holding Capacity:</span>
            <span className="param-val">{formatNumber(asset.maxTransactionQuantity)}</span>
          </div>
        </div>
      )}

      {/* Player Holdings Summary */}
      <div className="detail-holdings-compact">
        <div className="holdings-compact-top">
          <span className="hc-title">YOUR HOLDINGS</span>
          {ownedQuantity > 0 && (
            <span className="hc-count">{formatNumber(ownedQuantity)} {asset.name.toUpperCase()}</span>
          )}
        </div>

        {ownedQuantity > 0 ? (
          <div className="holdings-compact-metrics">
            <div className="hcm-box">
              <span className="hcm-label">Avg. Buy</span>
              <span className="hcm-val">{formatMoney(avgBuyPrice, numberFormat)}</span>
            </div>
            <div className="hcm-box">
              <span className="hcm-label">Current Value</span>
              <span className="hcm-val">{formatMoney(positionValue, numberFormat)}</span>
            </div>
            <div className="hcm-box">
              <span className="hcm-label">Profit / Loss</span>
              <span className={`hcm-val ${unrealizedProfit >= 0 ? 'text-green' : 'text-crimson'}`}>
                {unrealizedProfit >= 0 ? '+' : ''}{formatMoney(unrealizedProfit, numberFormat)} ({returnPercentage.toFixed(1)}%)
              </span>
            </div>
          </div>
        ) : (
          <div className="holdings-none-sub">
            You don't own this asset yet. Buy when below average to profit on rising cycles!
          </div>
        )}
      </div>

      {/* Trade Execution Panel */}
      <div className="detail-trade-panel">
        <div className="trade-mode-tabs">
          <button
            type="button"
            className={`trade-mode-btn buy-tab ${activeMode === 'BUY' ? 'active' : ''}`}
            onClick={() => { setActiveMode('BUY'); setQuantity(1); }}
          >
            BUY {isAtMaxCapacity ? '(MAX REACHED)' : ''}
          </button>
          <button
            type="button"
            className={`trade-mode-btn sell-tab ${activeMode === 'SELL' ? 'active' : ''}`}
            onClick={() => { setActiveMode('SELL'); setQuantity(Math.max(1, ownedQuantity)); }}
            disabled={ownedQuantity <= 0}
          >
            SELL {ownedQuantity > 0 ? `(${formatNumber(ownedQuantity)})` : ''}
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
                disabled={quantity <= 1 || currentMax <= 0}
              >
                <Minus size={13} />
              </button>

              <input
                type="number"
                min="1"
                max={currentMax || 1}
                value={currentMax <= 0 ? 0 : quantity}
                disabled={currentMax <= 0}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (!isNaN(val) && currentMax > 0) {
                    setQuantity(Math.max(1, Math.min(currentMax, val)));
                  }
                }}
                className="qty-number-input"
              />

              <button 
                type="button" 
                className="qty-step-btn"
                onClick={() => handleAdjustQuantity(1)}
                disabled={quantity >= currentMax || currentMax <= 0}
              >
                <Plus size={13} />
              </button>
            </div>
          </div>

          {/* Quick Percentage Chips */}
          <div className="trade-pct-chips">
            <button type="button" className="pct-chip" disabled={currentMax <= 0} onClick={() => handleSetPercent(10)}>10%</button>
            <button type="button" className="pct-chip" disabled={currentMax <= 0} onClick={() => handleSetPercent(25)}>25%</button>
            <button type="button" className="pct-chip" disabled={currentMax <= 0} onClick={() => handleSetPercent(50)}>50%</button>
            <button type="button" className="pct-chip pct-max" disabled={currentMax <= 0} onClick={() => handleSetPercent(100)}>MAX</button>
          </div>

          {/* Trade Cost / Revenue Summary */}
          <div className="trade-summary-card">
            {activeMode === 'BUY' ? (
              <div className="summary-line">
                <span className="sl-label">Total Cost:</span>
                <span className="sl-val cost-val">{formatMoney(totalCost, numberFormat)}</span>
                <span className="sl-sub-cash">({formatMoney(Math.max(0, moneyRemaining), numberFormat)} left)</span>
              </div>
            ) : (
              <div className="summary-line">
                <span className="sl-label">Estimated Revenue:</span>
                <span className="sl-val revenue-val">+{formatMoney(estimatedRevenue, numberFormat)}</span>
                <span className={`sl-sub-cash ${estimatedProfit >= 0 ? 'text-green' : 'text-crimson'}`}>
                  ({estimatedProfit >= 0 ? '+' : ''}{formatMoney(estimatedProfit, numberFormat)} profit)
                </span>
              </div>
            )}
          </div>

          {/* Main Contextual Execution Button */}
          <button
            type="button"
            className={`trade-execute-btn ${activeMode === 'BUY' ? 'btn-buy' : 'btn-sell'}`}
            onClick={handleExecuteTrade}
            disabled={
              activeMode === 'BUY' 
                ? (maxBuyAllowed <= 0 || quantity <= 0 || totalCost > playerMoney)
                : (ownedQuantity <= 0 || quantity <= 0 || quantity > ownedQuantity)
            }
          >
            {activeMode === 'BUY' ? (
              isAtMaxCapacity
                ? `MAX HOLDING CAPACITY REACHED (${formatNumber(asset.maxTransactionQuantity)})`
                : isInsufficientFunds
                  ? 'INSUFFICIENT FUNDS TO BUY'
                  : `BUY ${formatNumber(quantity)} ${asset.name.toUpperCase()}`
            ) : (
              ownedQuantity <= 0 ? 'NO ASSETS OWNED' : `SELL ${formatNumber(quantity)} ${asset.name.toUpperCase()}`
            )}
          </button>
        </div>
      </div>

      {/* Short About Description */}
      <div className="detail-about-snippet">
        <span className="about-label">ABOUT: </span>
        <span className="about-text">{asset.description}</span>
      </div>
    </div>
  );
};
