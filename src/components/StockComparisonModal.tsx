import React from 'react';
import { StockData } from '../types';
import { 
  X, ArrowLeftRight, Check, Plus, Trophy, TrendingUp, TrendingDown, 
  Target, ShieldAlert, Sparkles, BarChart2, DollarSign, Award, Layers, Scale, Sliders
} from 'lucide-react';

interface StockComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  stock1: StockData | null;
  stock2: StockData | null;
  allStocks: StockData[];
  onSelectStock1: (stock: StockData) => void;
  onSelectStock2: (stock: StockData) => void;
  onOpenDeepAnalysis: (stock: StockData) => void;
  onAddToPortfolio: (stock: StockData) => void;
  portfolioSymbolList: string[];
}

// Helper component for compare cell with highlight feature
interface CompareCellProps {
  isWinner: boolean;
  children: React.ReactNode;
  winnerLabel?: string;
  stockType: 'stock1' | 'stock2';
  className?: string;
}

const CompareCell: React.FC<CompareCellProps> = ({
  isWinner,
  children,
  winnerLabel = 'الأفضل 🏆',
  stockType,
  className = ''
}) => {
  const defaultBg = stockType === 'stock1' ? 'bg-amber-500/5' : 'bg-cyan-500/5';

  return (
    <td
      className={`p-3.5 text-center transition-all relative ${
        isWinner
          ? 'bg-emerald-500/15 border-2 border-emerald-500/60 text-emerald-200 font-bold shadow-lg shadow-emerald-500/10'
          : defaultBg
      } ${className}`}
    >
      {isWinner && (
        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-[9px] px-2.5 py-0.5 rounded-full shadow-lg z-10 whitespace-nowrap flex items-center gap-1 border border-emerald-300">
          <Trophy className="w-2.5 h-2.5 fill-slate-950" />
          {winnerLabel}
        </span>
      )}
      <div className={isWinner ? 'pt-1.5' : ''}>
        {children}
      </div>
    </td>
  );
};

export const StockComparisonModal: React.FC<StockComparisonModalProps> = ({
  isOpen,
  onClose,
  stock1,
  stock2,
  allStocks,
  onSelectStock1,
  onSelectStock2,
  onOpenDeepAnalysis,
  onAddToPortfolio,
  portfolioSymbolList
}) => {
  if (!isOpen) return null;

  // Helper calculations for metrics
  const getUpside = (stock: StockData | null) => {
    if (!stock || !stock.currentPrice || stock.currentPrice === 0) return 0;
    return ((stock.target1 - stock.currentPrice) / stock.currentPrice) * 100;
  };

  const getFairValueUpside = (stock: StockData | null) => {
    if (!stock || !stock.currentPrice || stock.currentPrice === 0 || !stock.fundamentals?.fairValueEstimate) return 0;
    return ((stock.fundamentals.fairValueEstimate - stock.currentPrice) / stock.currentPrice) * 100;
  };

  const parseRiskReward = (rrStr?: string): number => {
    if (!rrStr) return 0;
    const parts = rrStr.split(':');
    if (parts.length === 2) {
      return parseFloat(parts[1]) || parseFloat(parts[0]) || 0;
    }
    return parseFloat(rrStr) || 0;
  };

  const getConsensusScore = (rating?: string): number => {
    if (rating === 'STRONG_BUY') return 3;
    if (rating === 'BUY') return 2;
    if (rating === 'HOLD') return 1;
    return 0;
  };

  const upside1 = getUpside(stock1);
  const upside2 = getUpside(stock2);

  const pe1 = stock1?.fundamentals?.peRatio || 0;
  const pe2 = stock2?.fundamentals?.peRatio || 0;

  const div1 = stock1?.fundamentals?.dividendYield || 0;
  const div2 = stock2?.fundamentals?.dividendYield || 0;

  const buyPress1 = stock1?.orderBook?.buyPressurePercent || 0;
  const buyPress2 = stock2?.orderBook?.buyPressurePercent || 0;

  const fvUpside1 = getFairValueUpside(stock1);
  const fvUpside2 = getFairValueUpside(stock2);

  const rr1 = parseRiskReward(stock1?.riskRewardRatio);
  const rr2 = parseRiskReward(stock2?.riskRewardRatio);

  const change1 = stock1?.changePercent || 0;
  const change2 = stock2?.changePercent || 0;

  const instCount1 = stock1?.institutionalRatings?.length || 0;
  const instCount2 = stock2?.institutionalRatings?.length || 0;

  const consensusScore1 = getConsensusScore(stock1?.consensusRating);
  const consensusScore2 = getConsensusScore(stock2?.consensusRating);

  const cap1 = stock1?.fundamentals?.marketCapBillion || 0;
  const cap2 = stock2?.fundamentals?.marketCapBillion || 0;

  // Calculate Wins for Stock 1 vs Stock 2
  let wins1 = 0;
  let wins2 = 0;

  if (stock1 && stock2) {
    if (change1 > change2) wins1++; else if (change2 > change1) wins2++;
    if (upside1 > upside2) wins1++; else if (upside2 > upside1) wins2++;
    if (rr1 > rr2) wins1++; else if (rr2 > rr1) wins2++;
    
    if (pe1 > 0 && pe2 > 0) {
      if (pe1 < pe2) wins1++; else if (pe2 < pe1) wins2++;
    } else if (pe1 > 0) wins1++; else if (pe2 > 0) wins2++;

    if (div1 > div2) wins1++; else if (div2 > div1) wins2++;
    if (fvUpside1 > fvUpside2) wins1++; else if (fvUpside2 > fvUpside1) wins2++;
    if (buyPress1 > buyPress2) wins1++; else if (buyPress2 > buyPress1) wins2++;
    if (instCount1 > instCount2) wins1++; else if (instCount2 > instCount1) wins2++;
    if (consensusScore1 > consensusScore2) wins1++; else if (consensusScore2 > consensusScore1) wins2++;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                جدول المقارنة المالي والتحليلي الجانبي (Side-by-Side Comparison)
              </h2>
              <p className="text-xs text-slate-400">
                مقارنة فورية وشاملة مع تسليط الضوء التلقائي (Highlight) على المقياس المالي الأفضل
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Stock Picker Controls */}
        <div className="bg-slate-900/90 p-4 border-b border-slate-800 shrink-0">
          <div className="grid grid-cols-1 md:grid-cols-11 gap-3 items-center">
            
            {/* Stock 1 Selector */}
            <div className="md:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl p-3">
              <label className="text-[10px] text-amber-400 font-bold block mb-1">السهم الأول (1):</label>
              <select
                value={stock1?.symbol || ''}
                onChange={(e) => {
                  const selected = allStocks.find(s => s.symbol === e.target.value);
                  if (selected) onSelectStock1(selected);
                }}
                className="w-full bg-slate-900 text-white font-bold text-sm border border-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500"
              >
                <option value="" disabled>اختر السهم الأول...</option>
                {allStocks.map((s) => (
                  <option key={s.symbol} value={s.symbol}>
                    {s.nameAr} ({s.code || s.symbol}) - {s.market === 'SAUDI' ? '🇸🇦 تاسي' : '🇺🇸 أمريكي'}
                  </option>
                ))}
              </select>
            </div>

            {/* VS Badge */}
            <div className="md:col-span-1 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shadow-lg shadow-amber-500/20 border-2 border-slate-900">
                VS
              </div>
            </div>

            {/* Stock 2 Selector */}
            <div className="md:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl p-3">
              <label className="text-[10px] text-cyan-400 font-bold block mb-1">السهم الثاني (2):</label>
              <select
                value={stock2?.symbol || ''}
                onChange={(e) => {
                  const selected = allStocks.find(s => s.symbol === e.target.value);
                  if (selected) onSelectStock2(selected);
                }}
                className="w-full bg-slate-900 text-white font-bold text-sm border border-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500"
              >
                <option value="" disabled>اختر السهم الثاني...</option>
                {allStocks.map((s) => (
                  <option key={s.symbol} value={s.symbol}>
                    {s.nameAr} ({s.code || s.symbol}) - {s.market === 'SAUDI' ? '🇸🇦 تاسي' : '🇺🇸 أمريكي'}
                  </option>
                ))}
              </select>
            </div>

          </div>
        </div>

        {/* Comparison Table Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6 scrollbar-thin">
          {(!stock1 || !stock2) ? (
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 space-y-3">
              <ArrowLeftRight className="w-10 h-10 text-amber-400 mx-auto animate-bounce" />
              <p className="font-bold text-white text-base">الرجاء اختيار سهمين من القائمة العلوية للبدء بالمقارنة الجانبية.</p>
              <p className="text-xs text-slate-400">ستعرض هذه الشاشة جدولاً شاملاً يحدد تلقائياً المعايير الفائزة والأفضل استثمارياً.</p>
            </div>
          ) : (
            <div className="space-y-6">

              {/* Overall Comparison Score Winner Banner */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 bg-gradient-to-r from-slate-950 via-slate-900/90 to-slate-950 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold shrink-0">
                    <Trophy className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-white flex items-center gap-2 flex-wrap">
                      <span>النتيجة النهائية للمقارنة:</span>
                      {wins1 > wins2 ? (
                        <span className="bg-amber-500 text-slate-950 px-2.5 py-0.5 rounded-full text-[11px] font-black shadow-md flex items-center gap-1">
                          تفوق {stock1.nameAr} في ({wins1} من أصل 9 مقاييس) 🥇
                        </span>
                      ) : wins2 > wins1 ? (
                        <span className="bg-cyan-500 text-slate-950 px-2.5 py-0.5 rounded-full text-[11px] font-black shadow-md flex items-center gap-1">
                          تفوق {stock2.nameAr} في ({wins2} من أصل 9 مقاييس) 🥇
                        </span>
                      ) : (
                        <span className="bg-slate-800 text-slate-200 px-2.5 py-0.5 rounded-full text-[11px] font-black border border-slate-700 flex items-center gap-1">
                          تعادل في الأفضلية ({wins1} مقابل {wins2}) ⚖️
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      يتم تسليط الضوء بالأخضر البارز (Highlight) على السهم المتفوق في كل مقياس مالي وتكنيكي.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono font-bold shrink-0 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                  <span className="text-amber-400">{stock1.code || stock1.symbol}: {wins1} نقاط</span>
                  <span className="text-slate-600">|</span>
                  <span className="text-cyan-400">{stock2.code || stock2.symbol}: {wins2} نقاط</span>
                </div>
              </div>

              {/* Quick Summary Winner Header Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Stock 1 Highlight Card */}
                <div className={`bg-slate-950 rounded-2xl p-4 relative overflow-hidden transition-all ${
                  wins1 > wins2 
                    ? 'border-2 border-amber-500/80 ring-2 ring-amber-500/20 shadow-xl shadow-amber-500/5' 
                    : 'border border-slate-800'
                }`}>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div>
                      <span className="text-[10px] text-amber-400 font-bold font-mono uppercase bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        {stock1.code || stock1.symbol}
                      </span>
                      <h3 className="text-base font-black text-white mt-1 flex items-center gap-1.5">
                        {stock1.nameAr}
                        {wins1 > wins2 && <span className="text-xs bg-amber-500 text-slate-950 font-black px-2 py-0.2 rounded-full">🏆 الخيار المفضل</span>}
                      </h3>
                      <p className="text-xs text-slate-400">{stock1.sectorAr}</p>
                    </div>
                    <div className="text-left">
                      <div className="text-lg font-black text-amber-300 font-mono">
                        {(stock1.currentPrice || 0).toFixed(2)} {stock1.currency === 'SAR' || stock1.market === 'SAUDI' ? 'ر.س' : '$'}
                      </div>
                      <span className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded ${
                        (stock1.changePercent || 0) >= 0 ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'
                      }`}>
                        {(stock1.changePercent || 0) >= 0 ? '+' : ''}{(stock1.changePercent || 0).toFixed(2)}%
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-center text-xs">
                    <div className={`p-2 rounded-xl border ${upside1 > upside2 ? 'bg-emerald-950/40 border-emerald-500/50' : 'bg-slate-900 border-slate-800'}`}>
                      <span className="text-[10px] text-slate-400 block">العائد المتوقع للهدف 1</span>
                      <span className="font-mono font-bold text-emerald-400">{upside1 > 0 ? `+${upside1.toFixed(1)}%` : '0%'}</span>
                    </div>
                    <div className={`p-2 rounded-xl border ${pe1 < pe2 && pe1 > 0 ? 'bg-emerald-950/40 border-emerald-500/50' : 'bg-slate-900 border-slate-800'}`}>
                      <span className="text-[10px] text-slate-400 block">مكرر الربحية P/E</span>
                      <span className="font-mono font-bold text-amber-300">{pe1 > 0 ? pe1.toFixed(1) : 'غير متاح'}</span>
                    </div>
                  </div>
                </div>

                {/* Stock 2 Highlight Card */}
                <div className={`bg-slate-950 rounded-2xl p-4 relative overflow-hidden transition-all ${
                  wins2 > wins1 
                    ? 'border-2 border-cyan-500/80 ring-2 ring-cyan-500/20 shadow-xl shadow-cyan-500/5' 
                    : 'border border-slate-800'
                }`}>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div>
                      <span className="text-[10px] text-cyan-400 font-bold font-mono uppercase bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                        {stock2.code || stock2.symbol}
                      </span>
                      <h3 className="text-base font-black text-white mt-1 flex items-center gap-1.5">
                        {stock2.nameAr}
                        {wins2 > wins1 && <span className="text-xs bg-cyan-500 text-slate-950 font-black px-2 py-0.2 rounded-full">🏆 الخيار المفضل</span>}
                      </h3>
                      <p className="text-xs text-slate-400">{stock2.sectorAr}</p>
                    </div>
                    <div className="text-left">
                      <div className="text-lg font-black text-cyan-300 font-mono">
                        {(stock2.currentPrice || 0).toFixed(2)} {stock2.currency === 'SAR' || stock2.market === 'SAUDI' ? 'ر.س' : '$'}
                      </div>
                      <span className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded ${
                        (stock2.changePercent || 0) >= 0 ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'
                      }`}>
                        {(stock2.changePercent || 0) >= 0 ? '+' : ''}{(stock2.changePercent || 0).toFixed(2)}%
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-center text-xs">
                    <div className={`p-2 rounded-xl border ${upside2 > upside1 ? 'bg-emerald-950/40 border-emerald-500/50' : 'bg-slate-900 border-slate-800'}`}>
                      <span className="text-[10px] text-slate-400 block">العائد المتوقع للهدف 1</span>
                      <span className="font-mono font-bold text-emerald-400">{upside2 > 0 ? `+${upside2.toFixed(1)}%` : '0%'}</span>
                    </div>
                    <div className={`p-2 rounded-xl border ${pe2 < pe1 && pe2 > 0 ? 'bg-emerald-950/40 border-emerald-500/50' : 'bg-slate-900 border-slate-800'}`}>
                      <span className="text-[10px] text-slate-400 block">مكرر الربحية P/E</span>
                      <span className="font-mono font-bold text-cyan-300">{pe2 > 0 ? pe2.toFixed(1) : 'غير متاح'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Detailed Side-by-Side Comparison Table with Highlight Feature */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <table className="w-full text-right border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-900 border-b border-slate-800 text-slate-300 font-bold text-xs sm:text-sm">
                      <th className="p-3.5 w-1/3">المعيار / المؤشر المالي</th>
                      <th className="p-3.5 w-1/3 text-amber-400 bg-amber-500/5 text-center">
                        {stock1.nameAr} ({stock1.code || stock1.symbol})
                      </th>
                      <th className="p-3.5 w-1/3 text-cyan-400 bg-cyan-500/5 text-center">
                        {stock2.nameAr} ({stock2.code || stock2.symbol})
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-medium">

                    {/* Section 1: Price & Entry */}
                    <tr className="bg-slate-900/60 font-bold text-amber-400">
                      <td colSpan={3} className="p-2.5 px-4 text-xs flex items-center gap-2">
                        <BarChart2 className="w-4 h-4" />
                        1. الأسعار اللحظية واستراتيجية التداول
                      </td>
                    </tr>

                    <tr>
                      <td className="p-3.5 text-slate-300 font-semibold">السعر اللحظي الحالي</td>
                      <td className="p-3.5 text-center font-mono font-bold text-white bg-amber-500/5">
                        {(stock1.currentPrice || 0).toFixed(2)} {stock1.currency === 'SAR' ? 'ر.س' : '$'}
                      </td>
                      <td className="p-3.5 text-center font-mono font-bold text-white bg-cyan-500/5">
                        {(stock2.currentPrice || 0).toFixed(2)} {stock2.currency === 'SAR' ? 'ر.س' : '$'}
                      </td>
                    </tr>

                    <tr>
                      <td className="p-3.5 text-slate-300 font-semibold">التغير اليومي %</td>
                      <CompareCell
                        stockType="stock1"
                        isWinner={change1 > change2}
                        winnerLabel="أعلى إيجابية 📈"
                      >
                        <span className={`font-mono font-bold ${change1 >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {change1 >= 0 ? '+' : ''}{change1.toFixed(2)}%
                        </span>
                      </CompareCell>

                      <CompareCell
                        stockType="stock2"
                        isWinner={change2 > change1}
                        winnerLabel="أعلى إيجابية 📈"
                      >
                        <span className={`font-mono font-bold ${change2 >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {change2 >= 0 ? '+' : ''}{change2.toFixed(2)}%
                        </span>
                      </CompareCell>
                    </tr>

                    <tr>
                      <td className="p-3.5 text-slate-300 font-semibold">نطاق الشراء والدخول الموصى به</td>
                      <td className="p-3.5 text-center font-mono text-emerald-300 bg-amber-500/5">
                        {stock1.entryRangeMin} - {stock1.entryRangeMax}
                      </td>
                      <td className="p-3.5 text-center font-mono text-emerald-300 bg-cyan-500/5">
                        {stock2.entryRangeMin} - {stock2.entryRangeMax}
                      </td>
                    </tr>

                    <tr>
                      <td className="p-3.5 text-slate-300 font-semibold">وقف الخسارة الصارم (Stop Loss)</td>
                      <td className="p-3.5 text-center font-mono text-rose-400 bg-amber-500/5">
                        {stock1.stopLoss}
                      </td>
                      <td className="p-3.5 text-center font-mono text-rose-400 bg-cyan-500/5">
                        {stock2.stopLoss}
                      </td>
                    </tr>

                    <tr>
                      <td className="p-3.5 text-slate-300 font-semibold">الهدف الأول (Target 1) والعائد المتوقع</td>
                      <CompareCell
                        stockType="stock1"
                        isWinner={upside1 > upside2}
                        winnerLabel="أعلى عائد متوقع 🎯"
                      >
                        <span className="text-emerald-400 font-bold font-mono">{stock1.target1}</span>
                        <span className="text-[11px] text-emerald-300 block font-mono font-bold mt-0.5">
                          (+{upside1.toFixed(1)}%)
                        </span>
                      </CompareCell>

                      <CompareCell
                        stockType="stock2"
                        isWinner={upside2 > upside1}
                        winnerLabel="أعلى عائد متوقع 🎯"
                      >
                        <span className="text-emerald-400 font-bold font-mono">{stock2.target1}</span>
                        <span className="text-[11px] text-emerald-300 block font-mono font-bold mt-0.5">
                          (+{upside2.toFixed(1)}%)
                        </span>
                      </CompareCell>
                    </tr>

                    <tr>
                      <td className="p-3.5 text-slate-300 font-semibold">نسبة العائد إلى المخاطرة (R/R Ratio)</td>
                      <CompareCell
                        stockType="stock1"
                        isWinner={rr1 > rr2}
                        winnerLabel="أفضل نسبة مخاطرة ⚖️"
                      >
                        <span className="font-mono text-amber-300 font-bold">{stock1.riskRewardRatio}</span>
                      </CompareCell>

                      <CompareCell
                        stockType="stock2"
                        isWinner={rr2 > rr1}
                        winnerLabel="أفضل نسبة مخاطرة ⚖️"
                      >
                        <span className="font-mono text-cyan-300 font-bold">{stock2.riskRewardRatio}</span>
                      </CompareCell>
                    </tr>

                    {/* Section 2: Fundamental Valuation */}
                    <tr className="bg-slate-900/60 font-bold text-amber-400">
                      <td colSpan={3} className="p-2.5 px-4 text-xs flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        2. المؤشرات المالية والتقييم الأساسي (Fundamentals & Valuation)
                      </td>
                    </tr>

                    <tr>
                      <td className="p-3.5 text-slate-300 font-semibold">مكرر الربحية (P/E Ratio)</td>
                      <CompareCell
                        stockType="stock1"
                        isWinner={pe1 > 0 && pe2 > 0 ? pe1 < pe2 : pe1 > 0}
                        winnerLabel="تقييم أرخص 💎"
                      >
                        {pe1 > 0 ? (
                          <span className="font-bold font-mono text-slate-200">{pe1.toFixed(2)}x</span>
                        ) : 'غير متاح'}
                      </CompareCell>

                      <CompareCell
                        stockType="stock2"
                        isWinner={pe1 > 0 && pe2 > 0 ? pe2 < pe1 : pe2 > 0}
                        winnerLabel="تقييم أرخص 💎"
                      >
                        {pe2 > 0 ? (
                          <span className="font-bold font-mono text-slate-200">{pe2.toFixed(2)}x</span>
                        ) : 'غير متاح'}
                      </CompareCell>
                    </tr>

                    <tr>
                      <td className="p-3.5 text-slate-300 font-semibold">عائد التوزيعات النقدية (Dividend Yield)</td>
                      <CompareCell
                        stockType="stock1"
                        isWinner={div1 > div2}
                        winnerLabel="عائد توزيعات أعلى 💰"
                      >
                        <span className="font-bold font-mono text-amber-300">{(div1 || 0).toFixed(2)}%</span>
                      </CompareCell>

                      <CompareCell
                        stockType="stock2"
                        isWinner={div2 > div1}
                        winnerLabel="عائد توزيعات أعلى 💰"
                      >
                        <span className="font-bold font-mono text-cyan-300">{(div2 || 0).toFixed(2)}%</span>
                      </CompareCell>
                    </tr>

                    <tr>
                      <td className="p-3.5 text-slate-300 font-semibold">القيمة العادلة المتوقعة (Fair Value)</td>
                      <CompareCell
                        stockType="stock1"
                        isWinner={fvUpside1 > fvUpside2}
                        winnerLabel="خصم أكبر للقيمة العادلة 📈"
                      >
                        <span className="font-bold font-mono text-emerald-400">{stock1.fundamentals?.fairValueEstimate || '-'}</span>
                        <span className="text-[11px] text-slate-300 block font-mono font-bold mt-0.5">
                          ({fvUpside1 > 0 ? `+${fvUpside1.toFixed(1)}%` : '0%'})
                        </span>
                      </CompareCell>

                      <CompareCell
                        stockType="stock2"
                        isWinner={fvUpside2 > fvUpside1}
                        winnerLabel="خصم أكبر للقيمة العادلة 📈"
                      >
                        <span className="font-bold font-mono text-emerald-400">{stock2.fundamentals?.fairValueEstimate || '-'}</span>
                        <span className="text-[11px] text-slate-300 block font-mono font-bold mt-0.5">
                          ({fvUpside2 > 0 ? `+${fvUpside2.toFixed(1)}%` : '0%'})
                        </span>
                      </CompareCell>
                    </tr>

                    <tr>
                      <td className="p-3.5 text-slate-300 font-semibold">القيمة السوقية (Market Cap)</td>
                      <CompareCell
                        stockType="stock1"
                        isWinner={cap1 > cap2}
                        winnerLabel="أكبر حجماً وثباتاً 🏛️"
                      >
                        <span className="font-mono font-bold text-slate-200">
                          {cap1 ? `${cap1} مليار` : '-'}
                        </span>
                      </CompareCell>

                      <CompareCell
                        stockType="stock2"
                        isWinner={cap2 > cap1}
                        winnerLabel="أكبر حجماً وثباتاً 🏛️"
                      >
                        <span className="font-mono font-bold text-slate-200">
                          {cap2 ? `${cap2} مليار` : '-'}
                        </span>
                      </CompareCell>
                    </tr>

                    {/* Section 3: Technical & Orderbook */}
                    <tr className="bg-slate-900/60 font-bold text-amber-400">
                      <td colSpan={3} className="p-2.5 px-4 text-xs flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        3. التحليل الفني وعمق تدفقات السيولة (Technical & Liquidity)
                      </td>
                    </tr>

                    <tr>
                      <td className="p-3.5 text-slate-300 font-semibold">مؤشر القوة النسبية (RSI 14)</td>
                      <td className="p-3.5 text-center font-mono bg-amber-500/5">
                        <span className="font-bold text-slate-200">{stock1.technicals?.rsi14 || '-'}</span>
                      </td>
                      <td className="p-3.5 text-center font-mono bg-cyan-500/5">
                        <span className="font-bold text-slate-200">{stock2.technicals?.rsi14 || '-'}</span>
                      </td>
                    </tr>

                    <tr>
                      <td className="p-3.5 text-slate-300 font-semibold">مؤشر MACD والزخم</td>
                      <CompareCell
                        stockType="stock1"
                        isWinner={stock1.technicals?.macdStatus === 'BULLISH_CROSS' && stock2.technicals?.macdStatus !== 'BULLISH_CROSS'}
                        winnerLabel="تقاطع إيجابي 🟢"
                      >
                        <span className="font-mono text-emerald-400 font-bold">
                          {stock1.technicals?.macdStatus === 'BULLISH_CROSS' ? 'تقاطع إيجابي صاعد 🟢' : 'محايد ⚪'}
                        </span>
                      </CompareCell>

                      <CompareCell
                        stockType="stock2"
                        isWinner={stock2.technicals?.macdStatus === 'BULLISH_CROSS' && stock1.technicals?.macdStatus !== 'BULLISH_CROSS'}
                        winnerLabel="تقاطع إيجابي 🟢"
                      >
                        <span className="font-mono text-emerald-400 font-bold">
                          {stock2.technicals?.macdStatus === 'BULLISH_CROSS' ? 'تقاطع إيجابي صاعد 🟢' : 'محايد ⚪'}
                        </span>
                      </CompareCell>
                    </tr>

                    <tr>
                      <td className="p-3.5 text-slate-300 font-semibold">ضغط الشراء اللحظي (Order Book Buy Pressure)</td>
                      <CompareCell
                        stockType="stock1"
                        isWinner={buyPress1 > buyPress2}
                        winnerLabel="سيولة شرائية أعلى 🚀"
                      >
                        <span className="font-bold font-mono text-emerald-400">{buyPress1}%</span>
                      </CompareCell>

                      <CompareCell
                        stockType="stock2"
                        isWinner={buyPress2 > buyPress1}
                        winnerLabel="سيولة شرائية أعلى 🚀"
                      >
                        <span className="font-bold font-mono text-emerald-400">{buyPress2}%</span>
                      </CompareCell>
                    </tr>

                    {/* Section 4: Institutional Consensus */}
                    <tr className="bg-slate-900/60 font-bold text-amber-400">
                      <td colSpan={3} className="p-2.5 px-4 text-xs flex items-center gap-2">
                        <Award className="w-4 h-4" />
                        4. إجماع المؤسسات المالية العالمية (Institutional Consensus)
                      </td>
                    </tr>

                    <tr>
                      <td className="p-3.5 text-slate-300 font-semibold">تقييم الإجماع المؤسسي</td>
                      <CompareCell
                        stockType="stock1"
                        isWinner={consensusScore1 > consensusScore2}
                        winnerLabel="توصية أقوى 🌟"
                      >
                        <span className="bg-emerald-950 text-emerald-400 border border-emerald-700/60 px-2.5 py-1 rounded-lg font-bold">
                          {stock1.consensusRating === 'STRONG_BUY' ? 'شراء قوي جداً' : 'شراء'}
                        </span>
                      </CompareCell>

                      <CompareCell
                        stockType="stock2"
                        isWinner={consensusScore2 > consensusScore1}
                        winnerLabel="توصية أقوى 🌟"
                      >
                        <span className="bg-emerald-950 text-emerald-400 border border-emerald-700/60 px-2.5 py-1 rounded-lg font-bold">
                          {stock2.consensusRating === 'STRONG_BUY' ? 'شراء قوي جداً' : 'شراء'}
                        </span>
                      </CompareCell>
                    </tr>

                    <tr>
                      <td className="p-3.5 text-slate-300 font-semibold">عدد المؤسسات الداعمة للتوصية</td>
                      <CompareCell
                        stockType="stock1"
                        isWinner={instCount1 > instCount2}
                        winnerLabel="دعم مؤسسي أكبر 🏦"
                      >
                        <span className="font-mono font-bold text-amber-300">
                          {instCount1} مؤسسات عالمية
                        </span>
                      </CompareCell>

                      <CompareCell
                        stockType="stock2"
                        isWinner={instCount2 > instCount1}
                        winnerLabel="دعم مؤسسي أكبر 🏦"
                      >
                        <span className="font-mono font-bold text-cyan-300">
                          {instCount2} مؤسسات عالمية
                        </span>
                      </CompareCell>
                    </tr>

                    <tr>
                      <td className="p-3.5 text-slate-300 font-semibold">المحفز الاستثماري الأساسي</td>
                      <td className="p-3.5 text-xs leading-relaxed text-slate-300 bg-amber-500/5">
                        {stock1.catalystAr}
                      </td>
                      <td className="p-3.5 text-xs leading-relaxed text-slate-300 bg-cyan-500/5">
                        {stock2.catalystAr}
                      </td>
                    </tr>

                  </tbody>
                </table>
              </div>

              {/* Bottom Action Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                
                {/* Stock 1 Actions */}
                <div className="bg-slate-950 border border-amber-500/20 p-3.5 rounded-2xl flex items-center justify-between gap-2">
                  <div className="text-xs font-bold text-slate-200">
                    إجراءات سهم <span className="text-amber-400">{stock1.nameAr}</span>:
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenDeepAnalysis(stock1)}
                      className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs py-2 px-3 rounded-xl transition-all"
                    >
                      التحليل العميق
                    </button>
                    <button
                      onClick={() => onAddToPortfolio(stock1)}
                      disabled={portfolioSymbolList.includes(stock1.symbol)}
                      className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs py-2 px-3 rounded-xl transition-all border border-slate-700"
                    >
                      {portfolioSymbolList.includes(stock1.symbol) ? 'بالمحفظة ✓' : '+ إضافة للمحفظة'}
                    </button>
                  </div>
                </div>

                {/* Stock 2 Actions */}
                <div className="bg-slate-950 border border-cyan-500/20 p-3.5 rounded-2xl flex items-center justify-between gap-2">
                  <div className="text-xs font-bold text-slate-200">
                    إجراءات سهم <span className="text-cyan-400">{stock2.nameAr}</span>:
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenDeepAnalysis(stock2)}
                      className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs py-2 px-3 rounded-xl transition-all"
                    >
                      التحليل العميق
                    </button>
                    <button
                      onClick={() => onAddToPortfolio(stock2)}
                      disabled={portfolioSymbolList.includes(stock2.symbol)}
                      className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs py-2 px-3 rounded-xl transition-all border border-slate-700"
                    >
                      {portfolioSymbolList.includes(stock2.symbol) ? 'بالمحفظة ✓' : '+ إضافة للمحفظة'}
                    </button>
                  </div>
                </div>

              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};
