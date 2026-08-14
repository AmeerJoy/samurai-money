import React from 'react';
import { useGame } from '../context/GameContext';
import { formatMoney, formatCount, formatDuration, formatPerClick, formatPerSecond } from '../systems/formatting';
import { X, BarChart3, Clock, DollarSign, MousePointer, Trophy, Landmark } from 'lucide-react';

export const StatsModal: React.FC = () => {
  const { state, activeModal, setActiveModal, clickIncome, passiveIncome } = useGame();

  if (activeModal !== 'stats') return null;

  const stats = state.statistics;
  const totalUpgrades = Object.values(state.upgradeLevels).reduce((a, b) => a + b, 0);

  const statItems = [
    { label: 'Current Treasury', value: formatMoney(state.money, state.settings.numberFormat), icon: <DollarSign size={16} color="#F59E0B" /> },
    { label: 'Lifetime Fortune', value: formatMoney(state.lifetimeMoney, state.settings.numberFormat), icon: <DollarSign size={16} color="#10B981" /> },
    { label: 'Manual Clicks Made', value: formatCount(stats.totalClicks), icon: <MousePointer size={16} color="#D20A2E" /> },
    { label: 'Manual Gold Earned', value: formatMoney(stats.manualMoneyEarned, state.settings.numberFormat), icon: <DollarSign size={16} color="#F01835" /> },
    { label: 'Passive Gold Earned', value: formatMoney(stats.passiveMoneyEarned, state.settings.numberFormat), icon: <DollarSign size={16} color="#10B981" /> },
    { label: 'Current Click Power', value: formatPerClick(clickIncome, state.settings.numberFormat), icon: <MousePointer size={16} color="#F59E0B" /> },
    { label: 'Current Passive Income', value: formatPerSecond(passiveIncome, state.settings.numberFormat), icon: <DollarSign size={16} color="#10B981" /> },
    { label: 'Total Upgrades Bought', value: formatCount(totalUpgrades), icon: <Landmark size={16} color="#60A5FA" /> },
    { label: 'Regions Conquered', value: `${state.unlockedRegionIds.length} / 6`, icon: <Landmark size={16} color="#A78BFA" /> },
    { label: 'Shop Relics Owned', value: `${state.ownedItemIds.length} / 11`, icon: <Trophy size={16} color="#F472B6" /> },
    { label: 'Achievements Unlocked', value: `${state.unlockedAchievementIds.length} / 35`, icon: <Trophy size={16} color="#FBBF24" /> },
    { label: 'Total Playtime', value: formatDuration(stats.totalPlayTimeSeconds), icon: <Clock size={16} color="#9CA3AF" /> }
  ];

  return (
    <div className="modal-overlay" onClick={() => setActiveModal('none')}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <BarChart3 size={20} color="#F59E0B" />
            <h3 className="modal-title">EMPIRE STATISTICS</h3>
          </div>
          <button 
            className="modal-close-btn" 
            onClick={() => setActiveModal('none')}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 6 }}>
          {statItems.map((item, idx) => (
            <div key={idx} className="setting-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {item.icon}
                <span className="setting-label">{item.label}</span>
              </div>
              <span style={{ fontFamily: 'var(--font-numbers)', fontWeight: 700, color: '#FFF' }}>
                {item.value}
              </span>
            </div>
          ))}
        </div>

        <button 
          className="primary-modal-btn" 
          onClick={() => setActiveModal('none')}
          style={{ marginTop: 8 }}
        >
          CLOSE
        </button>
      </div>
    </div>
  );
};
