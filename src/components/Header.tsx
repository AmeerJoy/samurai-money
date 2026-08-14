import React from 'react';
import { useGame } from '../context/GameContext';
import { formatMoney } from '../systems/formatting';
import { Volume2, VolumeX, BarChart3, Settings, ShieldAlert } from 'lucide-react';
import { getAssetUrl } from '../assets/assets';

export const Header: React.FC = () => {
  const { 
    state, 
    setActiveTab, 
    setActiveModal, 
    updateSettings 
  } = useGame();

  const toggleSound = () => {
    updateSettings({ soundEnabled: !state.settings.soundEnabled });
  };

  return (
    <header className="game-header">
      <div className="header-inner">
        {/* Left: Brand */}
        <div 
          className="brand-section" 
          onClick={() => setActiveTab('dashboard')}
          role="button"
          tabIndex={0}
          title="Samurai Money — Home"
        >
          <img 
            src={getAssetUrl('logo-mark')} 
            alt="Samurai Money Logo" 
            className="brand-logo-mark" 
          />
          <span className="brand-title">
            SAMURAI <span>MONEY</span>
          </span>
        </div>

        {/* Right: Quick Balance & Controls */}
        <div className="header-right">
          {/* Subtle Compact Mini Balance */}
          <div className="header-compact-money" title="Current Treasury Balance">
            <span className="compact-money-label">TREASURY</span>
            <span className="compact-money-val">
              {formatMoney(state.money, state.settings.numberFormat)}
            </span>
          </div>

          <div className="header-actions">
            <button 
              className={`icon-btn ${state.settings.soundEnabled ? 'active-audio' : ''}`}
              onClick={toggleSound}
              title={state.settings.soundEnabled ? 'Mute SFX' : 'Enable SFX'}
              aria-label="Sound Toggle"
            >
              {state.settings.soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>

            <button 
              className="icon-btn" 
              onClick={() => setActiveModal('stats')}
              title="Empire Statistics"
              aria-label="Statistics"
            >
              <BarChart3 size={16} />
            </button>

            <button 
              className="icon-btn" 
              onClick={() => setActiveModal('settings')}
              title="Settings"
              aria-label="Settings"
            >
              <Settings size={16} />
            </button>

            <button 
              className="icon-btn debug-btn" 
              onClick={() => setActiveModal('debug')}
              title="QA Developer Cheats"
              aria-label="Debug Cheats"
            >
              <ShieldAlert size={16} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
