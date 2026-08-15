import React from 'react';
import { useGame } from '../context/GameContext';
import { REGIONS } from '../data/regions';
import { formatMoney } from '../systems/formatting';
import { getAssetUrl } from '../assets/assets';
import { Map, Lock, CheckCircle2, Sparkles } from 'lucide-react';

export const WorldMapView: React.FC = () => {
  const { state, travelToRegion, unlockRegion } = useGame();

  return (
    <div className="panel-card">
      <div className="panel-header-row">
        <h2 className="panel-title">
          <Map size={20} color="#D20A2E" />
          FEUDAL WORLD MAP
        </h2>
        <span style={{ fontSize: '0.85rem', color: '#9CA3AF' }}>
          {state.unlockedRegionIds.length} / {REGIONS.length} Regions Unlocked
        </span>
      </div>

      <div className="world-map-grid">
        {REGIONS.map(region => {
          const isUnlocked = state.unlockedRegionIds.includes(region.id);
          const isActive = state.currentRegionId === region.id;
          const canUnlock = state.money >= region.requirement;
          const progressPct = Math.min(100, Math.max(0, region.requirement > 0 ? (state.money / region.requirement) * 100 : 0));

          return (
            <div 
              key={region.id}
              id={`region-card-${region.id}`}
              className={`region-card ${isActive ? 'active-region' : ''} ${!isUnlocked ? 'locked' : ''}`}
            >
              {/* Region Background Banner */}
              <div className="region-bg-wrapper">
                <img 
                  src={getAssetUrl(region.backgroundAssetId)} 
                  alt={region.name} 
                  className="region-bg-img"
                  loading="lazy"
                />
                {isActive && (
                  <div className="region-active-badge">
                    ACTIVE REALM
                  </div>
                )}
              </div>

              {/* Region Body */}
              <div className="region-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 className="region-name">{region.name}</h3>
                  {isUnlocked && <CheckCircle2 size={16} color="#10B981" />}
                </div>

                <div className="region-bonus">
                  <Sparkles size={13} style={{ display: 'inline', marginRight: 4 }} />
                  {region.bonusDescription}
                </div>

                <div className="region-landmark-box">
                  <img 
                    src={getAssetUrl(region.landmarkAssetId)} 
                    alt={region.landmarkName} 
                    style={{ 
                      width: 36, 
                      height: 36, 
                      borderRadius: 8, 
                      objectFit: 'contain', 
                      background: '#000000',
                      border: '1px solid rgba(255, 32, 53, 0.25)',
                      flexShrink: 0 
                    }}
                  />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontWeight: 700, color: '#FFF', fontSize: '0.82rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {region.landmarkName}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#9CA3AF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {region.theme}
                    </div>
                  </div>
                </div>

                {/* Region Actions */}
                {isUnlocked ? (
                  <button
                    id={`travel-btn-${region.id}`}
                    className={`region-action-btn travel`}
                    disabled={isActive}
                    onClick={() => travelToRegion(region.id)}
                  >
                    {isActive ? 'CURRENT DOMAIN' : 'TRAVEL TO REGION'}
                  </button>
                ) : (
                  <div className="region-unlock-area">
                    {canUnlock ? (
                      <button
                        id={`unlock-btn-${region.id}`}
                        className="region-action-btn unlock"
                        onClick={() => unlockRegion(region.id)}
                      >
                        UNLOCK FOR {formatMoney(region.requirement, state.settings.numberFormat)}
                      </button>
                    ) : (
                      <div className="region-locked-req">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                          <Lock size={14} />
                          <span>REQUIRES {formatMoney(region.requirement, state.settings.numberFormat)}</span>
                        </div>
                        <div className="region-req-bar">
                          <div 
                            className="region-req-fill" 
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
