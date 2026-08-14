import React from 'react';
import { useGame } from '../context/GameContext';
import { formatMoney, formatPerSecond, formatPerClick } from '../systems/formatting';
import { getRegion } from '../data/regions';
import { TrendingUp, Zap, MapPin, ShieldCheck } from 'lucide-react';

export const TreasuryHub: React.FC = () => {
  const { state, clickIncome, passiveIncome, setActiveTab } = useGame();
  const currentRegion = getRegion(state.currentRegionId);

  return (
    <div className="treasury-hub-card">
      {/* Top Location & Region Bar */}
      <div className="treasury-top-row">
        <div 
          className="treasury-region-pill"
          onClick={() => setActiveTab('map')}
          title="Click to open World Map"
        >
          <MapPin size={13} color="#F59E0B" />
          <span>{currentRegion.name}</span>
          {currentRegion.multiplier > 1 && (
            <span className="region-multiplier-tag">{currentRegion.multiplier}x Boost</span>
          )}
        </div>

        <div className="treasury-status-badge">
          <ShieldCheck size={13} color="#10B981" />
          <span>Active Empire</span>
        </div>
      </div>

      {/* Main Big Fortune Display */}
      <div className="treasury-main-display">
        <span className="treasury-label">TOTAL WEALTH</span>
        <div className="treasury-gold-number" id="grand-wealth-counter">
          {formatMoney(state.money, state.settings.numberFormat)}
        </div>
      </div>

      {/* Dual Professional Economy Metrics */}
      <div className="treasury-metrics-grid">
        {/* Passive Revenue Metric */}
        <div className="metric-box passive-metric" title="Automatic income generated every second">
          <div className="metric-header">
            <div className="metric-icon-circle passive-circle">
              <TrendingUp size={14} />
            </div>
            <span className="metric-title">PASSIVE INCOME</span>
          </div>
          <div className="metric-value passive-val">
            {formatPerSecond(passiveIncome, state.settings.numberFormat)}
          </div>
          <span className="metric-subtext">Automated Empire Revenue</span>
        </div>

        {/* Click Strike Power Metric */}
        <div className="metric-box click-metric" title="Income earned with each manual sword click">
          <div className="metric-header">
            <div className="metric-icon-circle click-circle">
              <Zap size={14} />
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
