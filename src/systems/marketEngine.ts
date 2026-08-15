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
 * Pseudo-random generator with deterministic seed
 */
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

/**
 * Calculate mathematical price multiplier based on personality and cycle phase
 */
function getPersonalityMultiplier(
  personality: TradingAssetDefinition['personality'],
  phase: number
): number {
  // Normalize phase to [0, 2*PI]
  const p = ((phase % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
  const normalized = p / (2 * Math.PI); // 0 to 1

  switch (personality) {
    case 'stable':
      // Gentle dual-frequency harmonic
      return 1.0 + 0.07 * Math.sin(p) + 0.03 * Math.sin(2.7 * p);

    case 'slow_growth':
      // Upward-biased wave
      return 1.0 + 0.12 * Math.sin(p) + 0.06 * Math.sin(3 * p);

    case 'wave':
      // Clean rhythmic sine wave
      return 1.0 + 0.25 * Math.sin(p) + 0.08 * Math.cos(2 * p);

    case 'cycle':
      // Asymmetrical cycle with steady buildup and steeper descent
      return 1.0 + 0.38 * Math.sin(p - 0.2) + 0.12 * Math.sin(0.5 * p);

    case 'volatile':
      // Multi-frequency sharp oscillation
      return 1.0 + 0.45 * Math.sin(p) * Math.cos(1.8 * p) + 0.15 * Math.sin(4.2 * p);

    case 'boom_correction': {
      // 70% slow steady ramp up, 30% steep correction drop
      if (normalized < 0.7) {
        const progress = normalized / 0.7; // 0 to 1
        return 0.75 + 0.75 * Math.pow(progress, 1.4); // goes up to 1.50
      } else {
        const dropProgress = (normalized - 0.7) / 0.3; // 0 to 1
        return 1.50 - 0.75 * Math.pow(dropProgress, 0.6); // falls back to 0.75
      }
    }

    case 'rare_spike': {
      // 82% quiet baseline, 18% explosive parabolic peak
      if (normalized < 0.82) {
        return 0.85 + 0.12 * Math.sin(normalized * 12);
      } else {
        const spikeProgress = (normalized - 0.82) / 0.18; // 0 to 1
        // Bell-curve shape
        const spike = Math.exp(-Math.pow((spikeProgress - 0.5) * 4, 2));
        return 0.90 + 1.25 * spike;
      }
    }

    case 'extreme_cycle': {
      // Grand planetary wave with deep valleys and monumental peaks
      return 1.0 + 0.62 * Math.sin(p) + 0.22 * Math.cos(2.4 * p);
    }

    default:
      return 1.0;
  }
}

/**
 * Generate historical price points for a given timeframe
 */
export function generateHistoryForTimeframe(
  asset: TradingAssetDefinition,
  timeRange: TimeRange,
  currentPrice: number,
  currentCycle: number,
  now: number = Date.now()
): PricePoint[] {
  const durationMs = TIMEFRAME_MS[timeRange];
  const numPoints = timeRange === '1H' ? 24 : timeRange === '6H' ? 30 : 36;
  const stepMs = durationMs / (numPoints - 1);
  const cycleSpeed = (2 * Math.PI) / (asset.cycleLengthSeconds * 1000);

  const points: PricePoint[] = [];

  for (let i = 0; i < numPoints - 1; i++) {
    const timestamp = now - durationMs + i * stepMs;
    const timeDeltaMs = now - timestamp;
    const pastPhase = currentCycle - timeDeltaMs * cycleSpeed;
    
    // Controlled deterministic noise using hash
    const noise = (seededRandom(asset.startingPrice + timestamp * 0.001) - 0.5) * asset.volatility * 0.25;
    const multiplier = getPersonalityMultiplier(asset.personality, pastPhase);
    
    let rawPrice = asset.startingPrice * multiplier * (1 + noise);
    rawPrice = Math.max(asset.minimumPrice, Math.min(asset.maximumPrice, rawPrice));

    points.push({
      timestamp,
      price: Math.round(rawPrice * 100) / 100
    });
  }

  // Ensure last point is exactly the current price at the current timestamp
  points.push({
    timestamp: now,
    price: currentPrice
  });

  return points;
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
  const cyclePosition = persistedCycle !== undefined ? persistedCycle : seededRandom(asset.startingPrice) * 2 * Math.PI;
  const multiplier = getPersonalityMultiplier(asset.personality, cyclePosition);
  
  let currentPrice = persistedPrice !== undefined ? persistedPrice : Math.round(asset.startingPrice * multiplier * 100) / 100;
  currentPrice = Math.max(asset.minimumPrice, Math.min(asset.maximumPrice, currentPrice));

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
 * Step the market simulation forward by deltaSeconds
 */
export function tickAssetRuntime(
  asset: TradingAssetDefinition,
  runtime: TradingAssetRuntime,
  deltaSeconds: number,
  activeEvents: MarketEvent[] = [],
  now: number = Date.now()
): TradingAssetRuntime {
  const cycleAdvance = (2 * Math.PI * deltaSeconds) / asset.cycleLengthSeconds;
  const newCyclePosition = (runtime.cyclePosition + cycleAdvance) % (2 * Math.PI);

  // Calculate base personality value
  const baseMultiplier = getPersonalityMultiplier(asset.personality, newCyclePosition);
  
  // Calculate active event multiplier
  let eventMultiplier = 1.0;
  for (const event of activeEvents) {
    if (event.affectedAssetIds.includes(asset.id) && now <= event.expiresAt) {
      eventMultiplier *= event.multiplier;
    }
  }

  // Micro noise (±0.8% scaled by volatility)
  const noise = (Math.random() - 0.5) * asset.volatility * 0.08;
  
  // Target raw price
  let targetPrice = asset.startingPrice * baseMultiplier * eventMultiplier * (1 + noise);
  
  // Smooth price transition (momentum dampening)
  const smoothingFactor = Math.min(1, deltaSeconds * 1.5);
  let newPrice = runtime.currentPrice + (targetPrice - runtime.currentPrice) * smoothingFactor;

  // Strict floor and ceiling clamp
  newPrice = Math.max(asset.minimumPrice, Math.min(asset.maximumPrice, newPrice));
  newPrice = Math.round(newPrice * 100) / 100;

  // Update history arrays
  const updatedHistory = { ...runtime.history };
  const timeRanges: TimeRange[] = ['1H', '6H', '24H', '7D', '30D', '90D', '1Y'];

  for (const tr of timeRanges) {
    const arr = [...(updatedHistory[tr] || [])];
    const duration = TIMEFRAME_MS[tr];
    
    // Append new point
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
    high24h: Math.round(high24h * 100) / 100,
    low24h: Math.round(low24h * 100) / 100,
    averagePrice: Math.round(averagePrice * 100) / 100,
    trend: calculateTrend(priceChange24h),
    marketPosition: calculateMarketPosition(newPrice, asset.minimumPrice, asset.maximumPrice),
    cyclePosition: newCyclePosition,
    history: updatedHistory
  };
}

/**
 * Initialize the full market runtime state for all 18 assets
 */
export function initializeMarketState(
  persistedPrices: Record<string, number> = {},
  persistedCycles: Record<string, number> = {},
  now: number = Date.now()
): Record<string, TradingAssetRuntime> {
  const result: Record<string, TradingAssetRuntime> = {};
  for (const asset of TRADING_ASSETS) {
    result[asset.id] = initializeAssetRuntime(
      asset,
      persistedPrices[asset.id],
      persistedCycles[asset.id],
      now
    );
  }
  return result;
}

/**
 * Initial Market News Items
 */
export const INITIAL_MARKET_NEWS: MarketNewsItem[] = [
  {
    id: 'news-1',
    title: 'Sword Production Surges in Mountain Province',
    description: 'Blacksmith guilds report massive orders for tamahagane steel and iron ore.',
    affectedAssetId: 'trade-samurai-steel',
    priceImpactPercentage: 8.4,
    timestamp: Date.now() - 3600000 * 4,
    isPositive: true
  },
  {
    id: 'news-2',
    title: 'Bountiful Autumn Harvest in Coastal Plains',
    description: 'Abundant grain yields have stabilized provincial rice and salt storage reserves.',
    affectedAssetId: 'trade-rice',
    priceImpactPercentage: -2.1,
    timestamp: Date.now() - 3600000 * 8,
    isPositive: false
  },
  {
    id: 'news-3',
    title: 'Imperial Court Announces Grand Autumn Ceremony',
    description: 'Nobles and emissaries compete fiercely for rare gold-embroidered imperial silk.',
    affectedAssetId: 'trade-imperial-silk',
    priceImpactPercentage: 14.8,
    timestamp: Date.now() - 3600000 * 14,
    isPositive: true
  },
  {
    id: 'news-4',
    title: 'Rare Jade Vein Unearthed Near Sacred Peaks',
    description: 'Gem collectors and shrine monks gather in Capital Province for ceremonial appraisal.',
    affectedAssetId: 'trade-dragon-jade',
    priceImpactPercentage: 19.5,
    timestamp: Date.now() - 3600000 * 22,
    isPositive: true
  }
];

/**
 * Calculate total portfolio market value
 */
export function calculatePortfolioValue(
  holdings: Record<string, PlayerHolding>,
  marketRuntimes: Record<string, TradingAssetRuntime>
): number {
  let total = 0;
  for (const [assetId, holding] of Object.entries(holdings)) {
    if (holding.quantity > 0) {
      const price = marketRuntimes[assetId]?.currentPrice || 0;
      total += holding.quantity * price;
    }
  }
  return Math.round(total * 100) / 100;
}

/**
 * Calculate total unrealized profit
 */
export function calculateUnrealizedProfit(
  holdings: Record<string, PlayerHolding>,
  marketRuntimes: Record<string, TradingAssetRuntime>
): number {
  let totalProfit = 0;
  for (const [assetId, holding] of Object.entries(holdings)) {
    if (holding.quantity > 0) {
      const currentPrice = marketRuntimes[assetId]?.currentPrice || holding.averageBuyPrice;
      const currentValue = holding.quantity * currentPrice;
      const costBasis = holding.quantity * holding.averageBuyPrice;
      totalProfit += (currentValue - costBasis);
    }
  }
  return Math.round(totalProfit * 100) / 100;
}

/**
 * Default clean initial TradingState for save files
 */
export function getDefaultTradingState(): TradingState {
  return {
    holdings: {},
    trades: [],
    watchlist: ['trade-rice', 'trade-tea', 'trade-samurai-steel', 'trade-dragon-jade'],
    priceAlerts: {},
    totalInvested: 0,
    totalRealizedProfit: 0,
    totalWinningTrades: 0,
    totalLosingTrades: 0,
    lastSimulationTimestamp: Date.now(),
    activeEvents: [],
    news: INITIAL_MARKET_NEWS,
    persistedPrices: {},
    persistedCyclePositions: {}
  };
}
