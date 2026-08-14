import React from 'react';
import { useGame } from '../context/GameContext';
import { getNextRegion } from '../data/regions';
import { formatMoney } from '../systems/formatting';
import { Target, ChevronRight } from 'lucide-react';

export const NextGoalIndicator: React.FC = () => {
  const { state, setActiveTab } = useGame();

  // Find the next locked region
  const nextRegion = getNextRegion(
    Math.max(
      ...state.unlockedRegionIds.map(id => {
        if (id === 'region-village') return 0;
        if (id === 'region-bamboo-valley') return 100000;
        if (id === 'region-mountain-province') return 10000000;
        if (id === 'region-golden-capital') return 1000000000;
        if (id === 'region-imperial-fortress') return 1000000000000;
        if (id === 'region-legendary-realm') return 1000000000000000;
        return 0;
      })
    )
  );

  if (!nextRegion) {
    return (
      <div className="next-goal-card" style={{ borderLeftColor: '#F59E0B' }}>
        <div className="next-goal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#FCD34D' }}>
            <Target size={14} />
            <span>SOVEREIGN ASCENDANCE</span>
          </div>
          <span className="next-goal-target">MAX REALM REACHED</span>
        </div>
        <div style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>
          All territories conquered. Expand your empire to infinite fortunes!
        </div>
      </div>
    );
  }

  const targetAmount = nextRegion.requirement;
  const currentAmount = state.money;
  const progressPercent = Math.min(100, Math.max(0, (currentAmount / targetAmount) * 100));

  return (
    <div 
      className="next-goal-card"
      onClick={() => setActiveTab('map')}
      style={{ cursor: 'pointer' }}
      title="Click to view World Map"
    >
      <div className="next-goal-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Target size={14} color="#D20A2E" />
          <span>NEXT GOAL: {nextRegion.name.toUpperCase()}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span className="next-goal-target">
            {formatMoney(currentAmount, state.settings.numberFormat)} / {formatMoney(targetAmount, state.settings.numberFormat)}
          </span>
          <ChevronRight size={14} color="#9CA3AF" />
        </div>
      </div>

      <div className="goal-progress-bar">
        <div 
          className="goal-progress-fill" 
          style={{ width: `${progressPercent}%` }} 
        />
      </div>
    </div>
  );
};
