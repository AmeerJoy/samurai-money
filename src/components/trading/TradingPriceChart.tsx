import React, { useState, useRef } from 'react';
import { PricePoint, TimeRange } from '../../types/trading';
import { formatMoney } from '../../systems/formatting';

interface TradingPriceChartProps {
  history: Record<TimeRange, PricePoint[]>;
  currentPrice: number;
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
  numberFormat?: 'standard' | 'scientific';
}

export const TradingPriceChart: React.FC<TradingPriceChartProps> = ({
  history,
  currentPrice,
  timeRange,
  onTimeRangeChange,
  numberFormat = 'standard'
}) => {
  const [hoverPoint, setHoverPoint] = useState<{ x: number; y: number; point: PricePoint } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const timeRanges: TimeRange[] = ['1H', '6H', '24H', '7D', '30D', '90D', '1Y'];
  const points = history[timeRange] || [];

  if (points.length < 2) {
    return (
      <div className="trading-chart-empty">
        <span>Generating market history...</span>
      </div>
    );
  }

  // Calculate high, low, and change for selected range
  const prices = points.map(p => p.price);
  const rawMin = Math.min(...prices, currentPrice);
  const rawMax = Math.max(...prices, currentPrice);

  // Add slight 5% padding so line never touches absolute edges
  const pad = (rawMax - rawMin) * 0.05 || rawMin * 0.04 || 1;
  const minPrice = Math.max(0, rawMin - pad);
  const maxPrice = rawMax + pad;
  const priceRange = maxPrice - minPrice || 1;

  const startPrice = points[0].price;
  const endPrice = points[points.length - 1].price;
  const priceChange = endPrice - startPrice;
  const isPositive = priceChange >= 0;

  // Chart dimensions & scaling
  const width = 640;
  const height = 210;
  const paddingLeft = 58;  // Left margin for Y-axis labels
  const paddingRight = 68; // Right margin for current price badge
  const paddingTop = 12;
  const paddingBottom = 16;

  const innerWidth = width - paddingLeft - paddingRight;
  const innerHeight = height - paddingTop - paddingBottom;

  // Generate SVG path coordinates
  const svgPoints = points.map((p, idx) => {
    const x = paddingLeft + (idx / (points.length - 1)) * innerWidth;
    const y = paddingTop + innerHeight - ((p.price - minPrice) / priceRange) * innerHeight;
    return { x, y, point: p };
  });

  const linePath = svgPoints.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`).join(' ');
  
  // Closed area path for background gradient fill
  const lastX = paddingLeft + innerWidth;
  const areaPath = `${linePath} L ${lastX.toFixed(1)} ${height - paddingBottom} L ${paddingLeft} ${height - paddingBottom} Z`;

  // Color constants
  const strokeColor = isPositive ? '#10B981' : '#F01835';
  const fillColor = isPositive ? 'rgba(16, 185, 129, 0.16)' : 'rgba(240, 24, 53, 0.16)';
  const glowColor = isPositive ? 'rgba(16, 185, 129, 0.45)' : 'rgba(240, 24, 53, 0.45)';

  // Calculate 4 Y-axis horizontal grid lines spanning full height
  const gridSteps = 4;
  const yAxisTicks = Array.from({ length: gridSteps }, (_, i) => {
    const val = minPrice + (priceRange / (gridSteps - 1)) * i;
    const y = paddingTop + innerHeight - ((val - minPrice) / priceRange) * innerHeight;
    return { val, y };
  });

  // Current Price Horizontal Reference Line Coordinate
  const currentY = paddingTop + innerHeight - ((currentPrice - minPrice) / priceRange) * innerHeight;

  // Handle Scrubbing (Mouse & Touch)
  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const relativeX = (clientX / rect.width) * width;

    // Find nearest point
    let closest = svgPoints[0];
    let minDiff = Math.abs(svgPoints[0].x - relativeX);

    for (const pt of svgPoints) {
      const diff = Math.abs(pt.x - relativeX);
      if (diff < minDiff) {
        minDiff = diff;
        closest = pt;
      }
    }

    setHoverPoint(closest);
  };

  const handlePointerLeave = () => {
    setHoverPoint(null);
  };

  const formatTimestamp = (ts: number, range: TimeRange) => {
    const d = new Date(ts);
    if (range === '1H' || range === '6H' || range === '24H') {
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }
    if (range === '7D' || range === '30D') {
      return d.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    }
    return d.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="trading-chart-container" ref={containerRef}>
      {/* Timeframe Selector & Range Summary Header */}
      <div className="chart-header-row">
        <div className="chart-range-change">
          <span className={`range-diff-tag ${isPositive ? 'diff-positive' : 'diff-negative'}`}>
            {isPositive ? '▲ +' : '▼ '}
            {formatMoney(priceChange, numberFormat)} (
            {startPrice > 0 ? ((priceChange / startPrice) * 100).toFixed(2) : '0.00'}%)
          </span>
          <span className="range-label-sub">in {timeRange}</span>
        </div>

        <div className="chart-timeframe-pills" role="tablist" aria-label="Chart Timeframes">
          {timeRanges.map(tr => (
            <button
              key={tr}
              type="button"
              className={`timeframe-pill-btn ${timeRange === tr ? 'active' : ''}`}
              onClick={() => onTimeRangeChange(tr)}
              role="tab"
              aria-selected={timeRange === tr}
            >
              {tr}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Vector SVG Chart with Y-Axis and Current Price Line */}
      <div className="chart-svg-wrapper">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="trading-svg-canvas"
          preserveAspectRatio="none"
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
        >
          <defs>
            <linearGradient id={`chart-grad-${timeRange}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={fillColor} />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
            <filter id="chart-line-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={glowColor} />
            </filter>
          </defs>

          {/* Horizontal Y-Axis Grid Lines & Price Labels */}
          {yAxisTicks.map((tick, idx) => (
            <g key={idx} className="chart-grid-tick">
              <line
                x1={paddingLeft}
                y1={tick.y}
                x2={width - paddingRight}
                y2={tick.y}
                stroke="rgba(255, 255, 255, 0.08)"
                strokeDasharray="3 4"
                strokeWidth="1"
              />
              <text
                x={paddingLeft - 8}
                y={tick.y + 3.5}
                textAnchor="end"
                className="chart-yaxis-text"
              >
                {formatMoney(tick.val, numberFormat)}
              </text>
            </g>
          ))}

          {/* Area Fill */}
          <path d={areaPath} fill={`url(#chart-grad-${timeRange})`} />

          {/* Main Price Trend Line */}
          <path
            d={linePath}
            fill="none"
            stroke={strokeColor}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#chart-line-glow)"
          />

          {/* Horizontal Reference Line at CURRENT PRICE */}
          <g className="chart-current-line-group">
            <line
              x1={paddingLeft}
              y1={currentY}
              x2={width - paddingRight}
              y2={currentY}
              stroke="rgba(245, 158, 11, 0.75)"
              strokeDasharray="4 3"
              strokeWidth="1.2"
            />
            {/* Dot at Current Price (Rightmost point) */}
            <circle
              cx={width - paddingRight}
              cy={currentY}
              r="4"
              fill="#F59E0B"
              stroke="#FFF"
              strokeWidth="1.5"
            />
            {/* Current Price Label on Right Axis */}
            <rect
              x={width - paddingRight + 4}
              y={currentY - 9}
              width="58"
              height="18"
              rx="4"
              fill="#181B24"
              stroke="#F59E0B"
              strokeWidth="1"
            />
            <text
              x={width - paddingRight + 33}
              y={currentY + 3.5}
              textAnchor="middle"
              className="chart-current-badge-text"
            >
              {formatMoney(currentPrice, numberFormat)}
            </text>
          </g>

          {/* Interactive Scrubbing Cursor & Tooltip */}
          {hoverPoint && (
            <g className="chart-scrub-group">
              {/* Vertical Guide Line */}
              <line
                x1={hoverPoint.x}
                y1={paddingTop}
                x2={hoverPoint.x}
                y2={height - paddingBottom}
                stroke="rgba(255, 255, 255, 0.45)"
                strokeDasharray="3 3"
                strokeWidth="1.5"
              />

              {/* Data Point Dot */}
              <circle
                cx={hoverPoint.x}
                cy={hoverPoint.y}
                r="4.5"
                fill="#FFF"
                stroke={strokeColor}
                strokeWidth="2.5"
              />
            </g>
          )}
        </svg>

        {/* Floating Tooltip Box */}
        {hoverPoint && (
          <div
            className="chart-hover-tooltip"
            style={{
              left: `${(hoverPoint.x / width) * 100}%`,
              top: `${(hoverPoint.y / height) * 100}%`
            }}
          >
            <div className="tooltip-date">
              {formatTimestamp(hoverPoint.point.timestamp, timeRange)}
            </div>
            <div className="tooltip-price">
              {formatMoney(hoverPoint.point.price, numberFormat)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
