import React from 'react';
import { useGame } from '../context/GameContext';
import { formatMoney, formatDuration } from '../systems/formatting';
import { getAssetUrl } from '../assets/assets';
import { Moon, Sparkles } from 'lucide-react';

export const OfflineModal: React.FC = () => {
  const { offlineModalData, claimOfflineEarnings, state } = useGame();

  if (!offlineModalData || !offlineModalData.hasEarnings) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ textAlign: 'center', alignItems: 'center' }}>
        <div style={{ width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(circle, #D20A2E 0%, #5E0010 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '8px 0', border: '2px solid var(--crimson-glow)', boxShadow: 'var(--glow-crimson)' }}>
          <img 
            src={getAssetUrl('samurai-meditation')} 
            alt="Meditation Samurai" 
            style={{ width: '85%', height: '85%', objectFit: 'contain' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#F59E0B' }}>
          <Moon size={18} />
          <h3 className="modal-title" style={{ fontSize: '1.25rem' }}>WELCOME BACK</h3>
        </div>

        <p style={{ fontSize: '0.85rem', color: '#9CA3AF' }}>
          Your samurai empire continued working diligently and amassing fortunes while you were away.
        </p>

        <div style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: '12px 20px', width: '100%' }}>
          <div style={{ fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase', letterSpacing: 1 }}>
            OFFLINE DURATION
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFF', margin: '2px 0 8px' }}>
            {formatDuration(offlineModalData.elapsedSeconds)}
          </div>

          <div style={{ fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase', letterSpacing: 1 }}>
            GOLD GENERATED
          </div>
          <div style={{ fontSize: '1.6rem', fontFamily: 'var(--font-numbers)', fontWeight: 800, color: '#FCD34D', textShadow: '0 0 15px rgba(245, 158, 11, 0.4)' }}>
            {formatMoney(offlineModalData.earnedMoney, state.settings.numberFormat)}
          </div>
        </div>

        <button 
          id="claim-offline-btn"
          className="primary-modal-btn" 
          onClick={claimOfflineEarnings}
          style={{ width: '100%', marginTop: 8 }}
        >
          <Sparkles size={16} style={{ display: 'inline', marginRight: 6 }} />
          COLLECT {formatMoney(offlineModalData.earnedMoney, state.settings.numberFormat)}
        </button>
      </div>
    </div>
  );
};
