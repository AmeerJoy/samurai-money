// Samurai Money — Unified Trading Market Type Definitions

export type MarketPersonality = 
  | 'stable'           // Small movements around typical value (e.g. Rice)
  | 'slow_growth'      // General upward trend with small corrections (e.g. Bamboo, Cedar)
  | 'wave'             // Repeated rises and falls (e.g. Tea, Silk, Imperial Silk)
  | 'cycle'            // Longer rising and falling cycles (e.g. Iron, Samurai Steel, Shogun's Seal)
  | 'volatile'         // Large swings in both directions (e.g. War Horse, Ancient Blade)
  | 'boom_correction'  // Gradual growth followed by significant correction (e.g. Jade Ornament, Legendary Sword Core)
  | 'rare_spike'       // Usually stable, occasional large spikes (e.g. Dragon Jade)
  | 'extreme_cycle';   // Very large long-term market movements (e.g. Lost Clan Relic, Celestial Blade)

export type MarketRisk = 'Very Low' | 'Low' | 'Medium' | 'High' | 'Very High' | 'Extreme';

export type MarketTrend = 'Strongly Rising' | 'Rising' | 'Stable' | 'Falling' | 'Strongly Falling';

export type MarketPosition = 'Very Cheap' | 'Below Average' | 'Fair Value' | 'Above Average' | 'Very Expensive';

export type TimeRange = '1H' | '6H' | '24H' | '7D' | '30D' | '90D' | '1Y';

export interface PricePoint {
  timestamp: number; // Unix timestamp in ms
  price: number;
}

export interface TradingAssetDefinition {
  id: string;
  name: string;
  category: 'Materials' | 'Goods' | 'Equipment' | 'Luxury' | 'Treasures';
  description: string;
  startingPrice: number;
  minimumPrice: number;
  maximumPrice: number;
  personality: MarketPersonality;
  risk: MarketRisk;
  volatility: number; // 0.01 to 0.50
  cycleLengthSeconds: number; // Time in seconds for one full wave/cycle
  maxTransactionQuantity: number;
  assetId: string;
  lore: string;
}

export interface TradingAssetRuntime {
  id: string;
  currentPrice: number;
  previousPrice: number;
  priceChange24h: number; // Percentage change (-100 to +...)
  high24h: number;
  low24h: number;
  averagePrice: number;
  trend: MarketTrend;
  marketPosition: MarketPosition;
  cyclePosition: number; // 0 to 2*PI
  momentum: number;
  history: Record<TimeRange, PricePoint[]>;
}

export interface PlayerHolding {
  assetId: string;
  quantity: number;
  averageBuyPrice: number;
  totalInvested: number;
  realizedProfit: number;
}

export interface TradeRecord {
  id: string;
  assetId: string;
  assetName: string;
  type: 'BUY' | 'SELL';
  quantity: number;
  pricePerUnit: number;
  totalAmount: number;
  profit?: number;
  returnPercentage?: number;
  timestamp: number;
}

export interface MarketNewsItem {
  id: string;
  title: string;
  description: string;
  affectedAssetId?: string;
  priceImpactPercentage?: number;
  timestamp: number;
  isPositive?: boolean;
}

export interface MarketEvent {
  id: string;
  name: string;
  description: string;
  affectedAssetIds: string[];
  multiplier: number; // Price multiplier during event (e.g. 1.25 = +25%)
  startedAt: number;
  expiresAt: number;
}

export interface TradingState {
  holdings: Record<string, PlayerHolding>;
  trades: TradeRecord[];
  watchlist: string[];
  priceAlerts: Record<string, number>; // assetId -> targetPrice
  totalInvested: number;
  totalRealizedProfit: number;
  totalWinningTrades: number;
  totalLosingTrades: number;
  lastSimulationTimestamp: number;
  activeEvents: MarketEvent[];
  news: MarketNewsItem[];
  persistedPrices: Record<string, number>;
  persistedCyclePositions: Record<string, number>;
}
