import React from 'react';
import { useGame, ActiveTab } from '../context/GameContext';
import { Home, Zap, Map, ShoppingBag, Trophy } from 'lucide-react';

export const Navigation: React.FC = () => {
  const { activeTab, setActiveTab, state } = useGame();

  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home size={18} /> },
    { id: 'upgrades', label: 'Upgrades', icon: <Zap size={18} /> },
    { id: 'map', label: 'World Map', icon: <Map size={18} /> },
    { id: 'shop', label: 'Shop', icon: <ShoppingBag size={18} /> },
    { 
      id: 'achievements', 
      label: 'Achievements', 
      icon: <Trophy size={18} />,
      badge: state.unlockedAchievementIds.length 
    }
  ];

  return (
    <>
      {/* Desktop Top Nav */}
      <nav className="desktop-nav" aria-label="Desktop Navigation">
        {tabs.map(tab => (
          <button
            key={tab.id}
            id={`nav-tab-${tab.id}`}
            className={`nav-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Mobile Bottom Nav */}
      <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
        {tabs.map(tab => (
          <button
            key={tab.id}
            id={`mobile-nav-${tab.id}`}
            className={`mobile-nav-item ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>
    </>
  );
};
