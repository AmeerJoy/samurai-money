import React, { useRef } from 'react';
import { useGame } from '../context/GameContext';
import { getAssetUrl } from '../assets/assets';
import { formatPerClick } from '../systems/formatting';
import { Zap } from 'lucide-react';

export const SamuraiHero: React.FC = () => {
  const { 
    state, 
    clickIncome, 
    samuraiPose, 
    clickCombo, 
    manualClick, 
    clickMask 
  } = useGame();

  const heroWrapperRef = useRef<HTMLDivElement>(null);

  // Dynamic Character Asset Selection
  const getSamuraiAsset = () => {
    if (samuraiPose === 'battle') return getAssetUrl('samurai-battle');
    if (samuraiPose === 'sword') return getAssetUrl('samurai-sword');
    if (samuraiPose === 'meditation') return getAssetUrl('samurai-meditation');

    // Wealth Tier Progression
    if (state.money >= 1000000000000) return getAssetUrl('samurai-legendary');
    if (state.money >= 1000000000) return getAssetUrl('samurai-powerful');
    if (state.money >= 10000000) return getAssetUrl('samurai-rich');
    if (state.money >= 1000) return getAssetUrl('samurai-standing');
    return getAssetUrl('samurai-idle');
  };

  const handleHeroClick = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    let clientX: number | undefined;
    let clientY: number | undefined;

    if ('clientX' in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    } else if (e.touches && e.touches[0]) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }

    manualClick(clientX, clientY);
  };

  return (
    <div className="samurai-card">
      {/* Click Combo Counter */}
      {clickCombo >= 4 && (
        <div className="combo-pill">
          <Zap size={12} style={{ display: 'inline', marginRight: 3 }} />
          {clickCombo}x STRIKE COMBO
        </div>
      )}

      {/* Interactive Samurai Area */}
      <div 
        ref={heroWrapperRef}
        id="samurai-click-target"
        className="samurai-interactive-wrapper"
        onClick={handleHeroClick}
        aria-label="Click to Earn Money"
      >
        {/* Solid Crimson Sun Halo Backdrop */}
        <div className="samurai-sun-disc" />

        {/* Samurai Character Image */}
        <img 
          src={getSamuraiAsset()} 
          alt="Samurai Warrior" 
          className={`samurai-character-img ${clickCombo > 5 ? 'combo-pulse' : ''}`}
          draggable={false}
        />

        {/* Secret Mask Click Target (Easter Egg) */}
        <div 
          className="mask-hitbox" 
          onClick={(e) => {
            e.stopPropagation();
            clickMask();
            handleHeroClick(e);
          }}
          title="Mysterious Mask"
        />
      </div>

      {/* Main Earning Action Button */}
      <button 
        id="earn-money-action-btn"
        className="earn-money-btn" 
        onClick={(e) => {
          manualClick(e.clientX, e.clientY);
        }}
      >
        <span>EARN MONEY</span>
        <span className="btn-sub-rate">
          {formatPerClick(clickIncome, state.settings.numberFormat)}
        </span>
      </button>
    </div>
  );
};
