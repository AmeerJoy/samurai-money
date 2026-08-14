# Samurai Money — Feudal Incremental Tycoon & Asset Production System

Samurai Money is an idle tycoon simulation game and master asset pipeline built with React 19, TypeScript, and Vite. The game combines feudal samurai lore, multi-tiered economic progression, dynamic visual level mastery, audio-visual feedback, and production-ready WebP asset management.

---

## Architecture Overview

```
SamuraiMoney-Production-Assets/
├── game_ready_assets/          # Optimized WebP assets and vector icons
│   ├── achievements/           # Wealth nodes, emblems, and secret honors
│   ├── brand/                  # Logos, badges, and banners
│   ├── buildings/              # Shrines, dojos, mints, and fortresses
│   ├── characters/             # 10 Progressive samurai combat stances
│   ├── items/                  # Katanas, naginatas, armors, and relics
│   ├── world/                  # 6 Feudal region environments & landmarks
│   ├── ASSET_MANIFEST.md       # Master visual table and documentation
│   └── assets_manifest.json    # Machine-readable asset metadata catalog
├── scripts/
│   ├── copy-assets.js          # Synchronizes game_ready_assets to public directory
│   ├── verify-game.js          # Runtime system verification suite (JS)
│   └── verify-game.ts          # Type-safe economy and assets validator (TS)
├── src/
│   ├── assets/                 # Asset loader and resolver maps
│   ├── components/             # React UI components (Treasury, Hero, Upgrades, Shop, Map, etc.)
│   ├── context/                # GameState provider, audio engine, and persistence
│   ├── data/                   # Upgrades (34), Regions (6), Relics (13), Achievements (29)
│   ├── styles/                 # Master design system and responsive style rules
│   ├── systems/                # Economy math, geometric formulas, and number formatters
│   └── types/                  # TypeScript interface definitions
├── index.html                  # Main application HTML entry point
├── package.json                # Project dependencies and lifecycle scripts
├── tsconfig.json               # TypeScript compiler options
└── vite.config.ts              # Vite configuration
```

---

## Key Features

1. **Samurai Strike & Combos**:
   - Manual Katana strikes with responsive visual slash animations and audio feedback.
   - Combo multiplier scaling with speed-decay mechanics.

2. **Feudal Economy & Upgrades**:
   - 34 balanced upgrades spanning Click Power, Workers, Buildings, Martial Training, Wealth Mints, and Sovereign Empire.
   - Dynamic 1x, 10x, and MAX purchase calculation modes with real-time yield forecasting.
   - Continuous per-level color scaling and visual progression tiers.
   - Interactive Level Badge contribution inspector calculating exact revenue shares and historical ROI.

3. **Multi-Realm Feudal World**:
   - 6 unlockable territorial realms (Bamboo Valley, Mountain Province, Golden Capital, Imperial Fortress, Legendary Realm) with unique economic multipliers.

4. **Imperial Armory & Shop**:
   - 13 collectible weapons, armors, and mystical relics with rarity tiers (Common, Rare, Epic, Legendary, Mythic).

5. **Universal Visual Progress Filament**:
   - Pure visual glowing progress gauges across all locked and unaffordable upgrades, regions, achievements, and shop relics.

6. **Local Persistence & Offline Progress**:
   - Automatic local storage save state with offline earnings calculation on launch.

---

## Development & Build Commands

```bash
# Install dependencies
npm install

# Start local Vite development server
npm run dev

# Run automated validation test suite
npx tsx scripts/verify-game.ts

# Build production bundle
npm run build

# Preview production build
npm run preview
```

---

## Palette & Design System
- **Deep Core**: `#07080C`
- **Surface**: `#0E1017`
- **Card Base**: `#151821`
- **Primary Crimson**: `#D20A2E`
- **Glow Crimson**: `#F01835`
- **Primary Gold**: `#F59E0B`
- **Bright Koban Gold**: `#FCD34D`
- **Jade Emerald**: `#10B981`
