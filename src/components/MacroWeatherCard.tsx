import React from 'react';
import { MacroIndicator } from '../types';
import { Globe, TrendingUp, TrendingDown, Minus, ShieldCheck, Zap } from 'lucide-react';
import { useMarketData } from '../hooks/useMarketData';

interface MacroWeatherCardProps {
  indicators?: MacroIndicator[];
}

export const MacroWeatherCard: React.FC<MacroWeatherCardProps> = ({ indicators = [] }) => {
  const { macro: centralMacro } = useMarketData();
  const displayIndicators = indicators.length > 0 ? indicators : centralMacro;
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-amber-400" />
          <h2 className="text-sm sm:text-base font-bold text-white">
            مؤشر المناخ الاقتصادي الكلي (Bridgewater Macro Economic Weather)
          </h2>
        </div>
        <span className="text-xs text-amber-400 font-mono font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
          مناخ داعم للاستثمار
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {displayIndicators.map((ind, idx) => (
          <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200">{ind.nameAr}</span>
              {ind.trend === 'UP' && <TrendingUp className="w-4 h-4 text-emerald-400" />}
              {ind.trend === 'DOWN' && <TrendingDown className="w-4 h-4 text-amber-400" />}
              {ind.trend === 'STABLE' && <Minus className="w-4 h-4 text-sky-400" />}
            </div>

            <div className="flex items-baseline justify-between">
              <span className="text-base font-mono font-black text-amber-400">{ind.value}</span>
              <span className="text-[10px] text-slate-400">{ind.statusAr}</span>
            </div>

            <p className="text-[11px] text-slate-300 border-t border-slate-800/80 pt-1.5 leading-relaxed">
              {ind.impactAr}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
