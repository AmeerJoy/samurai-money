// Master Asset Catalog & Helper Functions for Samurai Money

export interface AssetMeta {
  id: string;
  name: string;
  category: string;
  rarity: string;
  url: string;
  description: string;
}

export const ASSET_MAP: Record<string, AssetMeta> = {
  // Brand
  'hero-samurai': {
    id: 'hero-samurai',
    name: 'Hero Samurai Poster',
    category: 'Brand',
    rarity: 'Legendary',
    url: '/assets/brand/hero-samurai.webp',
    description: 'Lone samurai warrior standing on dark mountain peak with sharp crimson highlights.'
  },
  'social-preview': {
    id: 'social-preview',
    name: 'Social Preview Banner',
    category: 'Brand',
    rarity: 'Epic',
    url: '/assets/brand/social-preview.webp',
    description: 'Wide panoramic crimson sunrise landscape with samurai and fortress silhouettes.'
  },
  'logo': {
    id: 'logo',
    name: 'Samurai Money Logo',
    category: 'Brand',
    rarity: 'Common',
    url: '/assets/brand/logo.svg',
    description: 'Primary game brand logo'
  },
  'logo-mark': {
    id: 'logo-mark',
    name: 'Samurai Money Mark',
    category: 'Brand',
    rarity: 'Common',
    url: '/assets/brand/app-icon.webp',
    description: 'Minimalist brand emblem mark'
  },
  'favicon': {
    id: 'favicon',
    name: 'Favicon',
    category: 'Brand',
    rarity: 'Common',
    url: '/assets/brand/favicon.png',
    description: 'Circular brand icon'
  },

  // Characters
  'samurai-idle': {
    id: 'samurai-idle',
    name: 'Samurai Idle',
    category: 'Characters',
    rarity: 'Common',
    url: '/assets/characters/samurai-idle.webp',
    description: 'Primary resting character illustration on main game screen.'
  },
  'samurai-standing': {
    id: 'samurai-standing',
    name: 'Samurai Standing',
    category: 'Characters',
    rarity: 'Common',
    url: '/assets/characters/samurai-standing.webp',
    description: 'Active hero portrait on dashboard and profile screens.'
  },
  'samurai-sword': {
    id: 'samurai-sword',
    name: 'Samurai Sword Draw',
    category: 'Characters',
    rarity: 'Rare',
    url: '/assets/characters/samurai-sword.webp',
    description: 'Drawing razor katana from sheath with crimson blade streak.'
  },
  'samurai-battle': {
    id: 'samurai-battle',
    name: 'Samurai Battle',
    category: 'Characters',
    rarity: 'Epic',
    url: '/assets/characters/samurai-battle.webp',
    description: 'Dynamic mid-air leaping slash forming dramatic cross-silhouette.'
  },
  'samurai-victory': {
    id: 'samurai-victory',
    name: 'Samurai Victory',
    category: 'Characters',
    rarity: 'Epic',
    url: '/assets/characters/samurai-victory.webp',
    description: 'Samurai standing victorious atop rock ledge sheathing katana.'
  },
  'samurai-meditation': {
    id: 'samurai-meditation',
    name: 'Samurai Meditation',
    category: 'Characters',
    rarity: 'Rare',
    url: '/assets/characters/samurai-meditation.webp',
    description: 'Samurai in meditative lotus posture under floating crimson spirit halo.'
  },
  'samurai-rich': {
    id: 'samurai-rich',
    name: 'Samurai Daimyo Rich',
    category: 'Characters',
    rarity: 'Epic',
    url: '/assets/characters/samurai-rich.webp',
    description: 'Daimyo lord seated on ornate lacquer dais holding gold fan.'
  },
  'samurai-powerful': {
    id: 'samurai-powerful',
    name: 'Samurai Warlord',
    category: 'Characters',
    rarity: 'Legendary',
    url: '/assets/characters/samurai-powerful.webp',
    description: 'Demonic horned kabuto warlord holding two-handed nodachi greatsword.'
  },
  'samurai-legendary': {
    id: 'samurai-legendary',
    name: 'Legendary Shogun',
    category: 'Characters',
    rarity: 'Legendary',
    url: '/assets/characters/samurai-legendary.webp',
    description: 'Floating mythic shogun with floating red spirit orbs and solar flare halo.'
  },
  'samurai-shadow': {
    id: 'samurai-shadow',
    name: 'Shadow Shinobi',
    category: 'Characters',
    rarity: 'Rare',
    url: '/assets/characters/samurai-shadow.webp',
    description: 'Agile shinobi crouched on curved pagoda roof under full blood moon.'
  },

  // Wealth Achievements
  'wealth-100-coin': {
    id: 'wealth-100-coin',
    name: 'Copper Sen Coin',
    category: 'Wealth',
    rarity: 'Common',
    url: '/assets/achievements/wealth/wealth-100-coin.webp',
    description: 'Ancient dark copper/iron sen coin with square hole and crimson ring.'
  },
  'wealth-1k-stack': {
    id: 'wealth-1k-stack',
    name: 'Gold Koban Stack',
    category: 'Wealth',
    rarity: 'Common',
    url: '/assets/achievements/wealth/wealth-1k-stack.webp',
    description: 'Neat stack of three oval gold koban coins tied in crisp crimson silk ribbon.'
  },
  'wealth-10k-bag': {
    id: 'wealth-10k-bag',
    name: 'Silk Money Bag',
    category: 'Wealth',
    rarity: 'Rare',
    url: '/assets/achievements/wealth/wealth-10k-bag.webp',
    description: 'Dark silk money pouch overflowing with gold coins.'
  },
  'wealth-100k-chest': {
    id: 'wealth-100k-chest',
    name: 'Cedar Treasure Chest',
    category: 'Wealth',
    rarity: 'Rare',
    url: '/assets/achievements/wealth/wealth-100k-chest.webp',
    description: 'Reinforced cedar wood treasure coffer with brass brackets.'
  },
  'wealth-1m-golden-chest': {
    id: 'wealth-1m-golden-chest',
    name: 'Solid Gold Coffer',
    category: 'Wealth',
    rarity: 'Epic',
    url: '/assets/achievements/wealth/wealth-1m-golden-chest.webp',
    description: 'Solid gold and black lacquer chest with rubies and kobans.'
  },
  'wealth-1b-vault': {
    id: 'wealth-1b-vault',
    name: 'Obsidian Vault',
    category: 'Wealth',
    rarity: 'Epic',
    url: '/assets/achievements/wealth/wealth-1b-vault.webp',
    description: 'Heavy obsidian stone vault door with glowing crimson core.'
  },
  'wealth-1t-giant-vault': {
    id: 'wealth-1t-giant-vault',
    name: 'Fortress Vault Gate',
    category: 'Wealth',
    rarity: 'Legendary',
    url: '/assets/achievements/wealth/wealth-1t-giant-vault.webp',
    description: 'Colossal fortress vault gate with massive dragon padlock.'
  },
  'wealth-1qa-treasure-mountain': {
    id: 'wealth-1qa-treasure-mountain',
    name: 'Mountain of Fortune',
    category: 'Wealth',
    rarity: 'Legendary',
    url: '/assets/achievements/wealth/wealth-1qa-treasure-mountain.webp',
    description: 'Towering mountain peak composed entirely of gold kobans.'
  },
  'wealth-1qi-golden-palace': {
    id: 'wealth-1qi-golden-palace',
    name: 'Imperial Golden Palace',
    category: 'Wealth',
    rarity: 'Mythic',
    url: '/assets/achievements/wealth/wealth-1qi-golden-palace.webp',
    description: 'Monumental multi-tier imperial palace of pure gold trim.'
  },
  'wealth-1sx-fortune-throne': {
    id: 'wealth-1sx-fortune-throne',
    name: 'Cosmic Fortune Throne',
    category: 'Wealth',
    rarity: 'Mythic',
    url: '/assets/achievements/wealth/wealth-1sx-fortune-throne.webp',
    description: 'Astral obsidian and ruby throne surrounded by orbiting gold medallions.'
  },

  // Emblems
  'emblem-helmet': {
    id: 'emblem-helmet',
    name: 'Kabuto Emblem',
    category: 'Emblems',
    rarity: 'Common',
    url: '/assets/achievements/emblems/emblem-helmet.webp',
    description: 'Horned samurai kabuto helmet in pure black silhouette.'
  },
  'emblem-mask': {
    id: 'emblem-mask',
    name: 'Mempo Mask Emblem',
    category: 'Emblems',
    rarity: 'Common',
    url: '/assets/achievements/emblems/emblem-mask.webp',
    description: 'Fierce samurai facial mempo mask silhouette with sharp crimson fangs.'
  },
  'emblem-sword': {
    id: 'emblem-sword',
    name: 'Katana Blade Emblem',
    category: 'Emblems',
    rarity: 'Common',
    url: '/assets/achievements/emblems/emblem-sword.webp',
    description: 'Vertical curved katana sword silhouette with razor crimson edge.'
  },
  'emblem-twin-swords': {
    id: 'emblem-twin-swords',
    name: 'Dual Blades Emblem',
    category: 'Emblems',
    rarity: 'Rare',
    url: '/assets/achievements/emblems/emblem-twin-swords.webp',
    description: 'Two crossed black katanas forming an X-silhouette over red sun.'
  },
  'emblem-flaming-sword': {
    id: 'emblem-flaming-sword',
    name: 'Spirit Flame Blade',
    category: 'Emblems',
    rarity: 'Epic',
    url: '/assets/achievements/emblems/emblem-flaming-sword.webp',
    description: 'Katana blade engulfed in stylized geometric crimson spirit flame aura.'
  },
  'emblem-battle-flag': {
    id: 'emblem-battle-flag',
    name: 'Sashimono Banner',
    category: 'Emblems',
    rarity: 'Rare',
    url: '/assets/achievements/emblems/emblem-battle-flag.webp',
    description: 'Samurai sashimono battle banner silhouette with rising sun crest.'
  },
  'emblem-crown': {
    id: 'emblem-crown',
    name: 'Sovereign Crown',
    category: 'Emblems',
    rarity: 'Epic',
    url: '/assets/achievements/emblems/emblem-crown.webp',
    description: 'Ornate gold and obsidian sovereign crown with crimson ruby crest.'
  },
  'emblem-dragon': {
    id: 'emblem-dragon',
    name: 'Dragon Crest',
    category: 'Emblems',
    rarity: 'Legendary',
    url: '/assets/achievements/emblems/emblem-dragon.webp',
    description: 'Roaring dragon head silhouette with glowing red eyes.'
  },

  // Legendary Achievements
  'legendary-shogun': {
    id: 'legendary-shogun',
    name: 'Shogun Ascendance',
    category: 'Legendary',
    rarity: 'Legendary',
    url: '/assets/achievements/legendary/legendary-shogun.webp',
    description: 'Giant black samurai silhouette seated on dark throne under red sun.'
  },
  'legendary-conqueror': {
    id: 'legendary-conqueror',
    name: 'Realm Conqueror',
    category: 'Legendary',
    rarity: 'Legendary',
    url: '/assets/achievements/legendary/legendary-conqueror.webp',
    description: 'Black samurai standing on mountain overlooking vast conquered battlefield.'
  },
  'legendary-fortune': {
    id: 'legendary-fortune',
    name: 'Infinite Fortune',
    category: 'Legendary',
    rarity: 'Legendary',
    url: '/assets/achievements/legendary/legendary-fortune.webp',
    description: 'Samurai standing before immense treasure vault spilling crimson light.'
  },
  'legendary-immortal': {
    id: 'legendary-immortal',
    name: 'Immortal Warrior',
    category: 'Legendary',
    rarity: 'Mythic',
    url: '/assets/achievements/legendary/legendary-immortal.webp',
    description: 'Lone samurai standing beneath colossal crimson moon surrounded by peaks.'
  },
  'legendary-empire': {
    id: 'legendary-empire',
    name: 'Empire Supreme',
    category: 'Legendary',
    rarity: 'Mythic',
    url: '/assets/achievements/legendary/legendary-empire.webp',
    description: 'Massive dark fortress sprawling over mountain range with crimson banners.'
  },
  'legendary-beyond-fortune': {
    id: 'legendary-beyond-fortune',
    name: 'Beyond Fortune',
    category: 'Legendary',
    rarity: 'Mythic',
    url: '/assets/achievements/legendary/legendary-beyond-fortune.webp',
    description: 'Mysterious samurai standing before abstract crimson cosmic portal.'
  },

  // Secret Achievements
  'secret-mask': {
    id: 'secret-mask',
    name: 'The Hidden Face',
    category: 'Secret',
    rarity: 'Secret',
    url: '/assets/achievements/secret/secret-mask.webp',
    description: 'Dark horned mask silhouette emerging from black mist.'
  },
  'secret-forbidden-gate': {
    id: 'secret-forbidden-gate',
    name: 'Chained Torii Gate',
    category: 'Secret',
    rarity: 'Secret',
    url: '/assets/achievements/secret/secret-forbidden-gate.webp',
    description: 'Ancient weathered torii gate wrapped in dark chains under a blood eclipse.'
  },
  'secret-mysterious-scroll': {
    id: 'secret-mysterious-scroll',
    name: 'Forbidden Scroll',
    category: 'Secret',
    rarity: 'Secret',
    url: '/assets/achievements/secret/secret-mysterious-scroll.webp',
    description: 'Dark scroll unrolling with floating glowing red abstract runes.'
  },
  'secret-dark-temple': {
    id: 'secret-dark-temple',
    name: 'Shadow Temple',
    category: 'Secret',
    rarity: 'Secret',
    url: '/assets/achievements/secret/secret-dark-temple.webp',
    description: 'Cliffside pagoda temple shrouded in deep black fog.'
  },

  // World Regions
  'region-beginning': {
    id: 'region-beginning',
    name: 'Samurai Village',
    category: 'World',
    rarity: 'Common',
    url: '/assets/world/regions/region-beginning.webp',
    description: 'Dark mountainous landscape with lone crimson sun and small samurai silhouette.'
  },
  'region-dojo': {
    id: 'region-dojo',
    name: 'Bamboo Valley & Dojo',
    category: 'World',
    rarity: 'Common',
    url: '/assets/world/regions/region-dojo.webp',
    description: 'Traditional martial dojo pavilion with training courtyards and crimson banners.'
  },
  'region-village': {
    id: 'region-village',
    name: 'Mountain Province',
    category: 'World',
    rarity: 'Rare',
    url: '/assets/world/regions/region-village.webp',
    description: 'Stylized dark merchant village rooftops with small red lights and mountain backdrop.'
  },
  'region-fortress': {
    id: 'region-fortress',
    name: 'Golden Capital',
    category: 'World',
    rarity: 'Epic',
    url: '/assets/world/regions/region-fortress.webp',
    description: 'Massive multi-tiered fortress on mountain peak with crimson war banners.'
  },
  'region-golden-empire': {
    id: 'region-golden-empire',
    name: 'Imperial Fortress',
    category: 'World',
    rarity: 'Legendary',
    url: '/assets/world/regions/region-golden-empire.webp',
    description: 'Enormous palace spires with gold roof trims under a colossal blazing red sun.'
  },
  'region-forbidden': {
    id: 'region-forbidden',
    name: 'Legendary Realm',
    category: 'World',
    rarity: 'Mythic',
    url: '/assets/world/regions/region-forbidden.webp',
    description: 'Mysterious floating landmasses with ancient torii gates under a giant crimson eclipse.'
  },

  // World Landmarks
  'landmark-fuji-sun': {
    id: 'landmark-fuji-sun',
    name: 'Mount Fuji Apex',
    category: 'Landmarks',
    rarity: 'Epic',
    url: '/assets/world/landmarks/landmark-fuji-sun.webp',
    description: 'Iconic snow-capped Mount Fuji silhouette centered in giant solid crimson sun.'
  },
  'landmark-torii-portal': {
    id: 'landmark-torii-portal',
    name: 'Grand Torii Gateway',
    category: 'Landmarks',
    rarity: 'Rare',
    url: '/assets/world/landmarks/landmark-torii-portal.webp',
    description: 'Massive torii gate standing in still water reflecting a giant red sun.'
  },
  'landmark-sword-mountain': {
    id: 'landmark-sword-mountain',
    name: 'Blade of the Ancients',
    category: 'Landmarks',
    rarity: 'Legendary',
    url: '/assets/world/landmarks/landmark-sword-mountain.webp',
    description: 'Giant ancient katana driven into mountain peak cutting across a crimson moon.'
  },

  // Buildings
  'building-small-shop': {
    id: 'building-small-shop',
    name: 'Small Stall',
    category: 'Buildings',
    rarity: 'Common',
    url: '/assets/buildings/building-small-shop.webp',
    description: 'Humble wooden merchant shop stall with red hanging lantern.'
  },
  'building-blacksmith': {
    id: 'building-blacksmith',
    name: 'Blacksmith Forge',
    category: 'Buildings',
    rarity: 'Rare',
    url: '/assets/buildings/building-blacksmith.webp',
    description: 'Dark sword smithy forge silhouette glowing with crimson embers.'
  },
  'building-mine': {
    id: 'building-mine',
    name: 'Gold Mine',
    category: 'Buildings',
    rarity: 'Rare',
    url: '/assets/buildings/building-mine.webp',
    description: 'Dark mountain mine entrance with wooden timber supports and gold ore carts.'
  },
  'building-treasury': {
    id: 'building-treasury',
    name: 'Clan Treasury',
    category: 'Buildings',
    rarity: 'Epic',
    url: '/assets/buildings/building-treasury.webp',
    description: 'Fortified stone treasury storehouse with heavy iron door and red banners.'
  },
  'building-fortress': {
    id: 'building-fortress',
    name: 'Castle Treasury',
    category: 'Buildings',
    rarity: 'Legendary',
    url: '/assets/buildings/building-fortress.webp',
    description: 'Towering multi-story samurai fortress castle on stone foundation.'
  },

  // Items & Equipment
  'sword-steel-katana': {
    id: 'sword-steel-katana',
    name: 'Steel Katana',
    category: 'Weapons',
    rarity: 'Common',
    url: '/assets/items/swords/sword-steel-katana.webp',
    description: 'Curved katana blade with razor crimson cutting edge over red sun.'
  },
  'sword-twin-tanto': {
    id: 'sword-twin-tanto',
    name: 'Twin Tanto',
    category: 'Weapons',
    rarity: 'Rare',
    url: '/assets/items/swords/sword-twin-tanto.webp',
    description: 'Crossed tanto daggers silhouette with crimson cord wrap.'
  },
  'sword-dragon-naginata': {
    id: 'sword-dragon-naginata',
    name: 'Dragon Naginata',
    category: 'Weapons',
    rarity: 'Epic',
    url: '/assets/items/swords/sword-dragon-naginata.webp',
    description: 'Graceful naginata spear silhouette with flowing red silk tassel.'
  },
  'sword-shadow-shuriken': {
    id: 'sword-shadow-shuriken',
    name: 'Shadow Shuriken',
    category: 'Weapons',
    rarity: 'Rare',
    url: '/assets/items/swords/sword-shadow-shuriken.webp',
    description: 'Sharp 4-point black ninja throwing star with razor crimson beveled edges.'
  },
  'sword-cursed-muramasa': {
    id: 'sword-cursed-muramasa',
    name: 'Cursed Muramasa',
    category: 'Weapons',
    rarity: 'Legendary',
    url: '/assets/items/swords/sword-cursed-muramasa.webp',
    description: 'Cursed black katana blade surrounded by crimson soul energy aura.'
  },
  'armor-demon-kabuto': {
    id: 'armor-demon-kabuto',
    name: 'Demon Kabuto',
    category: 'Armor',
    rarity: 'Epic',
    url: '/assets/items/armor/armor-demon-kabuto.webp',
    description: 'Menacing horned kabuto helmet silhouette with red eye visor.'
  },
  'treasure-dragon-vault': {
    id: 'treasure-dragon-vault',
    name: 'Dragon Vault',
    category: 'Treasures',
    rarity: 'Epic',
    url: '/assets/items/treasures/treasure-dragon-vault.webp',
    description: 'Black lacquer chest with red dragon crests overflowing with gold kobans.'
  },

  // Backgrounds
  'bg-main': {
    id: 'bg-main',
    name: 'Main Background',
    category: 'Backgrounds',
    rarity: 'Common',
    url: '/assets/backgrounds/bg-main.webp',
    description: 'Near-black minimalist landscape with subtle crimson mist and mountain horizon.'
  },
  'bg-achievements': {
    id: 'bg-achievements',
    name: 'Achievement Background',
    category: 'Backgrounds',
    rarity: 'Common',
    url: '/assets/backgrounds/bg-achievements.webp',
    description: 'Ultra-dark minimalist background with subtle geometric grid lines.'
  },

  // Loading & Notifications
  'loading-samurai': {
    id: 'loading-samurai',
    name: 'Loading Samurai',
    category: 'Loading',
    rarity: 'Common',
    url: '/assets/loading/loading-samurai.webp',
    description: 'Centered pure black silhouette of samurai in stance on dark rock.'
  },
  'notification-achievement-unlocked': {
    id: 'notification-achievement-unlocked',
    name: 'Achievement Toast Icon',
    category: 'Notifications',
    rarity: 'Common',
    url: '/assets/notifications/notification-achievement-unlocked.webp',
    description: 'Crimson and gold circular laurel medallion with crossed katana blades.'
  }
};

export function getAssetUrl(id: string): string {
  const asset = ASSET_MAP[id];
  if (asset) return asset.url;
  return '/assets/brand/hero-samurai.webp';
}

export function getAssetMeta(id: string): AssetMeta | undefined {
  return ASSET_MAP[id];
}
