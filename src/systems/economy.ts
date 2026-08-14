import { GameState } from '../types';
import { UPGRADES } from '../data/upgrades';
import { REGIONS } from '../data/regions';
import { SHOP_ITEMS } from '../data/items';

/**
 * Calculate the total money earned per manual click
 */
export function getClickIncome(state: GameState): number {
  let baseClick = 1; // Base starting click income ($1)

  // Add click upgrades base income
  UPGRADES.forEach(u => {
    const level = state.upgradeLevels[u.id] || 0;
    if (level > 0 && u.isClickUpgrade && u.baseIncome > 0) {
      baseClick += u.baseIncome * level;
    }
  });

  // Add Flat Click bonuses from items (e.g. Steel Katana)
  state.ownedItemIds.forEach(itemId => {
    const item = SHOP_ITEMS.find(i => i.id === itemId);
    if (item && item.clickBonus) {
      baseClick += item.clickBonus;
    }
  });

  // Calculate Multipliers
  let multiplier = 1.0;

  // Training, Wealth & Empire multipliers affecting click (additive scaling per level)
  UPGRADES.forEach(u => {
    const level = state.upgradeLevels[u.id] || 0;
    if (level > 0 && u.multiplier) {
      if (u.multiplierType === 'click' || u.multiplierType === 'global' || (u.isClickUpgrade && !u.multiplierType)) {
        multiplier += (u.multiplier - 1.0) * level;
      }
    }
  });

  // Shop item click multipliers
  state.ownedItemIds.forEach(itemId => {
    const item = SHOP_ITEMS.find(i => i.id === itemId);
    if (item && item.clickMultiplier) {
      multiplier *= item.clickMultiplier;
    }
  });

  // Active Region multiplier
  const region = REGIONS.find(r => r.id === state.currentRegionId) || REGIONS[0];
  if (region && region.multiplier) {
    multiplier *= region.multiplier;
  }

  return Math.max(1, Math.floor(baseClick * multiplier));
}

/**
 * Calculate the total passive income generated per second ($/sec)
 */
export function getPassiveIncome(state: GameState): number {
  let basePassive = 0;

  // Sum all building & worker incomes
  UPGRADES.forEach(u => {
    const level = state.upgradeLevels[u.id] || 0;
    if (level > 0 && !u.isClickUpgrade && u.baseIncome > 0) {
      basePassive += u.baseIncome * level;
    }
  });

  if (basePassive === 0) return 0;

  // Calculate Multipliers
  let multiplier = 1.0;

  // Training, Wealth, and Empire multipliers (additive scaling per level)
  UPGRADES.forEach(u => {
    const level = state.upgradeLevels[u.id] || 0;
    if (level > 0 && u.multiplier) {
      if (u.multiplierType === 'passive' || u.multiplierType === 'global' || (!u.multiplierType && !u.isClickUpgrade)) {
        multiplier += (u.multiplier - 1.0) * level;
      }
    }
  });

  // Shop item passive multipliers
  state.ownedItemIds.forEach(itemId => {
    const item = SHOP_ITEMS.find(i => i.id === itemId);
    if (item && item.passiveMultiplier) {
      multiplier *= item.passiveMultiplier;
    }
  });

  // Active Region multiplier
  const region = REGIONS.find(r => r.id === state.currentRegionId) || REGIONS[0];
  if (region && region.multiplier) {
    multiplier *= region.multiplier;
  }

  return Math.floor(basePassive * multiplier);
}

/**
 * Calculate the cost to purchase `count` levels of an upgrade:
 * Cost = BaseCost * (GrowthRate^Level) * ( (GrowthRate^Count - 1) / (GrowthRate - 1) )
 */
export function calculateUpgradeCost(
  baseCost: number,
  growthRate: number,
  currentLevel: number,
  count: number = 1
): number {
  if (count <= 0) return 0;
  if (count === 1) {
    return Math.floor(baseCost * Math.pow(growthRate, currentLevel));
  }

  // Geometric series sum: a * (r^n - 1) / (r - 1)
  const firstTermCost = baseCost * Math.pow(growthRate, currentLevel);
  const totalCost = firstTermCost * (Math.pow(growthRate, count) - 1) / (growthRate - 1);
  return Math.floor(totalCost);
}

/**
 * Calculate the maximum number of levels affordable with currentMoney, and total cost
 */
export function calculateMaxAffordableUpgrades(
  baseCost: number,
  growthRate: number,
  currentLevel: number,
  currentMoney: number
): { count: number; totalCost: number } {
  if (currentMoney <= 0) return { count: 0, totalCost: 0 };

  const firstCost = calculateUpgradeCost(baseCost, growthRate, currentLevel, 1);
  if (currentMoney < firstCost) {
    return { count: 0, totalCost: 0 };
  }

  // Math: currentMoney >= baseCost * r^L * (r^N - 1) / (r - 1)
  // r^N <= 1 + currentMoney * (r - 1) / (baseCost * r^L)
  // N = floor( log( 1 + currentMoney * (r - 1) / firstCost ) / log(r) )
  const r = growthRate;
  const term = 1 + (currentMoney * (r - 1)) / firstCost;
  let count = Math.floor(Math.log(term) / Math.log(r));

  if (count <= 0) count = 1;

  // Clamp & double check against rounding errors
  let totalCost = calculateUpgradeCost(baseCost, growthRate, currentLevel, count);
  while (totalCost > currentMoney && count > 0) {
    count--;
    totalCost = calculateUpgradeCost(baseCost, growthRate, currentLevel, count);
  }

  // Cap at 1000 per single click to prevent runaway numbers
  if (count > 1000) {
    count = 1000;
    totalCost = calculateUpgradeCost(baseCost, growthRate, currentLevel, count);
  }

  return { count, totalCost };
}

export interface UpgradeImpactPreview {
  currentClick: number;
  projectedClick: number;
  clickDelta: number;
  currentPassive: number;
  projectedPassive: number;
  passiveDelta: number;
  count: number;
  totalCost: number;
  canAfford: boolean;
  remainingMoney: number;
}

/**
 * Accurately simulates the exact Before -> After impact of purchasing an upgrade
 */
export function simulateUpgradeImpact(
  state: GameState,
  upgradeId: string,
  buyMode: 1 | 10 | 'max'
): UpgradeImpactPreview {
  const upgrade = UPGRADES.find(u => u.id === upgradeId);
  const currentClick = getClickIncome(state);
  const currentPassive = getPassiveIncome(state);

  if (!upgrade) {
    return {
      currentClick,
      projectedClick: currentClick,
      clickDelta: 0,
      currentPassive,
      projectedPassive: currentPassive,
      passiveDelta: 0,
      count: 0,
      totalCost: 0,
      canAfford: false,
      remainingMoney: state.money
    };
  }

  const currentLevel = state.upgradeLevels[upgradeId] || 0;
  let count = 1;
  let totalCost = 0;

  if (buyMode === 1) {
    count = 1;
    totalCost = calculateUpgradeCost(upgrade.baseCost, upgrade.growthRate, currentLevel, 1);
  } else if (buyMode === 10) {
    count = 10;
    totalCost = calculateUpgradeCost(upgrade.baseCost, upgrade.growthRate, currentLevel, 10);
  } else if (buyMode === 'max') {
    const maxAffordable = calculateMaxAffordableUpgrades(upgrade.baseCost, upgrade.growthRate, currentLevel, state.money);
    count = Math.max(1, maxAffordable.count);
    totalCost = maxAffordable.totalCost || calculateUpgradeCost(upgrade.baseCost, upgrade.growthRate, currentLevel, 1);
  }

  const canAfford = state.money >= totalCost && count > 0;

  // Create simulated state with additional levels
  const simulatedState: GameState = {
    ...state,
    money: Math.max(0, state.money - totalCost),
    upgradeLevels: {
      ...state.upgradeLevels,
      [upgradeId]: currentLevel + count
    }
  };

  const projectedClick = getClickIncome(simulatedState);
  const projectedPassive = getPassiveIncome(simulatedState);

  return {
    currentClick,
    projectedClick,
    clickDelta: Math.max(0, projectedClick - currentClick),
    currentPassive,
    projectedPassive,
    passiveDelta: Math.max(0, projectedPassive - currentPassive),
    count,
    totalCost,
    canAfford,
    remainingMoney: Math.max(0, state.money - totalCost)
  };
}

/**
 * Calculate the historical impact and empire contribution made by an upgrade at its current level
 */
export function getMasteryContribution(state: GameState, upgradeId: string) {
  const upgrade = UPGRADES.find(u => u.id === upgradeId);
  if (!upgrade) return null;

  const level = state.upgradeLevels[upgradeId] || 0;
  const totalInvested = level > 0 
    ? calculateUpgradeCost(upgrade.baseCost, upgrade.growthRate, 0, level) 
    : 0;

  const currentClick = getClickIncome(state);
  const currentPassive = getPassiveIncome(state);

  let directBaseContribution = 0;
  let percentOfTotal = 0;
  let activeBonusText = '';

  if (upgrade.baseIncome > 0) {
    directBaseContribution = upgrade.baseIncome * level;
    if (upgrade.isClickUpgrade) {
      percentOfTotal = currentClick > 0 ? (directBaseContribution / currentClick) * 100 : 0;
      activeBonusText = `+${directBaseContribution.toLocaleString('en-US')} / click`;
    } else {
      percentOfTotal = currentPassive > 0 ? (directBaseContribution / currentPassive) * 100 : 0;
      activeBonusText = `+${directBaseContribution.toLocaleString('en-US')} / sec`;
    }
  } else if (upgrade.multiplier) {
    const basePct = Math.round((upgrade.multiplier - 1) * 100);
    const totalMultiplierPct = basePct * level;
    activeBonusText = `+${totalMultiplierPct}% ${upgrade.multiplierType ? upgrade.multiplierType.toUpperCase() : 'GLOBAL'}`;
    percentOfTotal = totalMultiplierPct;
  }

  // Next Milestone Tier
  let nextTierLevel = 10;
  let tierName = 'Unranked';
  if (level === 0) {
    nextTierLevel = 1;
    tierName = 'Unowned';
  } else if (level < 10) {
    nextTierLevel = 10;
    tierName = 'Tier 1: Novice';
  } else if (level < 25) {
    nextTierLevel = 25;
    tierName = 'Tier 2: Adept';
  } else if (level < 50) {
    nextTierLevel = 50;
    tierName = 'Tier 3: Master';
  } else if (level < 100) {
    nextTierLevel = 100;
    tierName = 'Tier 4: Grandmaster';
  } else {
    nextTierLevel = level + 50;
    tierName = 'Tier 5: Legendary Sovereign';
  }

  return {
    upgrade,
    level,
    totalInvested,
    directBaseContribution,
    percentOfTotal: Math.min(100, percentOfTotal),
    activeBonusText,
    tierName,
    nextTierLevel,
    levelsToNextTier: Math.max(0, nextTierLevel - level)
  };
}
