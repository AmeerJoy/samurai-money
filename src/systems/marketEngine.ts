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
 * Calculate personality curve multiplier with asset-specific harmonic nuances
 */
function getPersonalityMultiplier(
  personality: TradingAssetDefinition['personality'],
  phase: number,
  assetSeed: number
): number {
  const p = ((phase % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
  const normalized = p / (2 * Math.PI);
  const seedShift = (assetSeed % 100) / 100;

  switch (personality) {
    case 'stable':
      // Gentle dual-frequency commodity oscillation
      return 1.0 + 0.12 * Math.sin(p + seedShift) + 0.05 * Math.sin(2.3 * p + seedShift * 2);

    case 'slow_growth':
      // Upward-biased steady channel
      return 1.0 + 0.18 * Math.sin(p + seedShift) + 0.08 * Math.sin(3.1 * p) + 0.04 * (normalized - 0.5);

    case 'wave':
      // Classic rhythmic market wave with harmonic overtone
      return 1.0 + 0.32 * Math.sin(p + seedShift) + 0.10 * Math.cos(2.1 * p + seedShift);

    case 'cycle':
      // Asymmetric supply/demand cycle (smooth buildup, faster retrace)
      return 1.0 + 0.42 * Math.sin(p - 0.3 + seedShift) + 0.14 * Math.sin(0.5 * p);

    case 'volatile':
      // Multi-frequency dynamic trader volatility
      return 1.0 + 0.50 * Math.sin(p + seedShift) * Math.cos(1.7 * p) + 0.18 * Math.sin(3.4 * p + seedShift);

    case 'boom_correction': {
      // 65% accumulation expansion, 35% controlled correction
      if (normalized < 0.65) {
        const progress = normalized / 0.65;
        return 0.78 + 0.70 * Math.pow(progress, 1.3);
      } else {
        const drop = (normalized - 0.65) / 0.35;
        return 1.48 - 0.70 * (1 - Math.cos(drop * Math.PI * 0.5));
      }
    }

    case 'rare_spike': {
      // 80% baseline consolidation, 20% momentum rally
      if (normalized < 0.80) {
        return 0.88 + 0.10 * Math.sin(normalized * 10 + seedShift);
      } else {
        const spikeProgress = (normalized - 0.80) / 0.20;
        const bell = Math.exp(-Math.pow((spikeProgress - 0.5) * 3.5, 2));
        return 0.90 + 1.20 * bell;
      }
    }

    case 'extreme_cycle': {
      // Grand planetary multi-wave
      return 1.0 + 0.65 * Math.sin(p + seedShift) + 0.25 * Math.cos(2.2 * p + seedShift * 3);
    }

    default:
      return 1.0;
  }
}

/**
 * Generate historical price points tailored to the selected timeframe
 * Provides realistic, multi-scale financial market curves across 1H, 24H, 7D, 30D, 90D, and 1Y
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

  // Scaled resolution & realistic swing frequency per timeframe
  const numPointsMap: Record<TimeRange, number> = {
    '1H': 60,
    '6H': 80,
    '24H': 100,
    '7D': 120,
    '30D': 150,
    '90D': 180,
    '1Y': 220
  };

  const macroWavesMap: Record<TimeRange, number> = {
    '1H': 1.4,
    '6H': 2.2,
    '24H': 3.0,
    '7D': 4.8,
    '30D': 7.5,
    '90D': 11.0,
    '1Y': 16.0
  };

  const numPoints = numPointsMap[timeRange] || 100;
  const macroWaves = macroWavesMap[timeRange] || 3.0;
  const stepMs = durationMs / (numPoints - 1);
  const macroFrequency = (macroWaves * 2 * Math.PI) / durationMs;

  const rawPrices: number[] = [];
  const timestamps: number[] = [];

  for (let i = 0; i < numPoints - 1; i++) {
    const timestamp = now - durationMs + i * stepMs;
    const timeDeltaMs = now - timestamp;
    
    // Multi-octave continuous phase tracking
    const phase = currentCycle - timeDeltaMs * macroFrequency;
    
    // 1. Primary macro trend wave
    const macroMult = getPersonalityMultiplier(asset.personality, phase, assetSeed);
    
    // 2. Intermediate market swing harmonic
    const intermediateWave = Math.sin(phase * 2.3 + (assetSeed % 5)) * (asset.volatility * 0.18)
                           + Math.cos(phase * 3.7 + (assetSeed % 3)) * (asset.volatility * 0.10);

    // 3. Organic micro-session fluctuation
    const microWave = Math.sin(phase * 7.1 + i * 0.3) * (asset.volatility * 0.05)
                    + Math.cos(phase * 11.3 + (assetSeed % 11)) * (asset.volatility * 0.03);

    // Composite raw price with multi-scale market dynamics
    let rawPrice = asset.startingPrice * macroMult * (1 + intermediateWave + microWave);
    
    // Soft boundary compression ensures natural rounded turning points with zero clipping
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
    const smoothed = prev * 0.22 + price * 0.56 + next * 0.22;
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
  const multiplier = getPersonalityMultiplier(asset.personality, cyclePosition, assetSeed);
  
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

  // Calculate base personality value
  const baseMultiplier = getPersonalityMultiplier(asset.personality, newCyclePosition, assetSeed);
  
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
