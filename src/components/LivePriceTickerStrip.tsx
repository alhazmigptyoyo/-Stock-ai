import React from 'react';
import { useMarketData } from '../context/MarketDataContext';
import { STOCKS_DATABASE, MARKET_INDICES } from '../data/mockMarketData';
import { TrendingUp, TrendingDown, Radio, Activity } from 'lucide-react';

interface LivePriceTickerStripProps {
  onSelectStock?: (symbol: string) => void;
}

export const LivePriceTickerStrip: React.FC<LivePriceTickerStripProps> = ({ onSelectStock }) => {
  const { getPrice, indices, lastUpdated } = useMarketData();

  const activeIndices = indices && indices.length > 0 ? indices : MARKET_INDICES;

  return (
    <div className="bg-slate-950 border-b border-slate-800/90 py-2 px-3 text-xs overflow-hidden select-none flex items-center gap-3 dir-rtl shadow-md">
      {/* Live Indicator Badge */}
      <div className="flex items-center gap-1.5 bg-emerald-950/90 border border-emerald-600/60 text-emerald-300 px-2.5 py-1 rounded-lg font-bold text-[11px] flex-shrink-0 animate-pulse shadow-sm">
        <Radio className="w-3.5 h-3.5 text-emerald-400" />
        <span>تحديث أسعار تداول الحية 🔴</span>
      </div>

      {/* Marquee Row Container */}
      <div className="flex-1 overflow-x-auto no-scrollbar flex items-center gap-3 py-0.5">
        <div className="flex items-center gap-3 min-w-max">
          {/* 1. Major Market Indices */}
          {activeIndices.map((idx) => {
            const isPositive = idx.changePercent >= 0;
            return (
              <div
                key={idx.symbol}
                className="flex items-center gap-2 bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-lg px-3 py-1 flex-shrink-0 shadow-sm"
              >
                <Activity className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-bold text-slate-100 text-xs">{idx.nameAr || idx.name}</span>
                <span className="font-mono font-bold text-amber-300 text-xs dir-ltr">
                  {idx.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span
                  className={`flex items-center gap-0.5 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded dir-ltr ${
                    isPositive
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/80'
                      : 'bg-rose-950 text-rose-400 border border-rose-800/80'
                  }`}
                >
                  {isPositive ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                  <span>
                    {isPositive ? '+' : ''}
                    {idx.changePercent.toFixed(2)}%
                  </span>
                </span>
              </div>
            );
          })}

          <div className="h-4 w-[1px] bg-slate-800 mx-1 flex-shrink-0" />

          {/* 2. Individual Stocks */}
          {STOCKS_DATABASE.map((stock) => {
            const quote = getPrice(stock.symbol);
            const price = quote?.currentPrice || 0;
            const changePct = quote?.changePercent ?? 0;
            const isPositive = changePct >= 0;
            const currency = stock.currency === 'SAR' || stock.market === 'SAUDI' ? 'ر.س' : '$';

            return (
              <div
                key={stock.symbol}
                onClick={() => onSelectStock && onSelectStock(stock.symbol)}
                className="flex items-center gap-2 bg-slate-900/80 border border-slate-800/80 hover:border-amber-500/60 rounded-lg px-2.5 py-1 cursor-pointer transition-all hover:bg-slate-850 hover:scale-105 flex-shrink-0"
              >
                <span className="font-bold text-slate-200 text-xs">{stock.nameAr}</span>
                <span className="text-[10px] font-mono text-slate-400 font-medium">({stock.code || stock.symbol})</span>

                {price > 0 ? (
                  <>
                    <span className="font-mono font-bold text-amber-300 text-xs dir-ltr">
                      {price.toFixed(2)} {currency}
                    </span>

                    <span
                      className={`flex items-center gap-0.5 text-[10px] font-mono font-bold px-1.5 py-0.2 rounded dir-ltr ${
                        isPositive
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
                          : 'bg-rose-950/80 text-rose-400 border border-rose-800/60'
                      }`}
                    >
                      {isPositive ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                      <span>
                        {isPositive ? '+' : ''}
                        {changePct.toFixed(2)}%
                      </span>
                    </span>
                  </>
                ) : (
                  <span className="text-[10px] text-amber-400 font-mono font-bold animate-pulse">
                    جاري جلب السعر...
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Last Updated Timestamp */}
      {lastUpdated && (
        <span className="text-[10px] text-slate-400 font-mono flex-shrink-0 hidden lg:inline-block bg-slate-900 px-2 py-1 rounded border border-slate-800">
          تحديث: {lastUpdated}
        </span>
      )}
    </div>
  );
};

