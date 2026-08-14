import { GameState } from '../types';

const SAVE_KEY = 'samurai_money_save_v1';
const CURRENT_SAVE_VERSION = 1;

export function getDefaultGameState(): GameState {
  return {
    saveVersion: CURRENT_SAVE_VERSION,
    money: 0,
    lifetimeMoney: 0,
    currentRegionId: 'region-village',
    unlockedRegionIds: ['region-village'],
    upgradeLevels: {},
    ownedItemIds: [],
    unlockedAchievementIds: [],
    statistics: {
      startTime: Date.now(),
      totalPlayTimeSeconds: 0,
      totalClicks: 0,
      lifetimeMoney: 0,
      manualMoneyEarned: 0,
      passiveMoneyEarned: 0,
      upgradesPurchased: 0,
      itemsBought: 0,
      achievementsUnlocked: 0,
      highestClickIncome: 1,
      highestPassiveIncome: 0,
      maskClickCount: 0
    },
    settings: {
      soundEnabled: true,
      musicEnabled: false,
      soundVolume: 0.7,
      musicVolume: 0.3,
      reducedMotion: false,
      numberFormat: 'standard',
      showFloatingNumbers: true
    },
    lastSaveTimestamp: Date.now(),
    tutorialStep: 0
  };
}

export function saveGameState(state: GameState): boolean {
  try {
    const toSave: GameState = {
      ...state,
      lastSaveTimestamp: Date.now()
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(toSave));
    return true;
  } catch (e) {
    console.error('Failed to save Samurai Money state to localStorage:', e);
    return false;
  }
}

export function loadGameState(): GameState {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) {
      return getDefaultGameState();
    }

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      return getDefaultGameState();
    }

    const defaultState = getDefaultGameState();

    // Safe Merge & Validate
    const validatedState: GameState = {
      saveVersion: CURRENT_SAVE_VERSION,
      money: typeof parsed.money === 'number' && !isNaN(parsed.money) && parsed.money >= 0 ? parsed.money : 0,
      lifetimeMoney: typeof parsed.lifetimeMoney === 'number' && !isNaN(parsed.lifetimeMoney) ? parsed.lifetimeMoney : 0,
      currentRegionId: typeof parsed.currentRegionId === 'string' ? parsed.currentRegionId : 'region-village',
      unlockedRegionIds: Array.isArray(parsed.unlockedRegionIds) && parsed.unlockedRegionIds.length > 0 ? parsed.unlockedRegionIds : ['region-village'],
      upgradeLevels: parsed.upgradeLevels && typeof parsed.upgradeLevels === 'object' ? parsed.upgradeLevels : {},
      ownedItemIds: Array.isArray(parsed.ownedItemIds) ? parsed.ownedItemIds : [],
      unlockedAchievementIds: Array.isArray(parsed.unlockedAchievementIds) ? parsed.unlockedAchievementIds : [],
      statistics: {
        ...defaultState.statistics,
        ...(parsed.statistics || {})
      },
      settings: {
        ...defaultState.settings,
        ...(parsed.settings || {})
      },
      lastSaveTimestamp: typeof parsed.lastSaveTimestamp === 'number' ? parsed.lastSaveTimestamp : Date.now(),
      tutorialStep: typeof parsed.tutorialStep === 'number' ? parsed.tutorialStep : 0
    };

    return validatedState;
  } catch (e) {
    console.error('Failed to load save from localStorage, defaulting:', e);
    return getDefaultGameState();
  }
}

export function resetGameState(): GameState {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {
    // Ignore error
  }
  return getDefaultGameState();
}

export function exportSaveString(state: GameState): string {
  return btoa(unescape(encodeURIComponent(JSON.stringify(state))));
}

export function importSaveString(encoded: string): GameState | null {
  try {
    const raw = decodeURIComponent(escape(atob(encoded.trim())));
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      const defaultState = getDefaultGameState();
      return {
        ...defaultState,
        ...parsed,
        saveVersion: CURRENT_SAVE_VERSION,
        lastSaveTimestamp: Date.now()
      };
    }
  } catch (e) {
    console.error('Invalid save import string:', e);
  }
  return null;
}
