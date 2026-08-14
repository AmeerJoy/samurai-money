import { ShopItemDefinition } from '../types';

export const SHOP_ITEMS: ShopItemDefinition[] = [
  // --- Swords & Weapons ---
  {
    id: 'item-steel-katana',
    name: 'Steel Katana',
    category: 'sword',
    rarity: 'Common',
    cost: 1000,
    assetId: 'sword-steel-katana',
    description: 'A finely balanced hand-forged steel katana with a razor crimson edge.',
    effect: '+$5 Flat Money Per Click',
    clickBonus: 5
  },
  {
    id: 'item-twin-tanto',
    name: 'Twin Tanto Daggers',
    category: 'sword',
    rarity: 'Rare',
    cost: 25000,
    assetId: 'sword-twin-tanto',
    description: 'Paired daggers for rapid dual-strikes during aggressive click sequences.',
    effect: '+15% Click Income Multiplier',
    clickMultiplier: 1.15
  },
  {
    id: 'item-dragon-naginata',
    name: 'Dragon Naginata',
    category: 'sword',
    rarity: 'Epic',
    cost: 500000,
    assetId: 'sword-dragon-naginata',
    description: 'Sweeping polearm weapon adorned with royal crimson silk cords.',
    effect: '+30% Click Income Multiplier',
    clickMultiplier: 1.30
  },
  {
    id: 'item-shadow-shuriken',
    name: 'Shadow Shuriken',
    category: 'sword',
    rarity: 'Rare',
    cost: 10000000,
    assetId: 'sword-shadow-shuriken',
    description: 'Aerodynamic obsidian throwing blades utilized by high-ranking shinobi.',
    effect: '+15% Passive Income Multiplier',
    passiveMultiplier: 1.15
  },
  {
    id: 'item-cursed-muramasa',
    name: 'Cursed Muramasa',
    category: 'sword',
    rarity: 'Legendary',
    cost: 1000000000, // $1B
    assetId: 'sword-cursed-muramasa',
    description: 'A blood-tempered demonic katana radiating an unearthly crimson aura of supreme fortune.',
    effect: '+50% Global Money Multiplier (Click & Passive)',
    clickMultiplier: 1.50,
    passiveMultiplier: 1.50
  },

  // --- Armor ---
  {
    id: 'item-samurai-helmet',
    name: 'Kabuto War Helmet',
    category: 'armor',
    rarity: 'Common',
    cost: 50000,
    assetId: 'emblem-helmet',
    description: 'Riveted iron helmet bearing the crest of a rising sun.',
    effect: '+5% Global Income Multiplier',
    passiveMultiplier: 1.05
  },
  {
    id: 'item-demon-kabuto',
    name: 'Demon Kabuto',
    category: 'armor',
    rarity: 'Epic',
    cost: 15000000,
    assetId: 'armor-demon-kabuto',
    description: 'Terrifying horned warlord helmet with crimson visor that strikes awe into all traders.',
    effect: '+25% Global Income Multiplier',
    passiveMultiplier: 1.25
  },
  {
    id: 'item-sovereign-crown',
    name: 'Sovereign Shogun Crown',
    category: 'armor',
    rarity: 'Legendary',
    cost: 5000000000, // $5B
    assetId: 'emblem-crown',
    description: 'Imperial obsidian and ruby crown worn only by the supreme ruler of all provinces.',
    effect: '+75% Global Income Multiplier',
    passiveMultiplier: 1.75
  },

  // --- Treasures ---
  {
    id: 'item-koban-pouch',
    name: 'Silk Koban Pouch',
    category: 'treasure',
    rarity: 'Common',
    cost: 10000,
    assetId: 'wealth-10k-bag',
    description: 'Handcrafted silk purse filled with shiny golden oval koban coins.',
    effect: '+5% Passive Income',
    passiveMultiplier: 1.05
  },
  {
    id: 'item-cedar-chest',
    name: 'Cedar Merchant Chest',
    category: 'treasure',
    rarity: 'Rare',
    cost: 200000,
    assetId: 'wealth-100k-chest',
    description: 'Solid brass-reinforced cedar coffer safeguarding valuable trade contracts.',
    effect: '+10% Passive Income',
    passiveMultiplier: 1.10
  },
  {
    id: 'item-gold-coffer',
    name: 'Solid Gold Coffer',
    category: 'treasure',
    rarity: 'Epic',
    cost: 25000000,
    assetId: 'wealth-1m-golden-chest',
    description: 'Gilded treasure chest overflowing with antique coins and ruby amulets.',
    effect: '+25% Passive Income',
    passiveMultiplier: 1.25
  },
  {
    id: 'item-dragon-vault',
    name: 'Dragon Vault',
    category: 'treasure',
    rarity: 'Legendary',
    cost: 1000000000000, // $1T
    assetId: 'treasure-dragon-vault',
    description: 'Ancient ceremonial dragon vault holding the legendary wealth of royal dynasties.',
    effect: '+100% (2x) Passive Income Boost',
    passiveMultiplier: 2.0
  },
  {
    id: 'item-fortune-throne',
    name: 'Cosmic Fortune Throne',
    category: 'treasure',
    rarity: 'Mythic',
    cost: 100000000000000, // $100T
    assetId: 'wealth-1sx-fortune-throne',
    description: 'The supreme celestial throne of fortune, channeling boundless wealth from across the cosmos.',
    effect: '+200% (3x) Global Income Boost',
    clickMultiplier: 3.0,
    passiveMultiplier: 3.0
  }
];

export function getShopItem(id: string): ShopItemDefinition | undefined {
  return SHOP_ITEMS.find(item => item.id === id);
}
