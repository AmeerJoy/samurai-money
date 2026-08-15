import React, { useRef, useState } from 'react';
import { useGame } from '../context/GameContext';
import { getAssetUrl } from '../assets/assets';
import { formatPerClick } from '../systems/formatting';
import { Zap, Flame, Crown, Sword } from 'lucide-react';

interface SlashEffect {
  id: number;
  x: number;
  y: number;
  angle: number;
}

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
  const [slashes, setSlashes] = useState<SlashEffect[]>([]);

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

  const triggerSlashAnimation = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!heroWrapperRef.current) return;
    const rect = heroWrapperRef.current.getBoundingClientRect();
    
    let clientX = rect.left + rect.width / 2;
    let clientY = rect.top + rect.height / 2;

    if ('clientX' in e && e.clientX) {
      clientX = e.clientX;
      clientY = e.clientY;
    } else if ('touches' in e && e.touches && e.touches[0]) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }

    const relX = clientX - rect.left;
    const relY = clientY - rect.top;
    const angle = (Math.random() * 60) - 30; // Random slash angle -30 to +30 deg

    const newSlash: SlashEffect = {
      id: Date.now() + Math.random(),
      x: relX,
      y: relY,
      angle: angle
    };

    setSlashes(prev => [...prev.slice(-4), newSlash]);

    setTimeout(() => {
      setSlashes(prev => prev.filter(s => s.id !== newSlash.id));
    }, 450);
  };

  const handleHeroClick = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    let clientX: number | undefined;
    let clientY: number | undefined;

    if ('clientX' in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    } else if ('touches' in e && e.touches && e.touches[0]) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }

    triggerSlashAnimation(e);
    manualClick(clientX, clientY);
  };

  // Dynamic Combo Tier Badge
  const getComboBadge = () => {
    if (clickCombo >= 10) {
      return (
        <div className="combo-pill combo-godspeed" title="Godspeed Combo Streak!">
          <Crown size={12} className="combo-icon" />
          <span>{clickCombo}x GODSPEED STRIKE</span>
        </div>
      );
    }
    if (clickCombo >= 5) {
      return (
        <div className="combo-pill combo-critical" title="Critical Strike Combo!">
          <Flame size={12} className="combo-icon" />
          <span>{clickCombo}x CRITICAL STRIKE</span>
        </div>
      );
    }
    if (clickCombo >= 2) {
      return (
        <div className="combo-pill combo-active" title="Strike Combo Active!">
          <Zap size={12} className="combo-icon" />
          <span>{clickCombo}x STRIKE COMBO</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="samurai-card">
      {/* Background Japanese Mon Crest Watermark */}
      <div className="samurai-card-mon" />

      {/* Click Combo Counter */}
      {getComboBadge()}

      {/* Interactive Samurai Area */}
      <div 
        ref={heroWrapperRef}
        id="samurai-click-target"
        className={`samurai-interactive-wrapper ${clickCombo >= 5 ? 'hero-hyper-glow' : ''}`}
        onClick={handleHeroClick}
        role="button"
        tabIndex={0}
        aria-label="Click to Strike and Earn Money"
      >
        {/* Rotating Sun Rays Halo */}
        <div className="samurai-sun-rays" />

        {/* Solid Crimson Sun Halo Backdrop */}
        <div className="samurai-sun-disc" />

        {/* Samurai Character Image */}
        <img 
          src={getSamuraiAsset()} 
          alt="Samurai Warrior Hero" 
          className={`samurai-character-img ${clickCombo > 5 ? 'combo-pulse' : ''}`}
          draggable={false}
        />

        {/* Transient Katana Slash Lines */}
        {slashes.map(slash => (
          <div 
            key={slash.id}
            className="katana-slash-line"
            style={{
              left: `${slash.x}px`,
              top: `${slash.y}px`,
              transform: `translate(-50%, -50%) rotate(${slash.angle}deg)`
            }}
          />
        ))}

        {/* Click Ring Wave */}
        <div className="samurai-ring-wave" />

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
        className={`earn-money-btn ${clickCombo >= 5 ? 'btn-hyper-charged' : ''}`}
        onClick={(e) => {
          manualClick(e.clientX, e.clientY);
        }}
        title="Earn money with each strike (Press Spacebar anytime)"
      >
        <div className="btn-main-content">
          <Sword size={18} className="btn-sword-icon" />
          <span className="btn-title-text">EARN MONEY</span>
          <span className="btn-hotkey-badge" title="Hotkey: Spacebar">SPACE</span>
        </div>
        <div className="btn-sub-rate">
          <span className="rate-plus">+</span>
          <span className="rate-num">{formatPerClick(clickIncome, state.settings.numberFormat).replace('+', '')}</span>
        </div>
      </button>
    </div>
  );
};

