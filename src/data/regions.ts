import { RegionDefinition } from '../types';

export const REGIONS: RegionDefinition[] = [
  {
    id: 'region-village',
    order: 1,
    name: 'Samurai Village',
    requirement: 0,
    backgroundAssetId: 'region-beginning',
    landmarkAssetId: 'landmark-fuji-sun',
    landmarkName: 'Mount Fuji Horizon',
    landmarkDescription: 'The sacred peak rises behind the humble training grounds where your journey begins.',
    description: 'Rustic wooden huts, bamboo groves, and dirt training courtyards. The humble birthplace of your financial dynasty.',
    theme: 'Humble Beginnings & Martial Training',
    bonusDescription: 'Base starting territory with standard income rates.',
    multiplier: 1.0
  },
  {
    id: 'region-bamboo-valley',
    order: 2,
    name: 'Bamboo Valley & Dojo',
    requirement: 100000, // $100K
    backgroundAssetId: 'region-dojo',
    landmarkAssetId: 'landmark-torii-portal',
    landmarkName: 'Grand Torii Portal',
    landmarkDescription: 'A colossal crimson gateway submerged in still mountain waters, blessing all trade.',
    description: 'Dense bamboo forests shielding ancient martial dojos and flourishing merchant caravan crossroads.',
    theme: 'Spiritual Discipline & Early Trade',
    bonusDescription: '+15% Global Income in this region.',
    multiplier: 1.15
  },
  {
    id: 'region-mountain-province',
    order: 3,
    name: 'Mountain Province',
    requirement: 10000000, // $10M
    backgroundAssetId: 'region-village',
    landmarkAssetId: 'landmark-sword-mountain',
    landmarkName: 'Blade of the Ancients',
    landmarkDescription: 'A massive monolith katana driven into the mountain summit, channeling warrior fortune.',
    description: 'Snow-dusted mountain peaks dotted with iron forges, gold mines, and bustling merchant boroughs.',
    theme: 'Industry, Mining & Metalcraft',
    bonusDescription: '+25% Global Income in this region.',
    multiplier: 1.25
  },
  {
    id: 'region-golden-capital',
    order: 4,
    name: 'Golden Capital',
    requirement: 1000000000, // $1B
    backgroundAssetId: 'region-fortress',
    landmarkAssetId: 'landmark-fuji-sun',
    landmarkName: 'Imperial Sun Crest',
    landmarkDescription: 'A majestic crimson sun illuminating golden rooftops and bustling central treasuries.',
    description: 'A sprawling megalopolis with lacquered merchant halls, gilded arches, and towering financial guilds.',
    theme: 'Unbounded Wealth & Guild Hegemony',
    bonusDescription: '+50% Global Income in this region.',
    multiplier: 1.50
  },
  {
    id: 'region-imperial-fortress',
    order: 5,
    name: 'Imperial Fortress',
    requirement: 1000000000000, // $1T
    backgroundAssetId: 'region-golden-empire',
    landmarkAssetId: 'landmark-torii-portal',
    landmarkName: 'Dynasty Gate of Honor',
    landmarkDescription: 'The fortified dragon gateway through which untold billions in tributary gold flow daily.',
    description: 'A massive multi-tiered imperial citadel bristling with banners, elite guards, and diamond-locked treasuries.',
    theme: 'Sovereignty & Feudal Dominion',
    bonusDescription: '+100% Global Income (2x Multiplier) in this region.',
    multiplier: 2.0
  },
  {
    id: 'region-legendary-realm',
    order: 6,
    name: 'Legendary Realm',
    requirement: 1000000000000000, // $1Qa
    backgroundAssetId: 'region-forbidden',
    landmarkAssetId: 'landmark-sword-mountain',
    landmarkName: 'Celestial Eclipse Monolith',
    landmarkDescription: 'An ethereal blade piercing the cosmic fabric under a perpetual blood moon eclipse.',
    description: 'Floating celestial landmasses where gold flows like rivers beneath an eternal crimson eclipse.',
    theme: 'Cosmic Fortune & Infinite Ascension',
    bonusDescription: '+200% Global Income (3x Multiplier) in this region.',
    multiplier: 3.0
  }
];

export function getRegion(id: string): RegionDefinition {
  return REGIONS.find(r => r.id === id) || REGIONS[0];
}

export function getNextRegion(currentRequirement: number): RegionDefinition | null {
  return REGIONS.find(r => r.requirement > currentRequirement) || null;
}
