import { AchievementDefinition } from '../types';

export const ACHIEVEMENTS: AchievementDefinition[] = [
  // --- Wealth Achievements ---
  {
    id: 'ach-wealth-100',
    name: 'First Copper',
    category: 'wealth',
    description: 'Amass your first $100 in fortune.',
    assetId: 'wealth-100-coin',
    rarity: 'Common',
    requirementType: 'money',
    requirementValue: 100
  },
  {
    id: 'ach-wealth-1k',
    name: 'Koban Stacker',
    category: 'wealth',
    description: 'Reach a balance of $1,000.',
    assetId: 'wealth-1k-stack',
    rarity: 'Common',
    requirementType: 'money',
    requirementValue: 1000
  },
  {
    id: 'ach-wealth-10k',
    name: 'Silk Pouch',
    category: 'wealth',
    description: 'Accumulate $10,000 in wealth.',
    assetId: 'wealth-10k-bag',
    rarity: 'Rare',
    requirementType: 'money',
    requirementValue: 10000
  },
  {
    id: 'ach-wealth-100k',
    name: 'Cedar Coffer',
    category: 'wealth',
    description: 'Grow your treasury to $100,000.',
    assetId: 'wealth-100k-chest',
    rarity: 'Rare',
    requirementType: 'money',
    requirementValue: 100000
  },
  {
    id: 'ach-wealth-1m',
    name: 'Millionaire Daimyo',
    category: 'wealth',
    description: 'Enter the millionaire ranks with $1,000,000.',
    assetId: 'wealth-1m-golden-chest',
    rarity: 'Epic',
    requirementType: 'money',
    requirementValue: 1000000
  },
  {
    id: 'ach-wealth-1b',
    name: 'Billionaire Shogun',
    category: 'wealth',
    description: 'Command a staggering fortune of $1,000,000,000.',
    assetId: 'wealth-1b-vault',
    rarity: 'Epic',
    requirementType: 'money',
    requirementValue: 1000000000
  },
  {
    id: 'ach-wealth-1t',
    name: 'Trillionaire Sovereign',
    category: 'wealth',
    description: 'Rule the economy with $1,000,000,000,000 in gold.',
    assetId: 'wealth-1t-giant-vault',
    rarity: 'Legendary',
    requirementType: 'money',
    requirementValue: 1000000000000
  },
  {
    id: 'ach-wealth-1qa',
    name: 'Mountain of Fortune',
    category: 'wealth',
    description: 'Stack gold to the sky with $1 Quadrillion.',
    assetId: 'wealth-1qa-treasure-mountain',
    rarity: 'Legendary',
    requirementType: 'money',
    requirementValue: 1000000000000000
  },
  {
    id: 'ach-wealth-1qi',
    name: 'Imperial Golden Palace',
    category: 'wealth',
    description: 'Build palatial dynasties with $1 Quintillion.',
    assetId: 'wealth-1qi-golden-palace',
    rarity: 'Mythic',
    requirementType: 'money',
    requirementValue: 1000000000000000000
  },
  {
    id: 'ach-wealth-1sx',
    name: 'Cosmic Fortune Throne',
    category: 'wealth',
    description: 'Achieve supreme cosmic wealth beyond $1 Sextillion.',
    assetId: 'wealth-1sx-fortune-throne',
    rarity: 'Mythic',
    requirementType: 'money',
    requirementValue: 1000000000000000000000
  },

  // --- Click Achievements ---
  {
    id: 'ach-click-1',
    name: 'The First Strike',
    category: 'clicks',
    description: 'Click the Samurai to earn your first dollar.',
    assetId: 'emblem-sword',
    rarity: 'Common',
    requirementType: 'clicks',
    requirementValue: 1
  },
  {
    id: 'ach-click-100',
    name: 'Centurion Blade',
    category: 'clicks',
    description: 'Execute 100 sword clicks.',
    assetId: 'emblem-twin-swords',
    rarity: 'Common',
    requirementType: 'clicks',
    requirementValue: 100
  },
  {
    id: 'ach-click-1k',
    name: 'Thousand Slashes',
    category: 'clicks',
    description: 'Execute 1,000 sword clicks.',
    assetId: 'emblem-flaming-sword',
    rarity: 'Rare',
    requirementType: 'clicks',
    requirementValue: 1000
  },
  {
    id: 'ach-click-10k',
    name: 'Relentless Warrior',
    category: 'clicks',
    description: 'Execute 10,000 sword clicks.',
    assetId: 'samurai-battle',
    rarity: 'Epic',
    requirementType: 'clicks',
    requirementValue: 10000
  },

  // --- Upgrade Achievements ---
  {
    id: 'ach-upgrade-1',
    name: 'Humble Investment',
    category: 'upgrades',
    description: 'Purchase your very first upgrade.',
    assetId: 'building-small-shop',
    rarity: 'Common',
    requirementType: 'totalUpgrades',
    requirementValue: 1
  },
  {
    id: 'ach-upgrade-25',
    name: 'Apprentice Builder',
    category: 'upgrades',
    description: 'Purchase 25 total upgrade levels.',
    assetId: 'building-blacksmith',
    rarity: 'Common',
    requirementType: 'totalUpgrades',
    requirementValue: 25
  },
  {
    id: 'ach-upgrade-100',
    name: 'Guild Master',
    category: 'upgrades',
    description: 'Purchase 100 total upgrade levels.',
    assetId: 'building-mine',
    rarity: 'Rare',
    requirementType: 'totalUpgrades',
    requirementValue: 100
  },
  {
    id: 'ach-upgrade-250',
    name: 'Imperial Architect',
    category: 'upgrades',
    description: 'Purchase 250 total upgrade levels.',
    assetId: 'building-fortress',
    rarity: 'Epic',
    requirementType: 'totalUpgrades',
    requirementValue: 250
  },

  // --- Exploration Achievements ---
  {
    id: 'ach-region-2',
    name: 'Bamboo Pilgrim',
    category: 'exploration',
    description: 'Unlock Bamboo Valley & Dojo.',
    assetId: 'region-dojo',
    rarity: 'Common',
    requirementType: 'regionsUnlocked',
    requirementValue: 2
  },
  {
    id: 'ach-region-3',
    name: 'Highland Pioneer',
    category: 'exploration',
    description: 'Unlock the Mountain Province.',
    assetId: 'region-village',
    rarity: 'Rare',
    requirementType: 'regionsUnlocked',
    requirementValue: 3
  },
  {
    id: 'ach-region-4',
    name: 'Capital Baron',
    category: 'exploration',
    description: 'Unlock the Golden Capital.',
    assetId: 'region-fortress',
    rarity: 'Epic',
    requirementType: 'regionsUnlocked',
    requirementValue: 4
  },
  {
    id: 'ach-region-5',
    name: 'Fortress Lord',
    category: 'exploration',
    description: 'Unlock the Imperial Fortress.',
    assetId: 'region-golden-empire',
    rarity: 'Legendary',
    requirementType: 'regionsUnlocked',
    requirementValue: 5
  },
  {
    id: 'ach-region-6',
    name: 'Realm Transcendence',
    category: 'exploration',
    description: 'Unlock all 6 World Regions.',
    assetId: 'legendary-conqueror',
    rarity: 'Mythic',
    requirementType: 'regionsUnlocked',
    requirementValue: 6
  },

  // --- Collection Achievements ---
  {
    id: 'ach-item-1',
    name: 'Armed & Ready',
    category: 'collection',
    description: 'Purchase your first weapon or relic from the Shop.',
    assetId: 'sword-steel-katana',
    rarity: 'Common',
    requirementType: 'itemsOwned',
    requirementValue: 1
  },
  {
    id: 'ach-item-5',
    name: 'Curator of Wealth',
    category: 'collection',
    description: 'Own 5 items in your shop collection.',
    assetId: 'treasure-dragon-vault',
    rarity: 'Rare',
    requirementType: 'itemsOwned',
    requirementValue: 5
  },
  {
    id: 'ach-item-all',
    name: 'Vault of Antiquity',
    category: 'collection',
    description: 'Own all 11 weapons, armor pieces, and treasures.',
    assetId: 'legendary-empire',
    rarity: 'Legendary',
    requirementType: 'itemsOwned',
    requirementValue: 11
  },

  // --- Secret Achievements ---
  {
    id: 'ach-secret-mask',
    name: 'The Hidden Visage',
    category: 'secret',
    description: 'Discovered the hidden spirit by clicking the Samurai mask 50 times.',
    assetId: 'secret-mask',
    rarity: 'Secret',
    isSecret: true,
    secretHint: 'Is there something hidden behind the warrior face?',
    requirementType: 'special',
    requirementValue: 'mask_50'
  },
  {
    id: 'ach-secret-scroll',
    name: 'Ancient Rune Scroll',
    category: 'secret',
    description: 'Unlocked by mastering 10 levels of Clan Scribe.',
    assetId: 'secret-mysterious-scroll',
    rarity: 'Secret',
    isSecret: true,
    secretHint: 'Knowledge is wealth, recorded on ancient parchment...',
    requirementType: 'special',
    requirementValue: 'scribe_10'
  },
  {
    id: 'ach-secret-dark-temple',
    name: 'Zen Tranquility',
    category: 'secret',
    description: 'Generated over $1,000,000 solely through passive meditation.',
    assetId: 'secret-dark-temple',
    rarity: 'Secret',
    isSecret: true,
    secretHint: 'Patience brings stillness, and stillness brings boundless gold...',
    requirementType: 'special',
    requirementValue: 'passive_1m'
  }
];

export function getAchievement(id: string): AchievementDefinition | undefined {
  return ACHIEVEMENTS.find(a => a.id === id);
}
