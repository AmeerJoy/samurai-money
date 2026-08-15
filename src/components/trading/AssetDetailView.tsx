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
  ChevronDown,
  ChevronUp,
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
  const [timeRange, setTimeRange] = useState<TimeRange>('7D');
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

  const isPositive24h = runtime.priceChange24h >= 0;

  return (
    <div className="trading-detail-view">
      {/* Top Header: Identity + Price + Change + Market Position */}
      <div className="detail-top-summary-header">
        {onBack && (
          <button type="button" className="detail-mobile-back-btn" onClick={onBack}>
            <ArrowLeft size={16} />
            <span>Market</span>
          </button>
        )}

        <div className="detail-identity-row">
          <div className="detail-avatar-box">
            <img 
              src={getAssetUrl(asset.assetId)} 
              alt={asset.name} 
              className="detail-avatar-img" 
            />
          </div>

          <div className="detail-title-col">
            <div className="detail-name-star-row">
              <h2 className="detail-name-text">{asset.name}</h2>
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
              <span>{asset.category}</span>
              <span className="dot-sep">·</span>
              <span className={`risk-tag risk-${asset.risk.toLowerCase().replace(' ', '-')}`}>{asset.risk} Risk</span>
            </div>
          </div>

          <div className="detail-price-col">
            <div className="detail-price-num">{formatMoney(currentPrice, numberFormat)}</div>
            <div className="detail-price-sub">
              <span className={`price-today-tag ${isPositive24h ? 'text-green' : 'text-crimson'}`}>
                {isPositive24h ? <TrendingUp size={12} style={{ display: 'inline', marginRight: 2 }} /> : <TrendingDown size={12} style={{ display: 'inline', marginRight: 2 }} />}
                {isPositive24h ? '+' : ''}{runtime.priceChange24h}% today
              </span>
              <span className="dot-sep">·</span>
              <span className={`position-tag position-${runtime.marketPosition.toLowerCase().replace(' ', '-')}`}>
                {runtime.marketPosition}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Price History Chart with Y-Axis & Current Price Line */}
      <TradingPriceChart
        history={runtime.history}
        currentPrice={currentPrice}
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        numberFormat={numberFormat}
      />

      {/* Market Information Compact Bar + Expandable Details */}
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
          onClick={() => setShowMarketDetails(prev => !prev)}
        >
          <span>Details</span>
          {showMarketDetails ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>
      </div>

      {/* Expandable Advanced Market Details */}
      {showMarketDetails && (
        <div className="market-details-expanded-card">
          <div className="detail-param-row">
            <span className="param-label">Personality Curve:</span>
            <span className="param-val">{asset.personality.replace('_', ' ').toUpperCase()}</span>
          </div>
          <div className="detail-param-row">
            <span className="param-label">Volatility Rating:</span>
            <span className="param-val">{Math.round(asset.volatility * 100)}%</span>
          </div>
          <div className="detail-param-row">
            <span className="param-label">Max Order Quantity:</span>
            <span className="param-val">{formatNumber(asset.maxTransactionQuantity)} units</span>
          </div>
          <div className="detail-param-row">
            <span className="param-label">Historical Floor / Ceiling:</span>
            <span className="param-val">{formatMoney(asset.minimumPrice, numberFormat)} — {formatMoney(asset.maximumPrice, numberFormat)}</span>
          </div>
        </div>
      )}

      {/* Holdings Information Card (Simple & Scannable) */}
      <div className="detail-holdings-compact">
        <div className="holdings-compact-top">
          <span className="hc-title">YOUR HOLDINGS</span>
          <span className="hc-count">
            {ownedQuantity > 0 ? `${formatNumber(ownedQuantity)} ${asset.name.toUpperCase()}` : `0 ${asset.name.toUpperCase()}`}
          </span>
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
          <span className="holdings-none-sub">You don't own this asset yet. Buy when below average to profit on rising cycles!</span>
        )}
      </div>

      {/* Trade Action Execution Panel */}
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
            BUY
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
                disabled={quantity <= 1}
              >
                <Minus size={13} />
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
                <Plus size={13} />
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

      {/* Short About Description */}
      <div className="detail-about-snippet">
        <span className="about-label">ABOUT: </span>
        <span className="about-text">{asset.description}</span>
      </div>
    </div>
  );
};
