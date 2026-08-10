import { useState, useEffect } from 'react';
import { StockData, MarketIndex } from '../types';

export function useLiveMarketData(initialStocks: {
  dayTrading: StockData[];
  swingTrading: StockData[];
  longInvestment: StockData[];
}) {
  const [dayTrading, setDayTrading] = useState<StockData[]>(initialStocks.dayTrading);
  const [swingTrading, setSwingTrading] = useState<StockData[]>(initialStocks.swingTrading);
  const [longInvestment, setLongInvestment] = useState<StockData[]>(initialStocks.longInvestment);
  
  const [lastUpdatedSymbol, setLastUpdatedSymbol] = useState<string | null>(null);
  const [lastTickDirection, setLastTickDirection] = useState<'UP' | 'DOWN' | null>(null);

  const [indices, setIndices] = useState<MarketIndex[]>([
    {
      symbol: 'TASI',
      name: 'Saudi Tadawul All Share Index',
      nameAr: 'مؤشر السوق السعودي (تاسي)',
      market: 'SAUDI',
      value: 12145.80,
      change: +84.20,
      changePercent: +0.70,
      status: 'OPEN'
    },
    {
      symbol: 'NOMU',
      name: 'Parallel Market Index (NOMU)',
      nameAr: 'مؤشر نمو - السوق الموازية',
      market: 'SAUDI',
      value: 26890.10,
      change: +142.50,
      changePercent: +0.53,
      status: 'OPEN'
    },
    {
      symbol: 'S&P500',
      name: 'S&P 500 Index',
      nameAr: 'مؤشر إس آند بي 500 الأمريكي',
      market: 'US',
      value: 5540.25,
      change: +32.10,
      changePercent: +0.58,
      status: 'OPEN'
    },
    {
      symbol: 'NASDAQ',
      name: 'Nasdaq Composite',
      nameAr: 'مؤشر ناسداك التكنولوجي',
      market: 'US',
      value: 17890.40,
      change: +185.30,
      changePercent: +1.05,
      status: 'OPEN'
    }
  ]);

  // Sync state if initialProps change
  useEffect(() => {
    setDayTrading(initialStocks.dayTrading);
    setSwingTrading(initialStocks.swingTrading);
    setLongInvestment(initialStocks.longInvestment);
  }, [initialStocks.dayTrading, initialStocks.swingTrading, initialStocks.longInvestment]);

  // Live Price Ticker Effect - simulates real-time trading floor fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      // Pick a random list and a random stock
      const category = Math.random() < 0.4 ? 'DAY' : Math.random() < 0.7 ? 'SWING' : 'LONG';
      const updateStockList = (list: StockData[]): StockData[] => {
        if (!list || list.length === 0) return list;
        const index = Math.floor(Math.random() * list.length);
        const stock = list[index];

        // Small realistic price tick: -0.15% to +0.15%
        const percentDelta = (Math.random() * 0.3 - 0.14) / 100;
        const priceDelta = stock.currentPrice * percentDelta;
        const newPrice = Number((stock.currentPrice + priceDelta).toFixed(2));
        const newChange = Number((stock.change + priceDelta).toFixed(2));
        const newChangePercent = Number((((newPrice - (stock.currentPrice - stock.change)) / (stock.currentPrice - stock.change)) * 100).toFixed(2));

        setLastUpdatedSymbol(stock.symbol);
        setLastTickDirection(priceDelta >= 0 ? 'UP' : 'DOWN');

        // Reset highlight after 1.2s
        setTimeout(() => setLastUpdatedSymbol(null), 1200);

        return list.map((item, idx) => {
          if (idx !== index) return item;
          return {
            ...item,
            currentPrice: newPrice,
            change: newChange,
            changePercent: newChangePercent,
            dayHigh: Math.max(item.dayHigh, newPrice),
            dayLow: Math.min(item.dayLow, newPrice)
          };
        });
      };

      if (category === 'DAY') setDayTrading(prev => updateStockList(prev));
      else if (category === 'SWING') setSwingTrading(prev => updateStockList(prev));
      else setLongInvestment(prev => updateStockList(prev));

      // Also gently tick market indices
      setIndices(prevIndices => 
        prevIndices.map(idx => {
          const delta = (Math.random() * 0.1 - 0.04) / 100;
          const valDelta = idx.value * delta;
          const newVal = Number((idx.value + valDelta).toFixed(2));
          const newChg = Number((idx.change + valDelta).toFixed(2));
          const newPct = Number((idx.changePercent + delta * 100).toFixed(2));
          return {
            ...idx,
            value: newVal,
            change: newChg,
            changePercent: newPct
          };
        })
      );
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return {
    dayTrading,
    swingTrading,
    longInvestment,
    indices,
    lastUpdatedSymbol,
    lastTickDirection
  };
}
