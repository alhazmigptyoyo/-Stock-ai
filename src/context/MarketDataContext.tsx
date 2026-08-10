import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { StockData, MarketIndex, MacroIndicator } from '../types';

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
  lastUpdated: string | null;
  refreshData: () => Promise<void>;
  getPrice: (symbol: string) => MarketPriceQuote | null;
  getEnrichedStock: (stock: StockData) => StockData;
}

const MarketDataContext = createContext<MarketDataContextType | undefined>(undefined);

export const MarketDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pricesBySymbol, setPricesBySymbol] = useState<Record<string, MarketPriceQuote>>({});
  const [indices, setIndices] = useState<MarketIndex[]>([]);
  const [macro, setMacro] = useState<MacroIndicator[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchLivePrices = async () => {
    try {
      const response = await fetch('/api/live-prices');
      if (response.ok) {
        const data = await response.json();
        if (data && data.prices) {
          setPricesBySymbol(data.prices);
        }
        if (data && data.indices) {
          setIndices(data.indices);
        }
        if (data && data.macro) {
          setMacro(data.macro);
        }
        setLastUpdated(new Date().toLocaleTimeString('ar-SA'));
      }
    } catch (error) {
      console.error('Error fetching central market data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLivePrices();

    // Poll every 5 seconds for live real-time price updates
    const interval = setInterval(() => {
      fetchLivePrices();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getPrice = (symbol: string): MarketPriceQuote | null => {
    if (!symbol) return null;
    const cleanSym = symbol.toUpperCase().trim();
    return pricesBySymbol[cleanSym] || pricesBySymbol[cleanSym.replace('.SR', '')] || null;
  };

  const getEnrichedStock = (stock: StockData): StockData => {
    if (!stock) return stock;
    const liveQuote = getPrice(stock.symbol) || (stock.code ? getPrice(stock.code) : null);
    if (!liveQuote) return stock;

    return {
      ...stock,
      currentPrice: liveQuote.currentPrice,
      change: liveQuote.change,
      changePercent: liveQuote.changePercent,
      dayHigh: Math.max(stock.dayHigh || liveQuote.currentPrice, liveQuote.dayHigh),
      dayLow: Math.min(stock.dayLow || liveQuote.currentPrice, liveQuote.dayLow),
      volume: liveQuote.volume || stock.volume
    };
  };

  return (
    <MarketDataContext.Provider
      value={{
        pricesBySymbol,
        indices,
        macro,
        isLoading,
        lastUpdated,
        refreshData: fetchLivePrices,
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
