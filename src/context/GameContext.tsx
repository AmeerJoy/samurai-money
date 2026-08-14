import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { 
  GameState, 
  GameSettings, 
  FloatingNumberItem, 
  NotificationToast, 
  ShopItemDefinition 
} from '../types';
import { loadGameState, saveGameState, resetGameState } from '../systems/save';
import { getClickIncome, getPassiveIncome, calculateUpgradeCost, calculateMaxAffordableUpgrades } from '../systems/economy';
import { calculateOfflineEarnings, OfflineEarningsResult } from '../systems/offline';
import { soundEngine } from '../systems/audio';
import { UPGRADES } from '../data/upgrades';
import { REGIONS } from '../data/regions';
import { SHOP_ITEMS } from '../data/items';
import { ACHIEVEMENTS } from '../data/achievements';
import { getAssetUrl } from '../assets/assets';
import confetti from 'canvas-confetti';

export type ActiveTab = 'dashboard' | 'upgrades' | 'map' | 'shop' | 'achievements';
export type ModalType = 'stats' | 'settings' | 'debug' | 'none';

interface GameContextType {
  state: GameState;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  activeModal: ModalType;
  setActiveModal: (modal: ModalType) => void;
  inspectItem: ShopItemDefinition | null;
  setInspectItem: (item: ShopItemDefinition | null) => void;
  offlineModalData: OfflineEarningsResult | null;
  claimOfflineEarnings: () => void;
  floatingNumbers: FloatingNumberItem[];
  toasts: NotificationToast[];
  samuraiPose: 'idle' | 'sword' | 'battle' | 'victory' | 'meditation' | 'rich' | 'legendary';
  clickCombo: number;
  clickIncome: number;
  passiveIncome: number;
  
  // Actions
  manualClick: (x?: number, y?: number) => void;
  buyUpgrade: (upgradeId: string, countMode: 1 | 10 | 'max') => void;
  buyShopItem: (itemId: string) => void;
  travelToRegion: (regionId: string) => void;
  unlockRegion: (regionId: string) => void;
  clickMask: () => void;
  updateSettings: (newSettings: Partial<GameSettings>) => void;
  resetGame: () => void;
  dismissToast: (id: string) => void;
  
  // Cheats
  cheatAddMoney: (amount: number) => void;
  cheatUnlockAll: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<GameState>(() => loadGameState());
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [activeModal, setActiveModal] = useState<ModalType>('none');
  const [inspectItem, setInspectItem] = useState<ShopItemDefinition | null>(null);
  const [offlineModalData, setOfflineModalData] = useState<OfflineEarningsResult | null>(null);
  const [floatingNumbers, setFloatingNumbers] = useState<FloatingNumberItem[]>([]);
  const [toasts, setToasts] = useState<NotificationToast[]>([]);
  const [samuraiPose, setSamuraiPose] = useState<'idle' | 'sword' | 'battle' | 'victory' | 'meditation' | 'rich' | 'legendary'>('idle');
  const [clickCombo, setClickCombo] = useState<number>(0);

  // References for mutable game loop
  const stateRef = useRef<GameState>(state);
  stateRef.current = state;
  const lastTickTime = useRef<number>(Date.now());
  const incomeAccumulator = useRef<number>(0);
  const poseResetTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const comboResetTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Pre-calculated Income Rates
  const clickIncome = getClickIncome(state);
  const passiveIncome = getPassiveIncome(state);

  // Sync sound settings whenever state.settings changes
  useEffect(() => {
    soundEngine.setSettings(
      state.settings.soundEnabled,
      state.settings.musicEnabled,
      state.settings.soundVolume,
      state.settings.musicVolume
    );
  }, [state.settings]);

  // Trigger Toast Notification with Sound and optional Confetti
  const triggerToast = useCallback((title: string, subtitle: string, iconAssetUrl: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const newToast: NotificationToast = {
      id,
      title,
      subtitle,
      iconAssetUrl,
      timestamp: Date.now()
    };

    setToasts(prev => [newToast, ...prev.slice(0, 3)]);
    soundEngine.playAchievement();

    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.15, x: 0.5 },
        colors: ['#D20A2E', '#F59E0B', '#FCD34D', '#FFFFFF']
      });
    } catch {
      // Confetti fallback
    }

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Check and unlock achievements
  const checkAchievements = useCallback((currentState: GameState) => {
    const newlyUnlocked: string[] = [];
    const totalUpgradesCount = Object.values(currentState.upgradeLevels).reduce((a, b) => a + b, 0);

    ACHIEVEMENTS.forEach(ach => {
      if (currentState.unlockedAchievementIds.includes(ach.id)) return;

      let unlocked = false;
      if (ach.requirementType === 'money' && currentState.money >= (ach.requirementValue as number)) {
        unlocked = true;
      } else if (ach.requirementType === 'lifetimeMoney' && currentState.lifetimeMoney >= (ach.requirementValue as number)) {
        unlocked = true;
      } else if (ach.requirementType === 'clicks' && currentState.statistics.totalClicks >= (ach.requirementValue as number)) {
        unlocked = true;
      } else if (ach.requirementType === 'totalUpgrades' && totalUpgradesCount >= (ach.requirementValue as number)) {
        unlocked = true;
      } else if (ach.requirementType === 'regionsUnlocked' && currentState.unlockedRegionIds.length >= (ach.requirementValue as number)) {
        unlocked = true;
      } else if (ach.requirementType === 'itemsOwned' && currentState.ownedItemIds.length >= (ach.requirementValue as number)) {
        unlocked = true;
      } else if (ach.requirementType === 'special') {
        if (ach.requirementValue === 'mask_50' && currentState.statistics.maskClickCount >= 50) {
          unlocked = true;
        } else if (ach.requirementValue === 'scribe_10' && (currentState.upgradeLevels['clan-scribe'] || 0) >= 10) {
          unlocked = true;
        } else if (ach.requirementValue === 'passive_1m' && currentState.statistics.passiveMoneyEarned >= 1000000) {
          unlocked = true;
        }
      }

      if (unlocked) {
        newlyUnlocked.push(ach.id);
        triggerToast('Achievement Unlocked!', ach.name, getAssetUrl(ach.assetId));
      }
    });

    if (newlyUnlocked.length > 0) {
      setState(prev => ({
        ...prev,
        unlockedAchievementIds: [...prev.unlockedAchievementIds, ...newlyUnlocked],
        statistics: {
          ...prev.statistics,
          achievementsUnlocked: prev.statistics.achievementsUnlocked + newlyUnlocked.length
        }
      }));
    }
  }, [triggerToast]);

  // Initial Offline Earnings Check
  useEffect(() => {
    const offline = calculateOfflineEarnings(state);
    if (offline.hasEarnings) {
      setOfflineModalData(offline);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const claimOfflineEarnings = () => {
    if (!offlineModalData) return;
    const amount = offlineModalData.earnedMoney;
    soundEngine.playPurchase();
    setState(prev => {
      const nextState: GameState = {
        ...prev,
        money: prev.money + amount,
        lifetimeMoney: prev.lifetimeMoney + amount,
        statistics: {
          ...prev.statistics,
          lifetimeMoney: prev.statistics.lifetimeMoney + amount,
          passiveMoneyEarned: prev.statistics.passiveMoneyEarned + amount
        }
      };
      saveGameState(nextState);
      return nextState;
    });
    setOfflineModalData(null);
  };

  // High Precision Game Loop via requestAnimationFrame
  useEffect(() => {
    let animId: number;
    let autoSaveTimer = 0;
    let achievementCheckTimer = 0;

    const tick = () => {
      const now = Date.now();
      const deltaSec = Math.min(1.0, (now - lastTickTime.current) / 1000);
      lastTickTime.current = now;

      const currentPassive = getPassiveIncome(stateRef.current);
      if (currentPassive > 0) {
        incomeAccumulator.current += currentPassive * deltaSec;
        if (incomeAccumulator.current >= 1) {
          const moneyToAdd = Math.floor(incomeAccumulator.current);
          incomeAccumulator.current -= moneyToAdd;

          setState(prev => ({
            ...prev,
            money: prev.money + moneyToAdd,
            lifetimeMoney: prev.lifetimeMoney + moneyToAdd,
            statistics: {
              ...prev.statistics,
              totalPlayTimeSeconds: prev.statistics.totalPlayTimeSeconds + deltaSec,
              lifetimeMoney: prev.statistics.lifetimeMoney + moneyToAdd,
              passiveMoneyEarned: prev.statistics.passiveMoneyEarned + moneyToAdd,
              highestPassiveIncome: Math.max(prev.statistics.highestPassiveIncome, currentPassive)
            }
          }));
        }
      }

      // Auto-save every 5 seconds
      autoSaveTimer += deltaSec;
      if (autoSaveTimer >= 5) {
        autoSaveTimer = 0;
        saveGameState(stateRef.current);
      }

      // Check achievements every 2 seconds
      achievementCheckTimer += deltaSec;
      if (achievementCheckTimer >= 2) {
        achievementCheckTimer = 0;
        checkAchievements(stateRef.current);
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [checkAchievements]);

  // Clean up floating numbers
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setFloatingNumbers(prev => prev.filter(f => now - f.createdAt < 1200));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  // Multi-tab save protection & synchronization
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'samurai_money_save_v1' && e.newValue) {
        try {
          const synced = JSON.parse(e.newValue);
          if (synced && synced.saveVersion) {
            setState(synced);
          }
        } catch {
          // Ignore
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Manual Click Action
  const manualClick = useCallback((x?: number, y?: number) => {
    const earned = getClickIncome(stateRef.current);
    const newCombo = clickCombo + 1;
    setClickCombo(newCombo);

    if (comboResetTimeout.current) clearTimeout(comboResetTimeout.current);
    comboResetTimeout.current = setTimeout(() => setClickCombo(0), 1200);

    // Audio Feedback
    soundEngine.playClick(newCombo > 10);

    // Dynamic Samurai Pose
    if (earned >= 1000000000) {
      setSamuraiPose('legendary');
    } else if (earned >= 1000000) {
      setSamuraiPose('rich');
    } else if (newCombo % 5 === 0) {
      setSamuraiPose('battle');
    } else {
      setSamuraiPose('sword');
    }

    if (poseResetTimeout.current) clearTimeout(poseResetTimeout.current);
    poseResetTimeout.current = setTimeout(() => {
      setSamuraiPose('idle');
    }, 280);

    // Spawn Floating Number
    if (stateRef.current.settings.showFloatingNumbers) {
      const targetX = x !== undefined ? x : window.innerWidth / 2 + (Math.random() * 80 - 40);
      const targetY = y !== undefined ? y : window.innerHeight / 2 - 40 + (Math.random() * 40 - 20);
      const newFloating: FloatingNumberItem = {
        id: `float-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        text: `+$${earned >= 1000 ? earned.toLocaleString() : earned}`,
        x: targetX,
        y: targetY,
        isCritical: newCombo > 10 && newCombo % 5 === 0,
        createdAt: Date.now()
      };
      setFloatingNumbers(prev => [...prev.slice(-15), newFloating]);
    }

    // Update State
    setState(prev => {
      const nextTutorial = prev.tutorialStep === 0 ? 1 : prev.tutorialStep;
      const nextState: GameState = {
        ...prev,
        money: prev.money + earned,
        lifetimeMoney: prev.lifetimeMoney + earned,
        tutorialStep: nextTutorial,
        statistics: {
          ...prev.statistics,
          totalClicks: prev.statistics.totalClicks + 1,
          lifetimeMoney: prev.statistics.lifetimeMoney + earned,
          manualMoneyEarned: prev.statistics.manualMoneyEarned + earned,
          highestClickIncome: Math.max(prev.statistics.highestClickIncome, earned)
        }
      };
      return nextState;
    });
  }, [clickCombo]);

  // Buy Upgrade Action
  const buyUpgrade = useCallback((upgradeId: string, countMode: 1 | 10 | 'max') => {
    const upgrade = UPGRADES.find(u => u.id === upgradeId);
    if (!upgrade) return;

    const currentLevel = stateRef.current.upgradeLevels[upgradeId] || 0;
    let buyCount = 1;
    let totalCost = 0;

    if (countMode === 1) {
      buyCount = 1;
      totalCost = calculateUpgradeCost(upgrade.baseCost, upgrade.growthRate, currentLevel, 1);
    } else if (countMode === 10) {
      buyCount = 10;
      totalCost = calculateUpgradeCost(upgrade.baseCost, upgrade.growthRate, currentLevel, 10);
    } else if (countMode === 'max') {
      const maxAffordable = calculateMaxAffordableUpgrades(upgrade.baseCost, upgrade.growthRate, currentLevel, stateRef.current.money);
      buyCount = maxAffordable.count;
      totalCost = maxAffordable.totalCost;
    }

    if (buyCount <= 0 || stateRef.current.money < totalCost) {
      return; // Cannot afford
    }

    soundEngine.playPurchase();

    setState(prev => {
      const nextTutorial = prev.tutorialStep === 1 ? 2 : prev.tutorialStep;
      const nextState: GameState = {
        ...prev,
        money: prev.money - totalCost,
        tutorialStep: nextTutorial,
        upgradeLevels: {
          ...prev.upgradeLevels,
          [upgradeId]: currentLevel + buyCount
        },
        statistics: {
          ...prev.statistics,
          upgradesPurchased: prev.statistics.upgradesPurchased + buyCount
        }
      };
      saveGameState(nextState);
      return nextState;
    });
  }, []);

  // Buy Shop Item Action
  const buyShopItem = useCallback((itemId: string) => {
    const item = SHOP_ITEMS.find(i => i.id === itemId);
    if (!item) return;
    if (stateRef.current.ownedItemIds.includes(itemId)) return;
    if (stateRef.current.money < item.cost) return;

    soundEngine.playPurchase();

    setState(prev => {
      const nextState: GameState = {
        ...prev,
        money: prev.money - item.cost,
        ownedItemIds: [...prev.ownedItemIds, itemId],
        statistics: {
          ...prev.statistics,
          itemsBought: prev.statistics.itemsBought + 1
        }
      };
      saveGameState(nextState);
      return nextState;
    });

    triggerToast('Item Acquired!', item.name, getAssetUrl(item.assetId));
  }, [triggerToast]);

  // Travel to an unlocked region
  const travelToRegion = useCallback((regionId: string) => {
    if (!stateRef.current.unlockedRegionIds.includes(regionId)) return;
    soundEngine.playClick();
    setState(prev => {
      const nextState = { ...prev, currentRegionId: regionId };
      saveGameState(nextState);
      return nextState;
    });
  }, []);

  // Unlock a new region
  const unlockRegion = useCallback((regionId: string) => {
    const region = REGIONS.find(r => r.id === regionId);
    if (!region) return;
    if (stateRef.current.unlockedRegionIds.includes(regionId)) return;
    if (stateRef.current.money < region.requirement) return;

    soundEngine.playRegionUnlock();

    setState(prev => {
      const nextState: GameState = {
        ...prev,
        currentRegionId: regionId,
        unlockedRegionIds: [...prev.unlockedRegionIds, regionId]
      };
      saveGameState(nextState);
      return nextState;
    });

    triggerToast('Region Unlocked!', region.name, getAssetUrl(region.backgroundAssetId));
  }, [triggerToast]);

  // Secret Mask Click
  const clickMask = useCallback(() => {
    soundEngine.playClick(true);
    setState(prev => {
      const newMaskCount = prev.statistics.maskClickCount + 1;
      const nextState = {
        ...prev,
        statistics: {
          ...prev.statistics,
          maskClickCount: newMaskCount
        }
      };
      return nextState;
    });
  }, []);

  const updateSettings = useCallback((newSettings: Partial<GameSettings>) => {
    setState(prev => {
      const nextState = {
        ...prev,
        settings: { ...prev.settings, ...newSettings }
      };
      saveGameState(nextState);
      return nextState;
    });
  }, []);

  const resetGame = useCallback(() => {
    const fresh = resetGameState();
    setState(fresh);
    setActiveModal('none');
    setActiveTab('dashboard');
  }, []);

  // QA Developer Cheats
  const cheatAddMoney = useCallback((amount: number) => {
    soundEngine.playPurchase();
    setState(prev => {
      const nextState: GameState = {
        ...prev,
        money: prev.money + amount,
        lifetimeMoney: prev.lifetimeMoney + amount
      };
      saveGameState(nextState);
      return nextState;
    });
  }, []);

  const cheatUnlockAll = useCallback(() => {
    soundEngine.playAchievement();
    setState(prev => {
      const allRegions = REGIONS.map(r => r.id);
      const allItems = SHOP_ITEMS.map(i => i.id);
      const nextState: GameState = {
        ...prev,
        unlockedRegionIds: allRegions,
        ownedItemIds: allItems
      };
      saveGameState(nextState);
      return nextState;
    });
  }, []);

  return (
    <GameContext.Provider
      value={{
        state,
        activeTab,
        setActiveTab,
        activeModal,
        setActiveModal,
        inspectItem,
        setInspectItem,
        offlineModalData,
        claimOfflineEarnings,
        floatingNumbers,
        toasts,
        samuraiPose,
        clickCombo,
        clickIncome,
        passiveIncome,
        manualClick,
        buyUpgrade,
        buyShopItem,
        travelToRegion,
        unlockRegion,
        clickMask,
        updateSettings,
        resetGame,
        dismissToast,
        cheatAddMoney,
        cheatUnlockAll
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export function useGame(): GameContextType {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
