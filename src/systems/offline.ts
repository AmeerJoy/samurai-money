import { GameState } from '../types';
import { getPassiveIncome } from './economy';

const MAX_OFFLINE_SECONDS = 86400; // 24 hours maximum offline earnings
const MIN_OFFLINE_SECONDS = 10; // Minimum 10 seconds away to trigger welcome modal

export interface OfflineEarningsResult {
  hasEarnings: boolean;
  elapsedSeconds: number;
  earnedMoney: number;
}

export function calculateOfflineEarnings(state: GameState, now: number = Date.now()): OfflineEarningsResult {
  const passiveRate = getPassiveIncome(state);
  if (passiveRate <= 0) {
    return { hasEarnings: false, elapsedSeconds: 0, earnedMoney: 0 };
  }

  const lastSave = state.lastSaveTimestamp || now;
  const rawElapsedSeconds = Math.max(0, Math.floor((now - lastSave) / 1000));

  if (rawElapsedSeconds < MIN_OFFLINE_SECONDS) {
    return { hasEarnings: false, elapsedSeconds: rawElapsedSeconds, earnedMoney: 0 };
  }

  const elapsedSeconds = Math.min(rawElapsedSeconds, MAX_OFFLINE_SECONDS);
  const earnedMoney = Math.floor(passiveRate * elapsedSeconds);

  return {
    hasEarnings: earnedMoney > 0,
    elapsedSeconds,
    earnedMoney
  };
}
