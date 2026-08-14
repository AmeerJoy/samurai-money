import React from 'react';
import { useGame } from '../context/GameContext';
import { Sparkles, ArrowRight, Check } from 'lucide-react';

export const OnboardingBanner: React.FC = () => {
  const { state, updateSettings } = useGame();

  if (state.tutorialStep >= 3) return null;

  return (
    <div className="tutorial-banner">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Sparkles size={18} color="#F59E0B" />
        <div>
          {state.tutorialStep === 0 && (
            <span><strong>Welcome, Samurai!</strong> Click the Samurai or <strong>EARN MONEY</strong> to start amassing gold.</span>
          )}
          {state.tutorialStep === 1 && (
            <span><strong>First Strike!</strong> Now invest your earnings in an <strong>Upgrade</strong> below to multiply income.</span>
          )}
          {state.tutorialStep === 2 && (
            <span><strong>Empire Rising!</strong> Unlock new regions, collect armory relics, and climb to boundless fortunes.</span>
          )}
        </div>
      </div>

      {state.tutorialStep === 2 ? (
        <button
          className="icon-btn"
          style={{ width: 'auto', padding: '4px 12px', background: 'var(--crimson-primary)', color: '#FFF', gap: 4 }}
          onClick={() => {
            // Mark tutorial done
            const s = { ...state, tutorialStep: 3 };
            updateSettings({});
            localStorage.setItem('samurai_money_save_v1', JSON.stringify(s));
            window.location.reload();
          }}
        >
          <Check size={14} />
          <span>Begin!</span>
        </button>
      ) : (
        <ArrowRight size={16} color="#FCD34D" />
      )}
    </div>
  );
};
