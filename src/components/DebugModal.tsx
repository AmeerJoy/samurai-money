import React from 'react';
import { useGame } from '../context/GameContext';
import { X, ShieldAlert, DollarSign, Globe } from 'lucide-react';

export const DebugModal: React.FC = () => {
  const { activeModal, setActiveModal, cheatAddMoney, cheatUnlockAll } = useGame();

  if (activeModal !== 'debug') return null;

  return (
    <div className="modal-overlay" onClick={() => setActiveModal('none')}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ShieldAlert size={20} color="#F01835" />
            <h3 className="modal-title">QA DEVELOPER CHEATS</h3>
          </div>
          <button 
            className="modal-close-btn" 
            onClick={() => setActiveModal('none')}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>
          Use these developer shortcuts to rapidly test milestones, region progression, and high-tier upgrades.
        </p>

        {/* Currency Cheats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span className="setting-label">Add Currency</span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
            <button className="icon-btn" style={{ width: '100%', gap: 6 }} onClick={() => cheatAddMoney(10000)}>
              <DollarSign size={14} color="#10B981" />
              <span>+$10,000</span>
            </button>
            <button className="icon-btn" style={{ width: '100%', gap: 6 }} onClick={() => cheatAddMoney(1000000)}>
              <DollarSign size={14} color="#10B981" />
              <span>+$1,000,000</span>
            </button>
            <button className="icon-btn" style={{ width: '100%', gap: 6 }} onClick={() => cheatAddMoney(1000000000)}>
              <DollarSign size={14} color="#F59E0B" />
              <span>+$1 Billion</span>
            </button>
            <button className="icon-btn" style={{ width: '100%', gap: 6 }} onClick={() => cheatAddMoney(1000000000000)}>
              <DollarSign size={14} color="#F59E0B" />
              <span>+$1 Trillion</span>
            </button>
            <button className="icon-btn" style={{ width: '100%', gap: 6 }} onClick={() => cheatAddMoney(1000000000000000)}>
              <DollarSign size={14} color="#D20A2E" />
              <span>+$1 Quadrillion</span>
            </button>
            <button className="icon-btn" style={{ width: '100%', gap: 6 }} onClick={() => cheatAddMoney(1000000000000000000)}>
              <DollarSign size={14} color="#D20A2E" />
              <span>+$1 Quintillion</span>
            </button>
          </div>
        </div>

        {/* Progression Cheats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 6 }}>
          <span className="setting-label">Content Unlocks</span>
          <button 
            className="icon-btn" 
            style={{ width: '100%', gap: 8, background: 'rgba(210, 10, 46, 0.15)', borderColor: 'var(--crimson-border)', color: '#FFF' }}
            onClick={() => {
              cheatUnlockAll();
            }}
          >
            <Globe size={16} color="#F01835" />
            <span>Unlock All 6 Regions & All 11 Shop Relics</span>
          </button>
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
