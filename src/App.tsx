import React, { useEffect } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { TreasuryHub } from './components/TreasuryHub';
import { SamuraiHero } from './components/SamuraiHero';
import { NextGoalIndicator } from './components/NextGoalIndicator';
import { UpgradesPanel } from './components/UpgradesPanel';
import { WorldMapView } from './components/WorldMapView';
import { TradingPanel } from './components/trading/TradingPanel';
import { ShopPanel } from './components/ShopPanel';
import { AchievementsPanel } from './components/AchievementsPanel';
import { StatsModal } from './components/StatsModal';
import { SettingsModal } from './components/SettingsModal';
import { OfflineModal } from './components/OfflineModal';
import { ItemInspectModal } from './components/ItemInspectModal';
import { DebugModal } from './components/DebugModal';
import { ToastContainer } from './components/ToastContainer';
import { FloatingNumbers } from './components/FloatingNumbers';

const GameMain: React.FC = () => {
  const { activeTab, setActiveTab, setActiveModal, manualClick } = useGame();

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore when typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      // Spacebar to earn money
      if (e.code === 'Space') {
        e.preventDefault();
        manualClick();
      }

      // Hotkeys for navigation
      if (e.key === '1') setActiveTab('dashboard');
      if (e.key === '2') setActiveTab('upgrades');
      if (e.key === '3') setActiveTab('map');
      if (e.key === '4') setActiveTab('trading');
      if (e.key === '5') setActiveTab('shop');
      if (e.key === '6') setActiveTab('achievements');

      // QA Debug Modal hotkey Ctrl+Shift+D
      if (e.ctrlKey && e.shiftKey && (e.key === 'D' || e.key === 'd')) {
        e.preventDefault();
        setActiveModal('debug');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [manualClick, setActiveTab, setActiveModal]);

  return (
    <div className="app-container">
      {/* Top Bar */}
      <Header />

      {/* Desktop Navigation */}
      <Navigation />

      {/* Main Content Area */}
      <main className="main-content">
        {activeTab === 'dashboard' && (
          <div className="dashboard-grid">
            <div className="dashboard-left-col">
              <TreasuryHub />
              <SamuraiHero />
              <NextGoalIndicator />
            </div>
            <UpgradesPanel isDashboard={true} />
          </div>
        )}

        {activeTab === 'upgrades' && <UpgradesPanel isDashboard={false} />}

        {activeTab === 'map' && <WorldMapView />}

        {activeTab === 'trading' && <TradingPanel />}

        {activeTab === 'shop' && <ShopPanel />}

        {activeTab === 'achievements' && <AchievementsPanel />}
      </main>

      {/* Floating Damage / Money Particle Layer */}
      <FloatingNumbers />

      {/* Toast Notification Container */}
      <ToastContainer />

      {/* Modals */}
      <StatsModal />
      <SettingsModal />
      <OfflineModal />
      <ItemInspectModal />
      <DebugModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <GameProvider>
      <GameMain />
    </GameProvider>
  );
};

export default App;
