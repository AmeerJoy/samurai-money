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

/**
 * Convert discrete points into a silky-smooth Catmull-Rom cubic bezier SVG path
 */
function buildSmoothSplinePath(points: { x: number; y: number }[]): string {
  if (points.length < 2) return '';
  if (points.length === 2) {
    return `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)} L ${points[1].x.toFixed(1)} ${points[1].y.toFixed(1)}`;
  }

  let path = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];

    // Catmull-Rom to Cubic Bezier control points conversion
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    path += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }

  return path;
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

  // Add 4% padding so line never touches absolute vertical edges
  const pad = (rawMax - rawMin) * 0.04 || rawMin * 0.03 || 1;
  const minPrice = Math.max(0, rawMin - pad);
  const maxPrice = rawMax + pad;
  const priceRange = maxPrice - minPrice || 1;

  const startPrice = points[0].price;
  const endPrice = points[points.length - 1].price;
  const priceChange = endPrice - startPrice;
  const isPositive = priceChange >= 0;

  // Chart layout dimensions
  const width = 640;
  const height = 210;
  const paddingTop = 12;
  const paddingBottom = 16;
  const paddingRight = 2; // 100% full utilization of the right side

  const innerHeight = height - paddingTop - paddingBottom;

  // Calculate 6 Y-axis price levels
  const gridSteps = 6;
  const rawYTicks = Array.from({ length: gridSteps }, (_, i) => {
    const val = minPrice + (priceRange / (gridSteps - 1)) * i;
    const formatted = formatMoney(val, numberFormat);
    return { val, formatted };
  });

  // Dynamically compute left padding based on the longest formatted price string
  const maxCharLength = Math.max(...rawYTicks.map(t => t.formatted.length), 3);
  // ~6.2px per character in font-size 9px + 6px right spacing
  const paddingLeft = Math.max(26, Math.min(58, Math.round(maxCharLength * 6.4 + 6)));
  const innerWidth = width - paddingLeft - paddingRight;

  const yAxisTicks = rawYTicks.map(t => {
    const y = paddingTop + innerHeight - ((t.val - minPrice) / priceRange) * innerHeight;
    return { ...t, y };
  });

  // Generate SVG path coordinates spanning the entire dynamically available width
  const svgPoints = points.map((p, idx) => {
    const x = paddingLeft + (idx / (points.length - 1)) * innerWidth;
    const y = paddingTop + innerHeight - ((p.price - minPrice) / priceRange) * innerHeight;
    return { x, y, point: p };
  });

  // Build ultra-smooth continuous curve
  const linePath = buildSmoothSplinePath(svgPoints);
  
  // Closed area path for background gradient fill
  const lastX = paddingLeft + innerWidth;
  const areaPath = `${linePath} L ${lastX.toFixed(1)} ${height - paddingBottom} L ${paddingLeft} ${height - paddingBottom} Z`;

  // Color constants
  const strokeColor = isPositive ? '#10B981' : '#F01835';
  const fillColor = isPositive ? 'rgba(16, 185, 129, 0.16)' : 'rgba(240, 24, 53, 0.16)';
  const glowColor = isPositive ? 'rgba(16, 185, 129, 0.45)' : 'rgba(240, 24, 53, 0.45)';

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

      {/* Interactive Vector SVG Chart with Dynamic Responsive Utilization */}
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

          {/* Horizontal Y-Axis Grid Lines & Dynamically Aligned Price Labels */}
          {yAxisTicks.map((tick, idx) => (
            <g key={idx} className="chart-grid-tick">
              {/* Y-Axis Price Label aligned directly to its dashed grid line */}
              <text
                x={paddingLeft - 4}
                y={tick.y + 3.5}
                textAnchor="end"
                className="chart-yaxis-text"
                style={{ fill: 'rgba(255, 255, 255, 0.45)', fontSize: '9px', fontWeight: 700 }}
              >
                {tick.formatted}
              </text>

              {/* Dashed Grid Line spanning from left axis to the absolute right edge */}
              <line
                x1={paddingLeft}
                y1={tick.y}
                x2={width - paddingRight}
                y2={tick.y}
                stroke="rgba(255, 255, 255, 0.08)"
                strokeDasharray="3 4"
                strokeWidth="1"
              />
            </g>
          ))}

          {/* Area Fill */}
          <path d={areaPath} fill={`url(#chart-grad-${timeRange})`} />

          {/* Main Smooth Spline Price Trend Line */}
          <path
            d={linePath}
            fill="none"
            stroke={strokeColor}
            strokeWidth="2.4"
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
              cx={width - paddingRight - 1}
              cy={currentY}
              r="4.5"
              fill="#F59E0B"
              stroke="#FFF"
              strokeWidth="1.5"
            />
            {/* Current Price Pill Badge pinned cleanly to the right edge */}
            <rect
              x={width - paddingRight - 60}
              y={currentY - 10}
              width="58"
              height="19"
              rx="4"
              fill="#141720"
              stroke="#F59E0B"
              strokeWidth="1.2"
              fillOpacity="0.95"
            />
            <text
              x={width - paddingRight - 31}
              y={currentY + 3.5}
              textAnchor="middle"
              className="chart-current-badge-text"
              style={{ fontWeight: 800, fontSize: '9.5px', fill: '#FBBF24' }}
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
                r="5"
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
