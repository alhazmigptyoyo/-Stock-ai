import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import useSWR from 'swr';
import { StockData, MarketIndex, MacroIndicator } from '../types';
import { MARKET_INDICES, MACRO_INDICATORS, STOCKS_DATABASE } from '../data/mockMarketData';

export interface MarketPriceQuote {
  symbol: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  dayHigh: number;
  dayLow: number;
  volume: number;
  updatedAt: string;
}

interface MarketDataContextType {
  pricesBySymbol: Record<string, MarketPriceQuote>;
  indices: MarketIndex[];
  macro: MacroIndicator[];
  isLoading: boolean;
  isError: boolean;
  lastUpdated: string | null;
  refreshData: () => Promise<void>;
  getPrice: (symbol: string) => MarketPriceQuote | null;
  getEnrichedStock: (stock: StockData) => StockData;
}

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`خادم API غير متاح (${res.status})`);
  }
  const contentType = res.headers.get('content-type');
  if (contentType && !contentType.includes('application/json')) {
    throw new Error(`استجابة الخادم ليست ببيانات JSON (${contentType})`);
  }
  return res.json();
};

const MarketDataContext = createContext<MarketDataContextType | undefined>(undefined);

export const MarketDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // SWR automatically polls /api/live-prices every 5000 ms (5 seconds)
  const { data, error, mutate, isLoading } = useSWR('/api/live-prices', fetcher, {
    refreshInterval: 5000,
    revalidateOnFocus: true,
    dedupingInterval: 2000,
    shouldRetryOnError: true,
    errorRetryCount: 3
  });

  const isError = Boolean(error);

  useEffect(() => {
    if (error) {
      console.error('فشل جلب الأسعار المباشرة من API الخادم (/api/live-prices):', error);
    }
  }, [error]);
  const pricesBySymbol: Record<string, MarketPriceQuote> = data?.prices || {};
  const indices: MarketIndex[] = data?.indices || MARKET_INDICES;
  const macro: MacroIndicator[] = data?.macro || MACRO_INDICATORS;
  const lastUpdated: string | null = data?.timestamp
    ? new Date(data.timestamp).toLocaleTimeString('ar-SA')
    : new Date().toLocaleTimeString('ar-SA');

  const refreshData = async () => {
    await mutate();
  };

  const getPrice = (symbol: string): MarketPriceQuote | null => {
    if (!symbol) return null;
    const cleanSym = symbol.toUpperCase().trim();
    
    // Check key variations: NVDA, 2082.SR, 2082, etc.
    const quote = (
      pricesBySymbol[cleanSym] ||
      pricesBySymbol[`${cleanSym}.SR`] ||
      pricesBySymbol[cleanSym.replace('.SR', '')] ||
      null
    );

    if (quote && quote.currentPrice) {
      return quote;
    }

    // No hardcoded static fallback - return null so UI shows "جاري جلب السعر..."
    return null;
  };

  const getEnrichedStock = (stock: StockData): StockData => {
    if (!stock) return stock;
    const liveQuote = getPrice(stock.symbol) || (stock.code ? getPrice(stock.code) : null);
    
    if (!liveQuote) {
      return stock;
    }

    return {
      ...stock,
      currentPrice: liveQuote.currentPrice || stock.currentPrice,
      change: liveQuote.change ?? stock.change,
      changePercent: liveQuote.changePercent ?? stock.changePercent,
      dayHigh: liveQuote.dayHigh ?? stock.dayHigh,
      dayLow: liveQuote.dayLow ?? stock.dayLow,
      volume: liveQuote.volume ?? stock.volume
    };
  };

  return (
    <MarketDataContext.Provider
      value={{
        pricesBySymbol,
        indices,
        macro,
        isLoading,
        isError,
        lastUpdated,
        refreshData,
        getPrice,
        getEnrichedStock
      }}
    >
      {children}
    </MarketDataContext.Provider>
  );
};

export const useMarketData = () => {
  const context = useContext(MarketDataContext);
  if (!context) {
    throw new Error('useMarketData must be used within a MarketDataProvider');
  }
  return context;
};

