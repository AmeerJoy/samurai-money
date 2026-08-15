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


  // World Regions (Panoramic Banners)
  'region-samurai-village': {
    id: 'region-samurai-village',
    name: 'Samurai Village Banner',
    category: 'World Landmarks',
    rarity: 'Common',
    url: '/assets/world/regions/region-samurai-village.webp',
    description: 'Rustic wooden huts, bamboo groves, and training courtyard beneath Mount Fuji.'
  },
  'region-bamboo-valley': {
    id: 'region-bamboo-valley',
    name: 'Bamboo Valley & Dojo Banner',
    category: 'World Landmarks',
    rarity: 'Rare',
    url: '/assets/world/regions/region-bamboo-valley.webp',
    description: 'Dense bamboo forest framing martial pavilion with glowing red lanterns.'
  },
  'region-mountain-province': {
    id: 'region-mountain-province',
    name: 'Mountain Province Banner',
    category: 'World Landmarks',
    rarity: 'Rare',
    url: '/assets/world/regions/region-mountain-province.webp',
    description: 'Snow-dusted mountain peaks with iron forges, gold mines, and crimson sun.'
  },
  'region-golden-capital': {
    id: 'region-golden-capital',
    name: 'Golden Capital Banner',
    category: 'World Landmarks',
    rarity: 'Epic',
    url: '/assets/world/regions/region-golden-capital.webp',
    description: 'Feudal Japanese imperial city skyline with multi-tier pagoda palaces.'
  },
  'region-imperial-fortress': {
    id: 'region-imperial-fortress',
    name: 'Imperial Fortress Banner',
    category: 'World Landmarks',
    rarity: 'Legendary',
    url: '/assets/world/regions/region-imperial-fortress.webp',
    description: 'Colossal Shogun fortress castle with waving battle flags and dragon towers.'
  },
  'region-legendary-realm': {
    id: 'region-legendary-realm',
    name: 'Legendary Realm Banner',
    category: 'World Landmarks',
    rarity: 'Mythic',
    url: '/assets/world/regions/region-legendary-realm.webp',
    description: 'Floating celestial stone islands and shrines under an eternal solar eclipse.'
  },

  // World Landmarks (Icons)
  'landmark-fuji-horizon': {
    id: 'landmark-fuji-horizon',
    name: 'Mount Fuji Horizon',
    category: 'World Landmarks',
    rarity: 'Common',
    url: '/assets/world/landmarks/landmark-fuji-horizon.webp',
    description: 'Sacred Mount Fuji peak silhouette centered inside a giant flat red sun disc.'
  },
  'landmark-grand-torii': {
    id: 'landmark-grand-torii',
    name: 'Grand Torii Portal',
    category: 'World Landmarks',
    rarity: 'Rare',
    url: '/assets/world/landmarks/landmark-grand-torii.webp',
    description: 'Colossal Torii gate gateway silhouette centered inside a bright red circular sun.'
  },
  'landmark-blade-ancients': {
    id: 'landmark-blade-ancients',
    name: 'Blade of the Ancients',
    category: 'World Landmarks',
    rarity: 'Rare',
    url: '/assets/world/landmarks/landmark-blade-ancients.webp',
    description: 'Giant ancient katana driven into mountain summit beneath a crimson solar disc.'
  },
  'landmark-imperial-sun-crest': {
    id: 'landmark-imperial-sun-crest',
    name: 'Imperial Sun Crest',
    category: 'World Landmarks',
    rarity: 'Epic',
    url: '/assets/world/landmarks/landmark-imperial-sun-crest.webp',
    description: 'Symmetrical imperial clan sun crest medallion inside a flat red circular sun.'
  },
  'landmark-dynasty-gate': {
    id: 'landmark-dynasty-gate',
    name: 'Dynasty Gate of Honor',
    category: 'World Landmarks',
    rarity: 'Legendary',
    url: '/assets/world/landmarks/landmark-dynasty-gate.webp',
    description: 'Fortified castle gate archway with curved eaves inside a bright red sun disc.'
  },
  'landmark-eclipse-monolith': {
    id: 'landmark-eclipse-monolith',
    name: 'Celestial Eclipse Monolith',
    category: 'World Landmarks',
    rarity: 'Mythic',
    url: '/assets/world/landmarks/landmark-eclipse-monolith.webp',
    description: 'Celestial obelisk monolith stone floating in space inside a solar eclipse ring.'
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

  // Shop Weapons
  'sword-steel-katana': {
    id: 'sword-steel-katana',
    name: 'Steel Katana',
    category: 'Weapons',
    rarity: 'Common',
    url: '/assets/items/swords/sword-steel-katana.webp',
    description: 'A finely balanced hand-forged steel katana with a razor crimson edge.'
  },
  'sword-twin-tanto': {
    id: 'sword-twin-tanto',
    name: 'Twin Tanto Daggers',
    category: 'Weapons',
    rarity: 'Rare',
    url: '/assets/items/swords/sword-twin-tanto.webp',
    description: 'Paired daggers for rapid dual-strikes during aggressive click sequences.'
  },
  'sword-dragon-naginata': {
    id: 'sword-dragon-naginata',
    name: 'Dragon Naginata',
    category: 'Weapons',
    rarity: 'Epic',
    url: '/assets/items/swords/sword-dragon-naginata.webp',
    description: 'Sweeping polearm weapon adorned with royal crimson silk cords.'
  },
  'sword-shadow-shuriken': {
    id: 'sword-shadow-shuriken',
    name: 'Shadow Shuriken',
    category: 'Weapons',
    rarity: 'Rare',
    url: '/assets/items/swords/sword-shadow-shuriken.webp',
    description: 'Aerodynamic obsidian throwing blades utilized by high-ranking shinobi.'
  },
  'sword-cursed-muramasa': {
    id: 'sword-cursed-muramasa',
    name: 'Cursed Muramasa',
    category: 'Weapons',
    rarity: 'Legendary',
    url: '/assets/items/swords/sword-cursed-muramasa.webp',
    description: 'A blood-tempered demonic katana radiating an unearthly crimson aura of supreme fortune.'
  },

  // Shop Armor
  'armor-samurai-helmet': {
    id: 'armor-samurai-helmet',
    name: 'Kabuto War Helmet',
    category: 'Armor',
    rarity: 'Common',
    url: '/assets/items/armor/armor-samurai-helmet.webp',
    description: 'Riveted iron helmet bearing the crest of a rising sun.'
  },
  'armor-demon-kabuto': {
    id: 'armor-demon-kabuto',
    name: 'Demon Kabuto',
    category: 'Armor',
    rarity: 'Epic',
    url: '/assets/items/armor/armor-demon-kabuto.webp',
    description: 'Terrifying horned warlord helmet with crimson visor that strikes awe into all traders.'
  },
  'armor-sovereign-crown': {
    id: 'armor-sovereign-crown',
    name: 'Sovereign Shogun Crown',
    category: 'Armor',
    rarity: 'Legendary',
    url: '/assets/items/armor/armor-sovereign-crown.webp',
    description: 'Imperial obsidian and ruby crown worn only by the supreme ruler of all provinces.'
  },

  // Shop Treasures
  'treasure-koban-pouch': {
    id: 'treasure-koban-pouch',
    name: 'Silk Koban Pouch',
    category: 'Treasures',
    rarity: 'Common',
    url: '/assets/items/treasures/treasure-koban-pouch.webp',
    description: 'Handcrafted silk purse filled with shiny golden oval koban coins.'
  },
  'treasure-cedar-chest': {
    id: 'treasure-cedar-chest',
    name: 'Cedar Merchant Chest',
    category: 'Treasures',
    rarity: 'Rare',
    url: '/assets/items/treasures/treasure-cedar-chest.webp',
    description: 'Solid brass-reinforced cedar coffer safeguarding valuable trade contracts.'
  },
  'treasure-gold-coffer': {
    id: 'treasure-gold-coffer',
    name: 'Solid Gold Coffer',
    category: 'Treasures',
    rarity: 'Epic',
    url: '/assets/items/treasures/treasure-gold-coffer.webp',
    description: 'Gilded treasure chest overflowing with antique coins and ruby amulets.'
  },
  'treasure-dragon-vault': {
    id: 'treasure-dragon-vault',
    name: 'Dragon Vault',
    category: 'Treasures',
    rarity: 'Legendary',
    url: '/assets/items/treasures/treasure-dragon-vault.webp',
    description: 'Ancient ceremonial dragon vault holding the legendary wealth of royal dynasties.'
  },
  'treasure-fortune-throne': {
    id: 'treasure-fortune-throne',
    name: 'Cosmic Fortune Throne',
    category: 'Treasures',
    rarity: 'Mythic',
    url: '/assets/items/treasures/treasure-fortune-throne.webp',
    description: 'The supreme celestial throne of fortune, channeling boundless wealth from across the cosmos.'
  },


  // Unified Trading Market Assets (18 Commodities & Relics)
  'trade-rice': {
    id: 'trade-rice',
    name: 'Rice',
    category: 'Trading Market',
    rarity: 'Common',
    url: '/assets/trading/trade-rice.webp',
    description: 'A staple commodity traded throughout the provinces. Stable demand and safe beginner asset.'
  },
  'trade-bamboo': {
    id: 'trade-bamboo',
    name: 'Bamboo',
    category: 'Trading Market',
    rarity: 'Common',
    url: '/assets/trading/trade-bamboo.webp',
    description: 'Versatile material for construction and tools with steady slow growth demand.'
  },
  'trade-salt': {
    id: 'trade-salt',
    name: 'Salt',
    category: 'Trading Market',
    rarity: 'Common',
    url: '/assets/trading/trade-salt.webp',
    description: 'Essential mineral harvested from coastal flats for preserving rations.'
  },
  'trade-tea': {
    id: 'trade-tea',
    name: 'Tea',
    category: 'Trading Market',
    rarity: 'Common',
    url: '/assets/trading/trade-tea.webp',
    description: 'Ceremonial matcha tea moving in rhythmic supply waves across provinces.'
  },
  'trade-cedar': {
    id: 'trade-cedar',
    name: 'Cedar',
    category: 'Trading Market',
    rarity: 'Common',
    url: '/assets/trading/trade-cedar.webp',
    description: 'Fragrant mountain cedar logs prized for castle and shrine construction.'
  },
  'trade-iron': {
    id: 'trade-iron',
    name: 'Iron',
    category: 'Trading Market',
    rarity: 'Rare',
    url: '/assets/trading/trade-iron.webp',
    description: 'Smelted iron ingot bars with cyclical demand tied to province blacksmithing.'
  },
  'trade-silk': {
    id: 'trade-silk',
    name: 'Silk',
    category: 'Trading Market',
    rarity: 'Rare',
    url: '/assets/trading/trade-silk.webp',
    description: 'Luxurious woven silk fabric traded between merchant guilds in wave cycles.'
  },
  'trade-samurai-steel': {
    id: 'trade-samurai-steel',
    name: 'Samurai Steel',
    category: 'Trading Market',
    rarity: 'Rare',
    url: '/assets/trading/trade-samurai-steel.webp',
    description: 'Folded tamahagane high-carbon steel essential for samurai weaponcraft.'
  },
  'trade-war-horse': {
    id: 'trade-war-horse',
    name: 'War Horse',
    category: 'Trading Market',
    rarity: 'Epic',
    url: '/assets/trading/trade-war-horse.webp',
    description: 'Mighty cavalry war stallions with volatile high-risk market swings.'
  },
  'trade-jade-ornament': {
    id: 'trade-jade-ornament',
    name: 'Jade Ornament',
    category: 'Trading Market',
    rarity: 'Epic',
    url: '/assets/trading/trade-jade-ornament.webp',
    description: 'Carved jade magatama amulet exhibiting boom and correction market runs.'
  },
  'trade-masterwork-armor': {
    id: 'trade-masterwork-armor',
    name: 'Masterwork Armor',
    category: 'Trading Market',
    rarity: 'Epic',
    url: '/assets/trading/trade-masterwork-armor.webp',
    description: 'Intricately laced samurai cuirass armor crafted for daimyo warlords.'
  },
  'trade-imperial-silk': {
    id: 'trade-imperial-silk',
    name: 'Imperial Silk',
    category: 'Trading Market',
    rarity: 'Legendary',
    url: '/assets/trading/trade-imperial-silk.webp',
    description: 'Royal dragon-embroidered golden silk reserved for the imperial court.'
  },
  'trade-ancient-blade': {
    id: 'trade-ancient-blade',
    name: 'Ancient Blade',
    category: 'Trading Market',
    rarity: 'Legendary',
    url: '/assets/trading/trade-ancient-blade.webp',
    description: 'Centuries-old katana of unmatched balance carrying clan fortunes.'
  },
  'trade-dragon-jade': {
    id: 'trade-dragon-jade',
    name: 'Dragon Jade',
    category: 'Trading Market',
    rarity: 'Legendary',
    url: '/assets/trading/trade-dragon-jade.webp',
    description: 'Rare carved dragon jade medallion with explosive rare spike cycles.'
  },
  'trade-shoguns-seal': {
    id: 'trade-shoguns-seal',
    name: 'Shogun\'s Seal',
    category: 'Trading Market',
    rarity: 'Legendary',
    url: '/assets/trading/trade-shoguns-seal.webp',
    description: 'Imperial wax seal stamp granting sovereign authority over province trade.'
  },
  'trade-shogun-seal': {
    id: 'trade-shogun-seal',
    name: 'Shogun\'s Seal',
    category: 'Trading Market',
    rarity: 'Legendary',
    url: '/assets/trading/trade-shoguns-seal.webp',
    description: 'Imperial wax seal stamp granting sovereign authority over province trade.'
  },
  'trade-legendary-sword-core': {
    id: 'trade-legendary-sword-core',
    name: 'Legendary Sword Core',
    category: 'Trading Market',
    rarity: 'Mythic',
    url: '/assets/trading/trade-legendary-sword-core.webp',
    description: 'Pulsing tamahagane crystal core pulsing with mythic forging power.'
  },
  'trade-lost-clan-relic': {
    id: 'trade-lost-clan-relic',
    name: 'Lost Clan Relic',
    category: 'Trading Market',
    rarity: 'Mythic',
    url: '/assets/trading/trade-lost-clan-relic.webp',
    description: 'Ancient ancestral amulet from a vanished warrior dynasty.'
  },
  'trade-celestial-blade': {
    id: 'trade-celestial-blade',
    name: 'Celestial Blade',
    category: 'Trading Market',
    rarity: 'Mythic',
    url: '/assets/trading/trade-celestial-blade.webp',
    description: 'The pinnacle of swordsmithing, channeling cosmic starlight.'
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
