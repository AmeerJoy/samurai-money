# Samurai Money — Master Asset Manifest & Architecture Guide

## 1. Art Direction & Style Philosophy
Samurai Money strictly adheres to a **2D minimalist graphic illustration & silhouette** aesthetic:
* **Primary Color Palette**:
  * Near-Black: `#07080C`
  * Deep Crimson Red: `#D20A2E`
  * Bright Vermillion Highlight: `#F01835`
  * Muted Antique Gold: `#F59E0B`
* **Visual Constraints**:
  * Large simple geometric shapes with razor-sharp vector contours.
  * Strong negative space and circular crimson solar halos.
  * **Strictly Prohibited**: Photorealism, 3D CGI rendering, anime faces, watercolor gradients, and Japanese/Chinese text.

## 2. Separation of Concerns
* **AI Generates the Identity**: Characters, Wealth Milestone Art, Achievement Emblems, Legendary Posters, World Regions, Landmarks, and Buildings.
* **Code Generates the Interface**: UI Buttons, Nodes, Health & Progress Bars, Graph Connections, Tooltips, Map Geometry, and Particle Systems.
* **SVGs for Brand & Utilities**: Clean vector logos and navigation icons.

---

## 3. Master Asset Directory & Usage Catalog (65 Assets)

| Category | Filename / ID | Rarity | Purpose / Placement | Visual Description |
| :--- | :--- | :--- | :--- | :--- |
| **Brand** | `brand/hero-samurai.webp` | `Legendary` | Main visual identity artwork for title screens, hero sections, and promotional material. | Lone samurai warrior standing on dark mountain peak in near-black silhouette with sharp crimson highlights, giant solid crimson sun backdrop. |
| **Brand** | `brand/social-preview.webp` | `Epic` | 1200x630 social preview banner and launch hero card. | Wide panoramic crimson sunrise landscape with samurai and fortress silhouettes. |
| **Characters** | `characters/samurai-idle.webp` | `Common` | Primary resting character illustration on main game screen. | Dark near-black samurai silhouette in a relaxed neutral standing stance with restrained crimson sash against solid red sun. |
| **Characters** | `characters/samurai-standing.webp` | `Common` | Active hero portrait on dashboard and profile screens. | Poised confident stance with sheathed katana at waist under blazing red sun. |
| **Characters** | `characters/samurai-sword.webp` | `Rare` | Display during click combos and active blade upgrades. | Drawing razor katana from sheath with crimson blade streak. |
| **Characters** | `characters/samurai-battle.webp` | `Epic` | Display during critical strikes and active boss battles. | Dynamic mid-air leaping slash forming dramatic cross-silhouette. |
| **Characters** | `characters/samurai-victory.webp` | `Epic` | Display on boss defeat, rank upgrade, and milestone unlock. | Samurai standing victorious atop rock ledge sheathing katana into scabbard. |
| **Characters** | `characters/samurai-meditation.webp` | `Rare` | Display on Dojo offline earnings screen and meditation buffs. | Samurai in meditative lotus posture under floating crimson spirit halo. |
| **Characters** | `characters/samurai-rich.webp` | `Epic` | Display on high-wealth tiers and treasury management. | Daimyo lord seated on ornate lacquer dais holding gold fan with treasure coffer. |
| **Characters** | `characters/samurai-powerful.webp` | `Legendary` | Display on Warlord rank progression and heavy weapon upgrades. | Demonic horned kabuto warlord holding two-handed nodachi greatsword. |
| **Characters** | `characters/samurai-legendary.webp` | `Legendary` | Display on Legendary Shogun tier and prestigious completions. | Floating mythic shogun with floating red spirit orbs and solar flare halo. |
| **Characters** | `characters/samurai-shadow.webp` | `Rare` | Display on auto-clicker ninja upgrades and secret map paths. | Agile shinobi crouched on curved pagoda roof under full blood moon. |
| **Wealth Achievements** | `achievements/wealth/wealth-100-coin.webp` | `Common` | Represents the $100 wealth milestone on achievement graph. | Ancient dark copper/iron sen coin with square hole and crimson ring. |
| **Wealth Achievements** | `achievements/wealth/wealth-1k-stack.webp` | `Common` | Represents the $1,000 wealth milestone on achievement graph. | Neat stack of three oval gold koban coins tied in crisp crimson silk ribbon. |
| **Wealth Achievements** | `achievements/wealth/wealth-10k-bag.webp` | `Rare` | Represents the $10,000 wealth milestone on achievement graph. | Dark silk money pouch overflowing with gold coins tied with crimson cord. |
| **Wealth Achievements** | `achievements/wealth/wealth-100k-chest.webp` | `Rare` | Represents the $100,000 wealth milestone on achievement graph. | Reinforced cedar wood treasure coffer with brass corner brackets and gold coins. |
| **Wealth Achievements** | `achievements/wealth/wealth-1m-golden-chest.webp` | `Epic` | Represents the $1,000,000 wealth milestone on achievement graph. | Solid gold and black lacquer treasure chest overflowing with ruby talismans and kobans. |
| **Wealth Achievements** | `achievements/wealth/wealth-1b-vault.webp` | `Epic` | Represents the $1,000,000,000 wealth milestone on achievement graph. | Heavy obsidian stone vault door with glowing crimson core and gold coins. |
| **Wealth Achievements** | `achievements/wealth/wealth-1t-giant-vault.webp` | `Legendary` | Represents the $1,000,000,000,000 wealth milestone on achievement graph. | Colossal fortress vault gate with massive dragon padlock under crimson eclipse. |
| **Wealth Achievements** | `achievements/wealth/wealth-1qa-treasure-mountain.webp` | `Legendary` | Represents the $1 Quadrillion wealth milestone on achievement graph. | Towering mountain peak composed entirely of gold kobans reaching a crimson sun. |
| **Wealth Achievements** | `achievements/wealth/wealth-1qi-golden-palace.webp` | `Mythic` | Represents the $1 Quintillion wealth milestone on achievement graph. | Monumental multi-tier imperial palace of pure gold trim and obsidian towers under blood moon. |
| **Wealth Achievements** | `achievements/wealth/wealth-1sx-fortune-throne.webp` | `Mythic` | Represents the $1 Sextillion+ endgame wealth milestone on achievement graph. | Astral obsidian and ruby throne surrounded by orbiting gold medallions in cosmic red sun. |
| **Emblems** | `achievements/emblems/emblem-helmet.webp` | `Common` | Node badge for armor, defense, and warrior milestones. | Horned samurai kabuto helmet in pure black silhouette inside crimson medallion. |
| **Emblems** | `achievements/emblems/emblem-mask.webp` | `Common` | Node badge for combat intimidation and battle milestones. | Fierce samurai facial mempo mask silhouette with sharp crimson fangs and eyes. |
| **Emblems** | `achievements/emblems/emblem-sword.webp` | `Common` | Node badge for swordsmanship and single-target click power. | Vertical curved katana sword silhouette with razor crimson edge in circular sun. |
| **Emblems** | `achievements/emblems/emblem-twin-swords.webp` | `Rare` | Node badge for dual-wielding and click multiplier milestones. | Two crossed black katanas forming an X-silhouette over solid crimson sun. |
| **Emblems** | `achievements/emblems/emblem-flaming-sword.webp` | `Epic` | Node badge for frenzy click power and critical multiplier milestones. | Katana blade engulfed in stylized geometric crimson spirit flame aura. |
| **Emblems** | `achievements/emblems/emblem-battle-flag.webp` | `Rare` | Node badge for clan prestige, territory, and passive income. | Samurai sashimono battle banner silhouette with rising sun crest. |
| **Emblems** | `achievements/emblems/emblem-crown.webp` | `Epic` | Node badge for sovereignty, leaderboards, and Shogun ranks. | Ornate gold and obsidian sovereign crown with crimson ruby crest. |
| **Emblems** | `achievements/emblems/emblem-dragon.webp` | `Legendary` | Node badge for dragon conquests and mythical achievements. | Roaring dragon head silhouette with glowing red eyes inside red medallion. |
| **Legendary Art** | `achievements/legendary/legendary-shogun.webp` | `Legendary` | Full-size achievement artwork for completing the Shogun ascension. | Giant black samurai silhouette seated on dark throne under enormous crimson sun. |
| **Legendary Art** | `achievements/legendary/legendary-conqueror.webp` | `Legendary` | Full-size achievement artwork for conquering all map territories. | Black samurai standing on mountain overlooking vast battlefield under red sun. |
| **Legendary Art** | `achievements/legendary/legendary-fortune.webp` | `Legendary` | Full-size achievement artwork for reaching $1 Trillion milestone. | Samurai silhouette standing before immense treasure vault spilling crimson light. |
| **Legendary Art** | `achievements/legendary/legendary-immortal.webp` | `Mythic` | Full-size achievement artwork for prestige rebirth and immortality. | Lone samurai standing beneath colossal crimson moon surrounded by dark peaks. |
| **Legendary Art** | `achievements/legendary/legendary-empire.webp` | `Mythic` | Full-size achievement artwork for owning all game buildings and businesses. | Massive dark fortress sprawling over mountain range with crimson banners and giant red sun. |
| **Legendary Art** | `achievements/legendary/legendary-beyond-fortune.webp` | `Mythic` | Endgame 100% completion artwork for discovering all secrets. | Mysterious samurai standing before abstract crimson cosmic portal in total darkness. |
| **Secret Achievements** | `achievements/secret/secret-mask.webp` | `Secret` | Hidden achievement art unlocked by clicking the hero's mask 50 times. | Dark horned mask silhouette emerging from black mist with glowing crimson eye slit. |
| **Secret Achievements** | `achievements/secret/secret-forbidden-gate.webp` | `Secret` | Hidden achievement art unlocked by discovering the hidden map path. | Ancient weathered torii gate wrapped in dark chains under a blood eclipse. |
| **Secret Achievements** | `achievements/secret/secret-mysterious-scroll.webp` | `Secret` | Hidden achievement art unlocked by maxing all ancient scroll upgrades. | Dark scroll unrolling with floating glowing red abstract runes. |
| **Secret Achievements** | `achievements/secret/secret-dark-temple.webp` | `Secret` | Hidden achievement art unlocked by clearing the secret fog of war node. | Cliffside pagoda temple shrouded in deep black fog under dark crimson moon. |
| **World Regions** | `world/regions/region-beginning.webp` | `Common` | Background artwork for Region 1 of the Achievement World Map. | Dark mountainous landscape with lone crimson sun and small samurai silhouette. |
| **World Regions** | `world/regions/region-dojo.webp` | `Common` | Background artwork for Region 2 of the Achievement World Map. | Traditional martial dojo pavilion with training courtyards and crimson banners. |
| **World Regions** | `world/regions/region-village.webp` | `Rare` | Background artwork for Region 3 of the Achievement World Map. | Stylized dark merchant village rooftops with small red lights and mountain backdrop. |
| **World Regions** | `world/regions/region-fortress.webp` | `Epic` | Background artwork for Region 4 of the Achievement World Map. | Massive multi-tiered fortress on mountain peak with crimson war banners. |
| **World Regions** | `world/regions/region-golden-empire.webp` | `Legendary` | Background artwork for Region 5 of the Achievement World Map. | Enormous palace spires with gold roof trims under a colossal blazing red sun. |
| **World Regions** | `world/regions/region-forbidden.webp` | `Mythic` | Background artwork for Region 6 of the Achievement World Map. | Mysterious floating landmasses with ancient torii gates under a giant crimson eclipse moon. |
| **World Landmarks** | `world/landmarks/landmark-fuji-sun.webp` | `Epic` | Major landmark on Achievement World Map visible from distant zoom levels. | Iconic snow-capped Mount Fuji silhouette centered in giant solid crimson sun. |
| **World Landmarks** | `world/landmarks/landmark-torii-portal.webp` | `Rare` | Major landmark gateway connecting World Map regions. | Massive torii gate standing in still water reflecting a giant red sun. |
| **World Landmarks** | `world/landmarks/landmark-sword-mountain.webp` | `Legendary` | Major landmark marking the peak of the Swordsmanship upgrade branch. | Giant ancient katana driven into mountain peak cutting across a crimson moon. |
| **Buildings** | `buildings/building-small-shop.webp` | `Common` | Building tier 1 illustration on economic empire dashboard. | Humble wooden merchant shop stall with red hanging lantern and sun disc. |
| **Buildings** | `buildings/building-blacksmith.webp` | `Rare` | Building tier 2 illustration on economic empire dashboard. | Dark sword smithy forge silhouette glowing with crimson embers and an anvil. |
| **Buildings** | `buildings/building-mine.webp` | `Rare` | Building tier 3 illustration on economic empire dashboard. | Dark mountain mine entrance with wooden timber supports and gold ore carts. |
| **Buildings** | `buildings/building-treasury.webp` | `Epic` | Building tier 4 illustration on economic empire dashboard. | Fortified stone treasury storehouse with heavy iron door and red banners. |
| **Buildings** | `buildings/building-fortress.webp` | `Legendary` | Building tier 5 illustration on economic empire dashboard. | Towering multi-story samurai fortress castle on stone foundation. |
| **Items & Equipment** | `items/swords/sword-steel-katana.webp` | `Common` | Primary weapon card in weapons inventory. | Curved katana blade with razor crimson cutting edge over red sun. |
| **Items & Equipment** | `items/swords/sword-twin-tanto.webp` | `Rare` | Dual-strike weapon card in weapons inventory. | Crossed tanto daggers silhouette with crimson cord wrap. |
| **Items & Equipment** | `items/swords/sword-dragon-naginata.webp` | `Epic` | Reach/area weapon card in weapons inventory. | Graceful naginata spear silhouette with flowing red silk tassel. |
| **Items & Equipment** | `items/swords/sword-shadow-shuriken.webp` | `Rare` | Speed weapon card in weapons inventory. | Sharp 4-point black ninja throwing star with razor crimson beveled edges. |
| **Items & Equipment** | `items/swords/sword-cursed-muramasa.webp` | `Legendary` | Endgame crit blade in weapons inventory. | Cursed black katana blade surrounded by crimson soul energy aura. |
| **Items & Equipment** | `items/armor/armor-demon-kabuto.webp` | `Epic` | Defense armor card in equipment inventory. | Menacing horned kabuto helmet silhouette with red eye visor. |
| **Items & Equipment** | `items/treasures/treasure-dragon-vault.webp` | `Epic` | Loot box container reward illustration. | Black lacquer chest with red dragon crests overflowing with gold kobans. |
| **Backgrounds** | `backgrounds/bg-main.webp` | `Common` | Full-screen subtle background behind main incremental dashboard. | Near-black minimalist landscape with subtle crimson mist and mountain horizon. |
| **Backgrounds** | `backgrounds/bg-achievements.webp` | `Common` | High-contrast dark canvas for the Achievement Graph nodes and connections. | Ultra-dark minimalist background with subtle geometric grid lines and faint red haze. |
| **Loading Screen** | `loading/loading-samurai.webp` | `Common` | Central silhouette on initial game loading screen. | Centered pure black silhouette of samurai in stance on dark rock. |
| **Notifications** | `notifications/notification-achievement-unlocked.webp` | `Common` | Emblem displayed on top-center achievement unlock toast notifications. | Crimson and gold circular laurel medallion with crossed katana blades. |

---

## 4. How Coding Agents & Game Components Consume These Assets

### Option A: Static Import (React / TypeScript)
```tsx
import heroSamurai from '@/assets/brand/hero-samurai.webp';
import wealth1mChest from '@/assets/achievements/wealth/wealth-1m-golden-chest.webp';
import emblemDragon from '@/assets/achievements/emblems/emblem-dragon.webp';

export function HeroBanner() {
  return <img src={heroSamurai} alt="Samurai Money" className="w-96 h-96 object-contain" />;
}
```

### Option B: Dynamic Manifest Lookup (By ID or Category)
```tsx
import manifest from '@/assets/assets_manifest.json';

export function getAssetMetadata(assetId: string) {
  return manifest.assets.find((a: any) => a.id === assetId);
}
```
