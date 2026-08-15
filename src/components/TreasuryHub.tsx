import React from 'react';
import { useGame } from '../context/GameContext';
import { formatMoney, formatPerSecond, formatPerClick } from '../systems/formatting';
import { getRegion } from '../data/regions';
import { TrendingUp, Zap, MapPin, ShieldCheck, Sparkles } from 'lucide-react';

export const TreasuryHub: React.FC = () => {
  const { state, clickIncome, passiveIncome, setActiveTab } = useGame();
  const currentRegion = getRegion(state.currentRegionId);

  return (
    <div className="treasury-hub-card">
      {/* Decorative Aura & Ambient Glow */}
      <div className="treasury-ambient-glow" />

      {/* Top Location & Region Bar */}
      <div className="treasury-top-row">
        <button 
          type="button"
          className="treasury-region-pill"
          onClick={() => setActiveTab('map')}
          title="Click to explore and travel on World Map"
        >
          <MapPin size={13} className="region-pin-icon" />
          <span className="region-name-text">{currentRegion.name}</span>
          {currentRegion.multiplier > 1 && (
            <span className="region-multiplier-tag">{currentRegion.multiplier}x Boost</span>
          )}
        </button>

        <div className="treasury-status-badge" title="Empire actively producing automated revenue">
          <span className="status-live-dot" />
          <ShieldCheck size={12} className="status-shield-icon" />
          <span>Active Empire</span>
        </div>
      </div>

      {/* Main Big Fortune Display */}
      <div className="treasury-main-display">
        <div className="treasury-label-row">
          <Sparkles size={11} className="treasury-sparkle-icon" />
          <span className="treasury-label">TOTAL WEALTH</span>
          <Sparkles size={11} className="treasury-sparkle-icon" />
        </div>
        <div className="treasury-gold-number" id="grand-wealth-counter" title={state.money.toLocaleString('en-US')}>
          {formatMoney(state.money, state.settings.numberFormat)}
        </div>
      </div>

      {/* Dual Professional Economy Metrics */}
      <div className="treasury-metrics-grid">
        {/* Passive Revenue Metric */}
        <div className="metric-box passive-metric" title="Automatic revenue earned every second from businesses & provinces">
          <div className="metric-header">
            <div className="metric-icon-circle passive-circle">
              <TrendingUp size={13} />
            </div>
            <span className="metric-title">PASSIVE INCOME</span>
          </div>
          <div className="metric-value passive-val">
            {formatPerSecond(passiveIncome, state.settings.numberFormat)}
          </div>
          <span className="metric-subtext">Automated Empire Revenue</span>
        </div>

        {/* Click Strike Power Metric */}
        <div className="metric-box click-metric" title="Revenue earned per manual katana strike or spacebar press">
          <div className="metric-header">
            <div className="metric-icon-circle click-circle">
              <Zap size={13} />
            </div>
            <span className="metric-title">CLICK POWER</span>
          </div>
          <div className="metric-value click-val">
            {formatPerClick(clickIncome, state.settings.numberFormat)}
          </div>
          <span className="metric-subtext">Manual Katana Strike</span>
        </div>
      </div>
    </div>
  );
};

