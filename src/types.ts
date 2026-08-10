export type MarketType = 'US' | 'SAUDI';
export type RecommendationCategory = 'DAY_TRADING' | 'SWING_TRADING' | 'LONG_INVESTMENT';

export interface InstitutionProfile {
  id: string;
  name: string;
  nameAr: string;
  logoText: string;
  primaryColor: string;
  specialty: string;
  specialtyAr: string;
  descriptionAr: string;
  coreStrategyAr: string;
  weightInConsensus: number; // e.g. 10%
}

export interface InstitutionalRating {
  institutionId: string;
  institutionNameAr: string;
  rating: 'STRONG_BUY' | 'BUY' | 'HOLD' | 'UNDERPERFORM' | 'SELL';
  targetPrice: number;
  timeframe: string;
  keyRationalAr: string;
  confidenceScore: number; // 0 to 100
}

export interface TechnicalIndicators {
  rsi14: number;
  macdStatus: 'BULLISH_CROSS' | 'BEARISH_CROSS' | 'NEUTRAL';
  sma20: number;
  sma50: number;
  sma200: number;
  support1: number;
  support2: number;
  resistance1: number;
  resistance2: number;
  atr: number; // Average True Range
}

export interface FundamentalData {
  peRatio: number;
  forwardPE: number;
  pbRatio: number;
  pegRatio: number;
  dividendYield: number; // e.g. 3.5%
  marketCapBillion: number;
  revenueGrowthYoY: number; // percentage
  epsGrowthYoY: number;
  debtToEquity: number;
  freeCashFlowMargin: number;
  fairValueEstimate: number;
}

export interface OrderBookLevel {
  price: number;
  volume: number;
  ordersCount: number;
}

export interface OrderBookData {
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
  buyPressurePercent: number; // e.g., 62%
  sellPressurePercent: number;
  institutionalBlockTradeSignal: boolean;
}

export interface OptionsFlowData {
  putCallRatio: number;
  impliedVolatilityPercent: number;
  unusualVolumeAlert: boolean;
  bullishFlowPercent: number;
}

export interface StockData {
  symbol: string;
  code?: string; // Saudi numeric code e.g. "1120"
  name: string;
  nameAr: string;
  market: MarketType;
  currency: 'USD' | 'SAR';
  sector: string;
  sectorAr: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  dayHigh: number;
  dayLow: number;
  volume: number;
  avgVolume3M: number;
  
  // Recommendation metadata
  category: RecommendationCategory;
  entryRangeMin: number;
  entryRangeMax: number;
  stopLoss: number;
  target1: number;
  target2: number;
  target3: number;
  riskRewardRatio: string;
  timeHorizonAr: string;
  catalystAr: string;
  
  // Deep Institutional Metrics
  consensusRating: 'STRONG_BUY' | 'BUY' | 'HOLD' | 'SELL';
  consensusTargetPrice: number;
  institutionalRatings: InstitutionalRating[];
  technicals: TechnicalIndicators;
  fundamentals: FundamentalData;
  orderBook: OrderBookData;
  optionsFlow: OptionsFlowData;
  
  // Historical chart data points (30 days)
  priceHistory?: { date: string; open: number; high: number; low: number; close: number; volume: number }[];
}

export interface MarketIndex {
  symbol: string;
  name: string;
  nameAr: string;
  market: MarketType;
  value: number;
  change: number;
  changePercent: number;
  status: 'OPEN' | 'CLOSED';
}

export interface MacroIndicator {
  nameAr: string;
  value: string;
  statusAr: string;
  impactAr: string;
  trend: 'UP' | 'DOWN' | 'STABLE';
}

export interface PortfolioPosition {
  stock: StockData;
  shares: number;
  avgBuyPrice: number;
  addedDate: string;
}

export interface AiAnalysisRequest {
  symbol: string;
  market: MarketType;
  queryType?: 'FULL_REPORT' | 'DAY_TRADE_PLAN' | 'INSTITUTIONAL_DEBATE' | 'RISK_ASSESSMENT';
  customQuestion?: string;
}

export interface AiAnalysisResponse {
  symbol: string;
  stockName: string;
  overallScore: number; // 0 to 100
  executiveSummaryAr: string;
  institutionalDebate: {
    institutionId: string;
    institutionNameAr: string;
    verdictAr: string;
    targetPrice: number;
    conviction: 'HIGH' | 'MEDIUM' | 'LOW';
  }[];
  technicalSetupAr: string;
  fundamentalHealthAr: string;
  quantSignalsAr: string;
  tradePlanAr: {
    entryStrategy: string;
    stopLoss: number;
    takeProfit1: number;
    takeProfit2: number;
    riskRewardRatio: string;
  };
  macroRiskAr: string;
}
