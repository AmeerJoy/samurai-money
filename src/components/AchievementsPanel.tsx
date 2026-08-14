import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { ACHIEVEMENTS } from '../data/achievements';
import { AchievementCategory } from '../types';
import { getAssetUrl } from '../assets/assets';
import { Trophy, CheckCircle2, Lock, EyeOff } from 'lucide-react';

export const AchievementsPanel: React.FC = () => {
  const { state } = useGame();
  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | 'all'>('all');

  const categories: { id: AchievementCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'wealth', label: 'Wealth' },
    { id: 'clicks', label: 'Clicks' },
    { id: 'upgrades', label: 'Upgrades' },
    { id: 'exploration', label: 'Exploration' },
    { id: 'collection', label: 'Collection' },
    { id: 'secret', label: 'Secrets' }
  ];

  const filteredAchievements = ACHIEVEMENTS.filter(ach => {
    if (selectedCategory === 'all') return true;
    return ach.category === selectedCategory;
  });

  const getAchievementProgress = (ach: (typeof ACHIEVEMENTS)[0]): number => {
    if (state.unlockedAchievementIds.includes(ach.id)) return 100;
    let current = 0;
    const target = typeof ach.requirementValue === 'number' ? ach.requirementValue : 1;

    if (ach.requirementType === 'money') {
      current = state.money;
    } else if (ach.requirementType === 'lifetimeMoney') {
      current = state.lifetimeMoney;
    } else if (ach.requirementType === 'clicks') {
      current = state.statistics.totalClicks;
    } else if (ach.requirementType === 'totalUpgrades') {
      current = Object.values(state.upgradeLevels).reduce((a, b) => a + b, 0);
    } else if (ach.requirementType === 'regionsUnlocked') {
      current = state.unlockedRegionIds.length;
    } else if (ach.requirementType === 'itemsOwned') {
      current = state.ownedItemIds.length;
    } else if (ach.requirementType === 'special') {
      if (ach.id === 'ach-secret-mask') {
        current = state.statistics.maskClickCount || 0;
      } else {
        current = 0;
      }
    }

    return Math.min(100, Math.max(0, target > 0 ? (current / target) * 100 : 0));
  };

  return (
    <div className="panel-card">
      <div className="panel-header-row">
        <h2 className="panel-title">
          <Trophy size={20} color="#F59E0B" />
          HONOR & ACHIEVEMENTS
        </h2>
        <span style={{ fontSize: '0.85rem', color: '#FCD34D', fontWeight: 700 }}>
          {state.unlockedAchievementIds.length} / {ACHIEVEMENTS.length} Completed
        </span>
      </div>

      {/* Category Tabs */}
      <div className="category-tabs">
        {categories.map(cat => (
          <button
            key={cat.id}
            id={`ach-cat-${cat.id}`}
            className={`category-tab-btn ${selectedCategory === cat.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Achievements Grid */}
      <div className="achievements-grid">
        {filteredAchievements.map(ach => {
          const isUnlocked = state.unlockedAchievementIds.includes(ach.id);
          const progressPct = getAchievementProgress(ach);

          return (
            <div
              key={ach.id}
              id={`ach-card-${ach.id}`}
              className={`achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`}
            >
              <div className="achievement-icon-box">
                <img
                  src={isUnlocked ? getAssetUrl(ach.assetId) : (ach.isSecret ? getAssetUrl('secret-mask') : getAssetUrl(ach.assetId))}
                  alt={ach.name}
                  style={!isUnlocked ? { filter: 'brightness(0.3) grayscale(1)' } : {}}
                  loading="lazy"
                />
              </div>

              <div className="achievement-info">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="achievement-name">
                    {isUnlocked ? ach.name : (ach.isSecret ? '??? Secret Honor' : ach.name)}
                  </span>
                  {isUnlocked ? (
                    <CheckCircle2 size={16} color="#10B981" />
                  ) : ach.isSecret ? (
                    <EyeOff size={14} color="#6B7280" />
                  ) : (
                    <Lock size={14} color="#6B7280" />
                  )}
                </div>

                <span className="achievement-desc">
                  {isUnlocked ? ach.description : (ach.isSecret ? (ach.secretHint || 'Requirement hidden.') : ach.description)}
                </span>
              </div>

              {/* Stylish Visual Honor Progress Gauge */}
              {!isUnlocked && (
                <div className="card-afford-progress-track">
                  <div 
                    className="card-afford-progress-fill" 
                    style={{ width: `${progressPct}%` }} 
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
