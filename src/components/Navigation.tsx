import React from 'react';
import { useGame, ActiveTab } from '../context/GameContext';
import { Home, Zap, Map, ShoppingBag, Trophy } from 'lucide-react';

export const Navigation: React.FC = () => {
  const { activeTab, setActiveTab, state } = useGame();

  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode; hotkey: string; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home size={17} />, hotkey: '1' },
    { id: 'upgrades', label: 'Upgrades', icon: <Zap size={17} />, hotkey: '2' },
    { id: 'map', label: 'World Map', icon: <Map size={17} />, hotkey: '3' },
    { id: 'shop', label: 'Shop', icon: <ShoppingBag size={17} />, hotkey: '4' },
    { 
      id: 'achievements', 
      label: 'Achievements', 
      icon: <Trophy size={17} />, 
      hotkey: '5',
      badge: state.unlockedAchievementIds.length 
    }
  ];

  return (
    <>
      {/* Desktop Top Nav */}
      <nav className="desktop-nav" aria-label="Game Navigation">
        <div className="desktop-nav-container">
          {tabs.map(tab => (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              className={`nav-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="nav-tab-icon">{tab.icon}</span>
              <span className="nav-tab-label">{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="nav-tab-badge">{tab.badge}</span>
              )}
              <span className="nav-tab-hotkey">{tab.hotkey}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Mobile Bottom Nav */}
      <nav className="mobile-bottom-nav" aria-label="Mobile Game Navigation">
        {tabs.map(tab => (
          <button
            key={tab.id}
            id={`mobile-nav-${tab.id}`}
            className={`mobile-nav-item ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <div className="mobile-nav-icon-wrap">
              {tab.icon}
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="mobile-nav-badge">{tab.badge}</span>
              )}
            </div>
            <span className="mobile-nav-label">{tab.label}</span>
          </button>
        ))}
      </nav>
    </>
  );
};

