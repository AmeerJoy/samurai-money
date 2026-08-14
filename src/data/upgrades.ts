import { UpgradeDefinition } from '../types';

export const UPGRADES: UpgradeDefinition[] = [
  // --- Category: Click Power ---
  {
    id: 'sharpened-blade',
    name: 'Sharpened Blade',
    category: 'click',
    description: 'Hones the edge of your katana to strike more fortune per click.',
    baseCost: 10,
    growthRate: 1.15,
    baseIncome: 1,
    isClickUpgrade: true,
    iconAssetId: 'emblem-sword'
  },
  {
    id: 'better-grip',
    name: 'Better Grip',
    category: 'click',
    description: 'Cord-wrapped ray skin grip for stronger, faster slashes.',
    baseCost: 100,
    growthRate: 1.16,
    baseIncome: 5,
    isClickUpgrade: true,
    iconAssetId: 'emblem-twin-swords'
  },
  {
    id: 'razor-edge',
    name: 'Razor Edge',
    category: 'click',
    description: 'Polished to razor keenness, cutting deep into merchant coffers.',
    baseCost: 1000,
    growthRate: 1.17,
    baseIncome: 25,
    isClickUpgrade: true,
    iconAssetId: 'sword-steel-katana'
  },
  {
    id: 'master-stance',
    name: 'Master Stance',
    category: 'click',
    description: 'Flawless posture that multiplies the force of each strike.',
    baseCost: 15000,
    growthRate: 1.18,
    baseIncome: 150,
    isClickUpgrade: true,
    iconAssetId: 'emblem-flaming-sword'
  },
  {
    id: 'crimson-slash',
    name: 'Crimson Slash',
    category: 'click',
    description: 'Channels warrior spirit into a whirlwind of coin-yielding strikes.',
    baseCost: 200000,
    growthRate: 1.20,
    baseIncome: 1200,
    isClickUpgrade: true,
    iconAssetId: 'sword-cursed-muramasa'
  },
  {
    id: 'dragon-fang-strike',
    name: 'Dragon Fang Strike',
    category: 'click',
    description: 'Legendary sword technique echoing the wrath of ancient dragons.',
    baseCost: 5000000,
    growthRate: 1.22,
    baseIncome: 15000,
    isClickUpgrade: true,
    iconAssetId: 'emblem-dragon'
  },

  // --- Category: Workers (Passive Income) ---
  {
    id: 'village-trader',
    name: 'Village Trader',
    category: 'workers',
    description: 'A humble local merchant exchanging goods for steady daily coin.',
    baseCost: 50,
    growthRate: 1.15,
    baseIncome: 1,
    iconAssetId: 'building-small-shop'
  },
  {
    id: 'rice-merchant',
    name: 'Rice Merchant',
    category: 'workers',
    description: 'Manages staple grain trade routes across neighboring hamlets.',
    baseCost: 350,
    growthRate: 1.16,
    baseIncome: 6,
    iconAssetId: 'wealth-100-coin'
  },
  {
    id: 'blacksmith-artisan',
    name: 'Blacksmith',
    category: 'workers',
    description: 'Forges ironware and tools that sell at high premium in the market.',
    baseCost: 2400,
    growthRate: 1.16,
    baseIncome: 32,
    iconAssetId: 'building-blacksmith'
  },
  {
    id: 'gold-prospector',
    name: 'Gold Prospector',
    category: 'workers',
    description: 'Scours mountain streams and veins for precious golden nuggets.',
    baseCost: 18000,
    growthRate: 1.17,
    baseIncome: 200,
    iconAssetId: 'building-mine'
  },
  {
    id: 'clan-scribe',
    name: 'Clan Scribe',
    category: 'workers',
    description: 'Manages contracts, deeds, and ledger fees across the territory.',
    baseCost: 120000,
    growthRate: 1.18,
    baseIncome: 1100,
    iconAssetId: 'secret-mysterious-scroll'
  },
  {
    id: 'shadow-ninja',
    name: 'Shadow Ninja',
    category: 'workers',
    description: 'Infiltrates enemy trade convoys, securing covert tribute.',
    baseCost: 1000000,
    growthRate: 1.19,
    baseIncome: 7500,
    iconAssetId: 'samurai-shadow'
  },

  // --- Category: Buildings (High Passive) ---
  {
    id: 'small-stall',
    name: 'Merchant Stall',
    category: 'buildings',
    description: 'A permanent roadside shop catering to passing caravans.',
    baseCost: 800,
    growthRate: 1.15,
    baseIncome: 15,
    iconAssetId: 'building-small-shop'
  },
  {
    id: 'stone-forge',
    name: 'Master Forge',
    category: 'buildings',
    description: 'Heavy stonework furnace producing fine arms and armor for regional clans.',
    baseCost: 8500,
    growthRate: 1.16,
    baseIncome: 110,
    iconAssetId: 'building-blacksmith'
  },
  {
    id: 'gold-mine',
    name: 'Mountain Gold Mine',
    category: 'buildings',
    description: 'Deep subterranean shafts extracting raw gold ore continuously.',
    baseCost: 75000,
    growthRate: 1.17,
    baseIncome: 850,
    iconAssetId: 'building-mine'
  },
  {
    id: 'clan-treasury',
    name: 'Clan Treasury',
    category: 'buildings',
    description: 'Heavy stone vault guarding and investing provincial tax reserves.',
    baseCost: 650000,
    growthRate: 1.18,
    baseIncome: 6500,
    iconAssetId: 'building-treasury'
  },
  {
    id: 'castle-treasury',
    name: 'Castle Stronghold',
    category: 'buildings',
    description: 'Colossal mountain citadel generating massive tribute and prestige.',
    baseCost: 8000000,
    growthRate: 1.20,
    baseIncome: 60000,
    iconAssetId: 'building-fortress'
  },

  // --- Category: Samurai Training (Martial Discipline & Combat Focus) ---
  {
    id: 'kata-mastery',
    name: 'Kata Form Drills',
    category: 'training',
    description: 'Disciplined repetitive cutting postures that hone manual katana strike power (+8% Click / lvl).',
    baseCost: 1500,
    growthRate: 1.52,
    baseIncome: 0,
    multiplier: 1.08,
    multiplierType: 'click',
    isClickUpgrade: true,
    iconAssetId: 'samurai-standing'
  },
  {
    id: 'ki-meditation',
    name: 'Zen Ki Breathing',
    category: 'training',
    description: 'Harmonizes spirit energy and blood flow, boosting all automated empire revenue (+10% Passive / lvl).',
    baseCost: 20000,
    growthRate: 1.56,
    baseIncome: 0,
    multiplier: 1.10,
    multiplierType: 'passive',
    iconAssetId: 'samurai-meditation'
  },
  {
    id: 'iaijutsu-focus',
    name: 'Iaijutsu Quickdraw',
    category: 'training',
    description: 'Lightning-fast unsheathing technique that strikes with devastating force (+12% Click / lvl).',
    baseCost: 250000,
    growthRate: 1.62,
    baseIncome: 0,
    multiplier: 1.12,
    multiplierType: 'click',
    isClickUpgrade: true,
    iconAssetId: 'sword-steel-katana'
  },
  {
    id: 'bushido-code',
    name: 'Bushido Warrior Code',
    category: 'training',
    description: 'Unwavering honor code and samurai conviction that amplifies total clan wealth (+15% Global / lvl).',
    baseCost: 3500000,
    growthRate: 1.68,
    baseIncome: 0,
    multiplier: 1.15,
    multiplierType: 'global',
    iconAssetId: 'emblem-helmet'
  },
  {
    id: 'kendo-mastery',
    name: 'Grandmaster Kendo',
    category: 'training',
    description: 'Supreme blade enlightenment where the sword and soul become one singular force (+20% Click / lvl).',
    baseCost: 60000000,
    growthRate: 1.74,
    baseIncome: 0,
    multiplier: 1.20,
    multiplierType: 'click',
    isClickUpgrade: true,
    iconAssetId: 'emblem-twin-swords'
  },
  {
    id: 'shogun-mandate',
    name: "Shogun's Sovereign Will",
    category: 'training',
    description: 'The supreme martial decree commanding all provincial forces to generate massive tribute (+25% Global / lvl).',
    baseCost: 1500000000,
    growthRate: 1.80,
    baseIncome: 0,
    multiplier: 1.25,
    multiplierType: 'global',
    iconAssetId: 'legendary-shogun'
  },

  // --- Category: Wealth (Feudal Commerce, Banking & Sovereign Treasury) ---
  {
    id: 'silk-coin-pouch',
    name: 'Silk Coin Purse',
    category: 'wealth',
    description: 'Finely reinforced velvet purse protecting coins from wear and trade friction (+6% Global / lvl).',
    baseCost: 8000,
    growthRate: 1.52,
    baseIncome: 0,
    multiplier: 1.06,
    multiplierType: 'global',
    iconAssetId: 'wealth-10k-bag'
  },
  {
    id: 'merchant-guild',
    name: 'Kyoto Merchant Guild',
    category: 'wealth',
    description: 'Regional trading cartel standardizing profit margins across market caravans (+10% Passive / lvl).',
    baseCost: 95000,
    growthRate: 1.58,
    baseIncome: 0,
    multiplier: 1.10,
    multiplierType: 'passive',
    iconAssetId: 'wealth-100k-chest'
  },
  {
    id: 'royal-koban-mint',
    name: 'Royal Koban Mint',
    category: 'wealth',
    description: 'Certified high-purity oval gold coins stamped with the clan crest (+14% Global / lvl).',
    baseCost: 1500000,
    growthRate: 1.64,
    baseIncome: 0,
    multiplier: 1.14,
    multiplierType: 'global',
    iconAssetId: 'wealth-1m-golden-chest'
  },
  {
    id: 'daimyo-tithe',
    name: 'Feudal Daimyo Tithe',
    category: 'wealth',
    description: 'Institutionalized tax collection levied directly upon feudal lords and provincial harvests (+16% Passive / lvl).',
    baseCost: 25000000,
    growthRate: 1.70,
    baseIncome: 0,
    multiplier: 1.16,
    multiplierType: 'passive',
    iconAssetId: 'wealth-1b-vault'
  },
  {
    id: 'imperial-monopoly',
    name: 'Imperial Trade Monopoly',
    category: 'wealth',
    description: 'Exclusive royal charter granting total control over essential national commodity trade (+22% Global / lvl).',
    baseCost: 400000000,
    growthRate: 1.76,
    baseIncome: 0,
    multiplier: 1.22,
    multiplierType: 'global',
    iconAssetId: 'wealth-1t-giant-vault'
  },
  {
    id: 'sovereign-vault',
    name: 'Celestial Dragon Vault',
    category: 'wealth',
    description: 'Colossal subterranean obsidian vault safeguarding infinite national bullion (+30% Global / lvl).',
    baseCost: 8000000000,
    growthRate: 1.82,
    baseIncome: 0,
    multiplier: 1.30,
    multiplierType: 'global',
    iconAssetId: 'wealth-1sx-fortune-throne'
  },

  // --- Category: Empire (Late-Game Mega Scale) ---
  {
    id: 'feudal-province',
    name: 'Feudal Province',
    category: 'empire',
    description: 'An entire fertile province dedicated to enriching the samurai clan.',
    baseCost: 50000000,
    growthRate: 1.20,
    baseIncome: 450000,
    iconAssetId: 'region-village'
  },
  {
    id: 'trade-fleet',
    name: 'Imperial Trade Fleet',
    category: 'empire',
    description: 'Armadas of armed galleons dominating coastal merchant lanes.',
    baseCost: 800000000,
    growthRate: 1.22,
    baseIncome: 6500000,
    iconAssetId: 'landmark-torii-portal'
  },
  {
    id: 'imperial-mint',
    name: 'Imperial Mint',
    category: 'empire',
    description: 'Produces national currency backed by immense gold reserves.',
    baseCost: 15000000000,
    growthRate: 1.24,
    baseIncome: 95000000,
    iconAssetId: 'wealth-1qa-treasure-mountain'
  },
  {
    id: 'dynasty-treasury',
    name: 'Dynasty Treasury',
    category: 'empire',
    description: 'Endless labyrinth of gold corridors and priceless relics.',
    baseCost: 350000000000,
    growthRate: 1.25,
    baseIncome: 1800000000,
    iconAssetId: 'wealth-1qi-golden-palace'
  },
  {
    id: 'celestial-empire',
    name: 'Celestial Domain',
    category: 'empire',
    description: 'Mythical sovereign realm where gold rains from crimson skies.',
    baseCost: 10000000000000,
    growthRate: 1.28,
    baseIncome: 45000000000,
    iconAssetId: 'wealth-1sx-fortune-throne'
  }
];
