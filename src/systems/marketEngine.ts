// Samurai Money — Complete Unified Trading Market Simulation Engine
import { 
  TradingAssetDefinition, 
  TradingAssetRuntime, 
  PricePoint, 
  TimeRange, 
  MarketTrend, 
  MarketPosition, 
  MarketNewsItem, 
  MarketEvent,
  TradingState,
  PlayerHolding
} from '../types/trading';
import { TRADING_ASSETS } from '../data/tradingAssets';

/**
 * Timeframe interval definitions in milliseconds
 */
export const TIMEFRAME_MS: Record<TimeRange, number> = {
  '1H': 60 * 60 * 1000,
  '6H': 6 * 60 * 60 * 1000,
  '24H': 24 * 60 * 60 * 1000,
  '7D': 7 * 24 * 60 * 60 * 1000,
  '30D': 30 * 24 * 60 * 60 * 1000,
  '90D': 90 * 24 * 60 * 60 * 1000,
  '1Y': 365 * 24 * 60 * 60 * 1000
};

/**
 * Deterministic pseudo-random generator
 */
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

/**
 * Generate unique integer hash from string ID
 */
function getAssetHash(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash) + id.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Smooth Hermite cubic interpolation
 */
function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

/**
 * 1D Gradient Noise generator for organic, natural price dynamics
 */
function gradientNoise1D(x: number, seed: number): number {
  const i0 = Math.floor(x);
  const i1 = i0 + 1;
  const t = x - i0;
  const st = smoothstep(t);

  const g0 = (seededRandom(i0 * 157.31 + seed * 349.77) * 2) - 1;
  const g1 = (seededRandom(i1 * 157.31 + seed * 349.77) * 2) - 1;

  const n0 = g0 * t;
  const n1 = g1 * (t - 1);

  return n0 + st * (n1 - n0);
}

/**
 * Multi-octave fractal noise with non-uniform harmonic frequencies
 * Recreates genuine financial asset dynamics (like Gold, USD, or commodities) with varying peaks,
 * consolidation ranges, and non-repetitive organic price discovery
 */
function fractalMarketNoise(t: number, seed: number, octaves = 5): number {
  let value = 0;
  let amplitude = 1.0;
  let frequency = 1.0;
  let totalAmp = 0;

  // Non-integer prime-based octave ratios to break all artificial periodic symmetry
  const lacunarity = [2.13, 2.27, 2.05, 2.39, 2.19];

  for (let i = 0; i < octaves; i++) {
    value += gradientNoise1D(t * frequency, seed + i * 47.19) * amplitude;
    totalAmp += amplitude;
    amplitude *= 0.53;
    frequency *= (lacunarity[i % lacunarity.length] || 2.15);
  }

  return value / totalAmp;
}

/**
 * Apply soft-knee boundary compression so price smoothly decelerates near min/max
 * and NEVER produces flat horizontal clipping lines
 */
function applySoftBounds(val: number, min: number, max: number): number {
  const mid = (min + max) / 2;
  const halfRange = (max - min) / 2;
  if (halfRange <= 0) return min;

  const normalized = (val - mid) / halfRange;
  // Hyperbolic tangent compression ensures smooth curves with zero flat lines
  const softNormalized = Math.tanh(normalized * 1.1) * 0.94;
  return mid + softNormalized * halfRange;
}

/**
 * Personality-specific macro shape modifier
 */
function getPersonalityDynamics(
  personality: TradingAssetDefinition['personality'],
  rawNoise: number,
  t: number,
  assetSeed: number
): number {
  switch (personality) {
    case 'stable':
      // Gentle, mean-reverting commodity channel (like Gold or Salt)
      return 1.0 + rawNoise * 0.18;

    case 'slow_growth':
      // Secular upward drift with organic pullbacks
      return 1.0 + rawNoise * 0.24 + Math.sin(t * 0.4 + (assetSeed % 5)) * 0.08;

    case 'wave':
      // Multi-phase market wave with varied cycle lengths
      return 1.0 + rawNoise * 0.38 + Math.sin(t * 0.7 + (assetSeed % 7)) * 0.15;

    case 'cycle':
      // Extended accumulation followed by sharp expansion
      return 1.0 + rawNoise * 0.46 + Math.cos(t * 0.5 + (assetSeed % 3)) * 0.20;

    case 'volatile':
      // High volatility trader swings with breakout momentum
      return 1.0 + rawNoise * 0.65;

    case 'boom_correction': {
      // Skewed regime: gradual build up with periodic sharp corrections
      const skewed = rawNoise > 0 ? Math.pow(rawNoise, 1.25) : -Math.pow(Math.abs(rawNoise), 0.85);
      return 1.0 + skewed * 0.55;
    }

    case 'rare_spike': {
      // Long low-volatility baseline with rare parabolic impulse
      const spike = Math.max(0, rawNoise - 0.25) * 2.2;
      return 1.0 + (rawNoise * 0.15) + spike * 0.85;
    }

    case 'extreme_cycle': {
      return 1.0 + rawNoise * 0.75;
    }

    default:
      return 1.0 + rawNoise * 0.3;
  }
}

/**
 * Generate historical price points tailored to the selected timeframe
 * Provides realistic, multi-scale financial market curves across 1H, 6H, 24H, 7D, 30D, 90D, and 1Y
 */
export function generateHistoryForTimeframe(
  asset: TradingAssetDefinition,
  timeRange: TimeRange,
  currentPrice: number,
  currentCycle: number,
  now: number = Date.now()
): PricePoint[] {
  const durationMs = TIMEFRAME_MS[timeRange];
  const assetSeed = getAssetHash(asset.id);

  // Scaled resolution per timeframe
  const numPointsMap: Record<TimeRange, number> = {
    '1H': 60,
    '6H': 80,
    '24H': 100,
    '7D': 120,
    '30D': 150,
    '90D': 180,
    '1Y': 220
  };

  const numPoints = numPointsMap[timeRange] || 100;
  const stepMs = durationMs / (numPoints - 1);

  const rawPrices: number[] = [];
  const timestamps: number[] = [];

  for (let i = 0; i < numPoints - 1; i++) {
    const timestamp = now - durationMs + i * stepMs;
    const timeDeltaMs = now - timestamp;
    
    // Unified continuous time coordinates:
    // 1. Year macro coordinate (slow secular trends)
    const tYear = (timeDeltaMs / (365 * 24 * 3600 * 1000)) * 6.0;
    // 2. Month swing coordinate (medium swings)
    const tMonth = (timeDeltaMs / (30 * 24 * 3600 * 1000)) * 8.0;
    // 3. Day / Hour microstructure coordinate (fine detail)
    const tDay = (timeDeltaMs / (24 * 3600 * 1000)) * 12.0;

    // Multi-scale composite noise
    const macroNoise = fractalMarketNoise(currentCycle - tYear, assetSeed, 4);
    const swingNoise = fractalMarketNoise(currentCycle * 2.5 - tMonth, assetSeed + 17, 3);
    const sessionNoise = fractalMarketNoise(currentCycle * 6.0 - tDay, assetSeed + 37, 2);

    // Dynamic scale weighting based on timeframe
    let compositeNoise = 0;
    if (timeRange === '1H' || timeRange === '6H') {
      compositeNoise = sessionNoise * 0.7 + swingNoise * 0.3;
    } else if (timeRange === '24H' || timeRange === '7D') {
      compositeNoise = swingNoise * 0.6 + macroNoise * 0.3 + sessionNoise * 0.1;
    } else {
      compositeNoise = macroNoise * 0.7 + swingNoise * 0.3;
    }
    
    // Apply personality dynamics
    const multiplier = getPersonalityDynamics(asset.personality, compositeNoise, currentCycle - tYear, assetSeed);

    let rawPrice = asset.startingPrice * multiplier;
    rawPrice = applySoftBounds(rawPrice, asset.minimumPrice, asset.maximumPrice);

    rawPrices.push(rawPrice);
    timestamps.push(timestamp);
  }

  // Smooth blending towards currentPrice at the right endpoint
  const targetDiff = currentPrice - (rawPrices[rawPrices.length - 1] || currentPrice);
  const adjustedPrices = rawPrices.map((price, idx) => {
    const blendFactor = Math.pow((idx + 1) / numPoints, 2.2);
    const blended = price + targetDiff * blendFactor;
    return applySoftBounds(blended, asset.minimumPrice, asset.maximumPrice);
  });

  // Low-pass filter for smooth continuous curvature
  const finalPoints: PricePoint[] = adjustedPrices.map((price, idx) => {
    const prev = adjustedPrices[Math.max(0, idx - 1)];
    const next = adjustedPrices[Math.min(adjustedPrices.length - 1, idx + 1)];
    const smoothed = prev * 0.18 + price * 0.64 + next * 0.18;
    return {
      timestamp: timestamps[idx],
      price: Math.round(smoothed * 100) / 100
    };
  });

  // Final point is precisely currentPrice at now
  finalPoints.push({
    timestamp: now,
    price: currentPrice
  });

  return finalPoints;
}

/**
 * Determine market trend from 24h price change
 */
export function calculateTrend(changePercentage: number): MarketTrend {
  if (changePercentage >= 10) return 'Strongly Rising';
  if (changePercentage >= 1.5) return 'Rising';
  if (changePercentage <= -10) return 'Strongly Falling';
  if (changePercentage <= -1.5) return 'Falling';
  return 'Stable';
}

/**
 * Determine market valuation position compared to historical average
 */
export function calculateMarketPosition(currentPrice: number, minPrice: number, maxPrice: number): MarketPosition {
  const range = maxPrice - minPrice;
  if (range <= 0) return 'Fair Value';

  const percentile = (currentPrice - minPrice) / range;
  if (percentile <= 0.20) return 'Very Cheap';
  if (percentile <= 0.40) return 'Below Average';
  if (percentile <= 0.60) return 'Fair Value';
  if (percentile <= 0.80) return 'Above Average';
  return 'Very Expensive';
}

/**
 * Initialize runtime market asset state
 */
export function initializeAssetRuntime(
  asset: TradingAssetDefinition,
  persistedPrice?: number,
  persistedCycle?: number,
  now: number = Date.now()
): TradingAssetRuntime {
  const assetSeed = getAssetHash(asset.id);
  const cyclePosition = persistedCycle !== undefined ? persistedCycle : (assetSeed % 628) / 100;
  
  const initialNoise = fractalMarketNoise(cyclePosition * 2.0, assetSeed, 5);
  const multiplier = getPersonalityDynamics(asset.personality, initialNoise, cyclePosition * 2.0, assetSeed);
  
  let rawPrice = persistedPrice !== undefined ? persistedPrice : asset.startingPrice * multiplier;
  let currentPrice = applySoftBounds(rawPrice, asset.minimumPrice, asset.maximumPrice);
  currentPrice = Math.round(currentPrice * 100) / 100;

  // Generate 7 standard timeframes
  const history: Record<TimeRange, PricePoint[]> = {
    '1H': generateHistoryForTimeframe(asset, '1H', currentPrice, cyclePosition, now),
    '6H': generateHistoryForTimeframe(asset, '6H', currentPrice, cyclePosition, now),
    '24H': generateHistoryForTimeframe(asset, '24H', currentPrice, cyclePosition, now),
    '7D': generateHistoryForTimeframe(asset, '7D', currentPrice, cyclePosition, now),
    '30D': generateHistoryForTimeframe(asset, '30D', currentPrice, cyclePosition, now),
    '90D': generateHistoryForTimeframe(asset, '90D', currentPrice, cyclePosition, now),
    '1Y': generateHistoryForTimeframe(asset, '1Y', currentPrice, cyclePosition, now)
  };

  // Calculate 24h change & stats
  const points24h = history['24H'];
  const startPrice24h = points24h.length > 0 ? points24h[0].price : currentPrice;
  const priceChange24h = startPrice24h > 0 ? ((currentPrice - startPrice24h) / startPrice24h) * 100 : 0;
  
  const prices24h = points24h.map(p => p.price);
  const high24h = Math.max(...prices24h, currentPrice);
  const low24h = Math.min(...prices24h, currentPrice);
  const averagePrice = prices24h.reduce((acc, p) => acc + p, 0) / (prices24h.length || 1);

  return {
    id: asset.id,
    currentPrice,
    previousPrice: currentPrice,
    priceChange24h: Math.round(priceChange24h * 10) / 10,
    high24h,
    low24h,
    averagePrice: Math.round(averagePrice * 100) / 100,
    trend: calculateTrend(priceChange24h),
    marketPosition: calculateMarketPosition(currentPrice, asset.minimumPrice, asset.maximumPrice),
    cyclePosition,
    momentum: 0,
    history
  };
}

/**
 * Step the market simulation forward smoothly with momentum and natural market pacing
 */
export function tickAssetRuntime(
  asset: TradingAssetDefinition,
  runtime: TradingAssetRuntime,
  deltaSeconds: number,
  activeEvents: MarketEvent[] = [],
  now: number = Date.now()
): TradingAssetRuntime {
  const assetSeed = getAssetHash(asset.id);
  // Realistic pacing: 8 to 20 minutes for a complete natural cycle
  const effectiveCycleSeconds = Math.max(480, asset.cycleLengthSeconds * 3);
  const cycleAdvance = (2 * Math.PI * deltaSeconds) / effectiveCycleSeconds;
  const newCyclePosition = (runtime.cyclePosition + cycleAdvance) % (2 * Math.PI);

  // Calculate base personality value using continuous fractal noise
  const liveNoise = fractalMarketNoise(newCyclePosition * 2.0, assetSeed, 5);
  const baseMultiplier = getPersonalityDynamics(asset.personality, liveNoise, newCyclePosition * 2.0, assetSeed);
  
  // Calculate active event multiplier
  let eventMultiplier = 1.0;
  for (const event of activeEvents) {
    if (event.affectedAssetIds.includes(asset.id) && now <= event.expiresAt) {
      eventMultiplier *= event.multiplier;
    }
  }

  // Organic micro-volatility
  const microNoise = Math.sin(now * 0.001 + assetSeed) * (asset.volatility * 0.03)
                   + (seededRandom(assetSeed + Math.floor(now / 5000)) - 0.5) * (asset.volatility * 0.04);
  
  // Target price with soft bounds
  let targetPrice = asset.startingPrice * baseMultiplier * eventMultiplier * (1 + microNoise);
  targetPrice = applySoftBounds(targetPrice, asset.minimumPrice, asset.maximumPrice);
  
  // Smooth momentum dampening
  const smoothingFactor = Math.min(1, deltaSeconds * 0.6);
  let newPrice = runtime.currentPrice + (targetPrice - runtime.currentPrice) * smoothingFactor;
  newPrice = applySoftBounds(newPrice, asset.minimumPrice, asset.maximumPrice);
  newPrice = Math.round(newPrice * 100) / 100;

  // Update history arrays smoothly
  const updatedHistory = { ...runtime.history };
  const timeRanges: TimeRange[] = ['1H', '6H', '24H', '7D', '30D', '90D', '1Y'];

  for (const tr of timeRanges) {
    const arr = [...(updatedHistory[tr] || [])];
    const duration = TIMEFRAME_MS[tr];
    
    // Append current point
    arr.push({ timestamp: now, price: newPrice });
    
    // Prune points older than duration
    while (arr.length > 2 && (now - arr[0].timestamp) > duration) {
      arr.shift();
    }
    
    updatedHistory[tr] = arr;
  }

  // Recalculate 24H metrics
  const points24h = updatedHistory['24H'];
  const startPrice24h = points24h.length > 0 ? points24h[0].price : newPrice;
  const priceChange24h = startPrice24h > 0 ? ((newPrice - startPrice24h) / startPrice24h) * 100 : 0;
  
  const prices24h = points24h.map(p => p.price);
  const high24h = Math.max(...prices24h, newPrice);
  const low24h = Math.min(...prices24h, newPrice);
  const averagePrice = prices24h.reduce((acc, p) => acc + p, 0) / (prices24h.length || 1);

  return {
    ...runtime,
    previousPrice: runtime.currentPrice,
    currentPrice: newPrice,
    priceChange24h: Math.round(priceChange24h * 10) / 10,
    high24h,
    low24h,
    averagePrice: Math.round(averagePrice * 100) / 100,
    trend: calculateTrend(priceChange24h),
    marketPosition: calculateMarketPosition(newPrice, asset.minimumPrice, asset.maximumPrice),
    cyclePosition: newCyclePosition,
    history: updatedHistory
  };
}

/**
 * Calculate player's total portfolio value in market
 */
export function calculatePortfolioValue(
  holdings: Record<string, PlayerHolding>,
  marketRuntimes: Record<string, TradingAssetRuntime>
): number {
  let total = 0;
  for (const [assetId, holding] of Object.entries(holdings)) {
    if (holding && holding.quantity > 0) {
      const runtime = marketRuntimes[assetId];
      const asset = TRADING_ASSETS.find(a => a.id === assetId);
      const currentPrice = runtime ? runtime.currentPrice : (asset ? asset.startingPrice : 0);
      total += holding.quantity * currentPrice;
    }
  }
  return total;
}

/**
 * Calculate player's total unrealized profit across all holdings
 */
export function calculateUnrealizedProfit(
  holdings: Record<string, PlayerHolding>,
  marketRuntimes: Record<string, TradingAssetRuntime>
): number {
  let totalProfit = 0;
  for (const [assetId, holding] of Object.entries(holdings)) {
    if (holding && holding.quantity > 0) {
      const runtime = marketRuntimes[assetId];
      const asset = TRADING_ASSETS.find(a => a.id === assetId);
      const currentPrice = runtime ? runtime.currentPrice : (asset ? asset.startingPrice : 0);
      const costBasis = holding.quantity * (holding.averageBuyPrice || currentPrice);
      const currentValue = holding.quantity * currentPrice;
      totalProfit += (currentValue - costBasis);
    }
  }
  return totalProfit;
}

/**
 * Initial market lore dispatches and provincial events
 */
export const INITIAL_MARKET_NEWS: MarketNewsItem[] = [
  {
    id: 'news-1',
    timestamp: Date.now() - 1000 * 60 * 45,
    title: 'Spring Harvest Exceeds Imperial Estimates',
    description: 'Bumper crops across coastal prefectures create steady surplus reserves and heavy regional trade.',
    affectedAssetId: 'trade-rice',
    priceImpactPercentage: 4.5,
    isPositive: true
  },
  {
    id: 'news-2',
    timestamp: Date.now() - 1000 * 60 * 120,
    title: 'Northern Mountain Fortresses Expand Weapon Armories',
    description: 'Daimyo battalions commission high-grade steel ingots and forged blades, bolstering blacksmith demand.',
    affectedAssetId: 'trade-samurai-steel',
    priceImpactPercentage: 8.2,
    isPositive: true
  },
  {
    id: 'news-3',
    timestamp: Date.now() - 1000 * 60 * 240,
    title: 'Silk Road Merchant Caravans Arrive at Capital Gates',
    description: 'Rare dyed fabrics and imperial brocades enter provincial auctions with spirited bidding.',
    affectedAssetId: 'trade-silk',
    priceImpactPercentage: 0,
    isPositive: true
  }
];

export const INITIAL_MARKET_EVENTS: MarketEvent[] = [
  {
    id: 'event-harvest-festival',
    name: 'Great Autumn Harvest Festival',
    description: 'Provincial trade fairs boost trading activity and commodity demand.',
    affectedAssetIds: ['trade-rice', 'trade-tea', 'trade-salt'],
    multiplier: 1.12,
    startedAt: Date.now() - 1000 * 60 * 30,
    expiresAt: Date.now() + 1000 * 60 * 60 * 4
  }
];

/**
 * Initialize all assets for runtime market
 */
export function initializeMarketState(
  persistedPrices: Record<string, number> = {},
  persistedCycles: Record<string, number> = {},
  now: number = Date.now()
): Record<string, TradingAssetRuntime> {
  const runtimes: Record<string, TradingAssetRuntime> = {};
  for (const asset of TRADING_ASSETS) {
    runtimes[asset.id] = initializeAssetRuntime(
      asset,
      persistedPrices[asset.id],
      persistedCycles[asset.id],
      now
    );
  }
  return runtimes;
}

/**
 * Default persistent trading state for save games
 */
export function getDefaultTradingState(): TradingState {
  return {
    holdings: {},
    trades: [],
    watchlist: ['trade-rice', 'trade-bamboo', 'trade-samurai-steel', 'trade-dragon-jade'],
    priceAlerts: {},
    totalInvested: 0,
    totalRealizedProfit: 0,
    totalWinningTrades: 0,
    totalLosingTrades: 0,
    lastSimulationTimestamp: Date.now(),
    activeEvents: INITIAL_MARKET_EVENTS,
    news: INITIAL_MARKET_NEWS,
    persistedPrices: {},
    persistedCyclePositions: {}
  };
}
