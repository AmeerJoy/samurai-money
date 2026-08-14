export type UpgradeCategory = 
  | 'click' 
  | 'workers' 
  | 'buildings' 
  | 'training' 
  | 'wealth' 
  | 'empire';

export interface UpgradeDefinition {
  id: string;
  name: string;
  category: UpgradeCategory;
  description: string;
  baseCost: number;
  growthRate: number;
  baseIncome: number; // Income per second or per click depending on category
  isClickUpgrade?: boolean;
  multiplier?: number; // Percentage multiplier (e.g. 1.10 = +10%)
  multiplierType?: 'click' | 'passive' | 'global'; // Target for multiplier
  iconAssetId?: string;
  requiredRegionId?: string;
  requiredMoney?: number;
}

export interface RegionDefinition {
  id: string;
  order: number;
  name: string;
  requirement: number; // Money required to unlock
  backgroundAssetId: string;
  landmarkAssetId: string;
  landmarkName: string;
  landmarkDescription: string;
  description: string;
  theme: string;
  bonusDescription: string;
  multiplier: number; // Regional global income boost (e.g. 1.25 = +25%)
}

export type ItemCategory = 'sword' | 'armor' | 'treasure';
export type ItemRarity = 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic' | 'Secret';

export interface ShopItemDefinition {
  id: string;
  name: string;
  category: ItemCategory;
  rarity: ItemRarity;
  cost: number;
  assetId: string;
  description: string;
  effect: string;
  clickBonus?: number; // Flat or percentage
  passiveMultiplier?: number; // e.g. 1.1 = +10%
  clickMultiplier?: number; // e.g. 1.1 = +10%
}

export type AchievementCategory = 'wealth' | 'clicks' | 'upgrades' | 'exploration' | 'collection' | 'secret';

export interface AchievementDefinition {
  id: string;
  name: string;
  category: AchievementCategory;
  description: string;
  assetId: string;
  rarity: ItemRarity;
  isSecret?: boolean;
  secretHint?: string;
  requirementType: 'money' | 'lifetimeMoney' | 'clicks' | 'totalUpgrades' | 'regionsUnlocked' | 'itemsOwned' | 'special';
  requirementValue: number | string;
}

export interface GameStatistics {
  startTime: number;
  totalPlayTimeSeconds: number;
  totalClicks: number;
  lifetimeMoney: number;
  manualMoneyEarned: number;
  passiveMoneyEarned: number;
  upgradesPurchased: number;
  itemsBought: number;
  achievementsUnlocked: number;
  highestClickIncome: number;
  highestPassiveIncome: number;
  maskClickCount: number; // secret achievement tracker
}

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  soundVolume: number;
  musicVolume: number;
  reducedMotion: boolean;
  numberFormat: 'standard' | 'scientific';
  showFloatingNumbers: boolean;
}

export interface GameState {
  saveVersion: number;
  money: number;
  lifetimeMoney: number;
  currentRegionId: string;
  unlockedRegionIds: string[];
  upgradeLevels: Record<string, number>;
  ownedItemIds: string[];
  unlockedAchievementIds: string[];
  statistics: GameStatistics;
  settings: GameSettings;
  lastSaveTimestamp: number;
  tutorialStep: number; // 0 = welcome, 1 = first click done, 2 = first upgrade done, 3 = completed
}

export interface FloatingNumberItem {
  id: string;
  text: string;
  x: number;
  y: number;
  isCritical?: boolean;
  color?: string;
  createdAt: number;
}

export interface NotificationToast {
  id: string;
  title: string;
  subtitle: string;
  iconAssetUrl: string;
  timestamp: number;
}
