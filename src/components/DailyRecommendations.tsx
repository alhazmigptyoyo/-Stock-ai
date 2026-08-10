import React, { useState } from 'react';
import { StockData, RecommendationCategory, MarketType } from '../types';
import { Zap, TrendingUp, Landmark, ArrowUpRight, ShieldAlert, Sparkles, Target, Clock, Plus, Check, ExternalLink, ArrowUpDown, Award, SlidersHorizontal, BarChart2 } from 'lucide-react';
import { TradingViewMiniChartCard } from './TradingViewWidget';
import { useMarketData } from '../hooks/useMarketData';

interface DailyRecommendationsProps {
  dayTradingPicks: StockData[];
  swingTradingPicks: StockData[];
  longInvestmentPicks: StockData[];
  selectedMarket: MarketType | 'ALL';
  onSelectStock: (stock: StockData) => void;
  onAddToPortfolio: (stock: StockData) => void;
  portfolioSymbolList: string[];
  lastUpdatedSymbol?: string | null;
  lastTickDirection?: 'UP' | 'DOWN' | null;
  onOpenScreener?: () => void;
}

type SortOption = 'DEFAULT' | 'HIGHEST_CHANGE' | 'HIGHEST_UPSIDE' | 'INSTITUTIONAL_RECOMMENDATION';

export const DailyRecommendations: React.FC<DailyRecommendationsProps> = ({
  dayTradingPicks,
  swingTradingPicks,
  longInvestmentPicks,
  selectedMarket,
  onSelectStock,
  onAddToPortfolio,
  portfolioSymbolList,
  lastUpdatedSymbol,
  lastTickDirection,
  onOpenScreener
}) => {
  const [activeCategory, setActiveCategory] = useState<RecommendationCategory>('DAY_TRADING');
  const [sortBy, setSortBy] = useState<SortOption>('DEFAULT');
  const { getEnrichedStock, isLoading: isMarketLoading } = useMarketData();

  // Filter & Sort picks based on category, market, and chosen sort option
  const getFilteredAndSortedPicks = () => {
    let rawList: StockData[] = [];
    if (activeCategory === 'DAY_TRADING') rawList = [...dayTradingPicks];
    else if (activeCategory === 'SWING_TRADING') rawList = [...swingTradingPicks];
    else if (activeCategory === 'LONG_INVESTMENT') rawList = [...longInvestmentPicks];

    // Enrich raw stocks with central live price data
    let list: StockData[] = rawList.map(s => getEnrichedStock(s));

    if (selectedMarket !== 'ALL') {
      list = list.filter((s) => s.market === selectedMarket);
    }

    if (sortBy === 'HIGHEST_CHANGE') {
      list.sort((a, b) => b.changePercent - a.changePercent);
    } else if (sortBy === 'HIGHEST_UPSIDE') {
      list.sort((a, b) => {
        const upsideA = ((a.target1 - a.currentPrice) / a.currentPrice) * 100;
        const upsideB = ((b.target1 - b.currentPrice) / b.currentPrice) * 100;
        return upsideB - upsideA;
      });
    } else if (sortBy === 'INSTITUTIONAL_RECOMMENDATION') {
      list.sort((a, b) => {
        const scoreA = (a.consensusRating === 'STRONG_BUY' ? 100 : 50) + (a.institutionalRatings?.length || 0) * 15;
        const scoreB = (b.consensusRating === 'STRONG_BUY' ? 100 : 50) + (b.institutionalRatings?.length || 0) * 15;
        return scoreB - scoreA;
      });
    }

    return list;
  };

  const filteredPicks = getFilteredAndSortedPicks();

  const todayFullDate = new Date().toLocaleDateString('ar-SA', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="space-y-5">
      {/* Category Tabs & Sorting Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-4 space-y-3 shadow-lg">
        {/* Top Bar: Tabs & Date */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full lg:w-auto overflow-x-auto scrollbar-none pb-1 lg:pb-0">
            <button
              onClick={() => setActiveCategory('DAY_TRADING')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
                activeCategory === 'DAY_TRADING'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <Zap className="w-4 h-4 fill-current" />
              توصيات المضاربة القصيرة (سريعة - يومية)
              <span className="bg-slate-950/30 text-xs px-2 py-0.5 rounded-full font-mono">
                {dayTradingPicks.length}
              </span>
            </button>

            <button
              onClick={() => setActiveCategory('SWING_TRADING')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
                activeCategory === 'SWING_TRADING'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              توصيات المضاربة المتوسطة (Swing Trading)
              <span className="bg-slate-950/30 text-xs px-2 py-0.5 rounded-full font-mono">
                {swingTradingPicks.length}
              </span>
            </button>

            <button
              onClick={() => setActiveCategory('LONG_INVESTMENT')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
                activeCategory === 'LONG_INVESTMENT'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <Landmark className="w-4 h-4" />
              توصيات الاستثمار والقيمة طويلة الأجل
              <span className="bg-slate-950/30 text-xs px-2 py-0.5 rounded-full font-mono">
                {longInvestmentPicks.length}
              </span>
            </button>
          </div>

          <div className="text-slate-300 text-xs font-mono flex items-center gap-2 px-3 py-1.5 bg-slate-950 rounded-xl border border-slate-800 shrink-0 self-end lg:self-auto">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>جلسة اليوم: {todayFullDate}</span>
          </div>
        </div>

        {/* Sorting Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-slate-800/80 text-xs">
          <div className="flex items-center gap-2 text-slate-300 font-bold shrink-0">
            <SlidersHorizontal className="w-4 h-4 text-amber-400" />
            <span>ترتيب جدول الفرص حسب:</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
            <button
              onClick={() => setSortBy('DEFAULT')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                sortBy === 'DEFAULT'
                  ? 'bg-slate-800 text-amber-400 border border-amber-500/40 shadow'
                  : 'bg-slate-950/60 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              الافتراضي
            </button>

            <button
              onClick={() => setSortBy('HIGHEST_CHANGE')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                sortBy === 'HIGHEST_CHANGE'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/60 shadow-lg shadow-emerald-950/50'
                  : 'bg-slate-950/60 text-slate-400 border border-slate-800 hover:text-emerald-300'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              الأكثر ارتفاعاً اليوم (%)
            </button>

            <button
              onClick={() => setSortBy('HIGHEST_UPSIDE')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                sortBy === 'HIGHEST_UPSIDE'
                  ? 'bg-amber-950 text-amber-300 border border-amber-500/60 shadow-lg shadow-amber-950/50'
                  : 'bg-slate-950/60 text-slate-400 border border-slate-800 hover:text-amber-300'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5 text-amber-400" />
              أعلى عائد ربحي متوقع (Target)
            </button>

            <button
              onClick={() => setSortBy('INSTITUTIONAL_RECOMMENDATION')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                sortBy === 'INSTITUTIONAL_RECOMMENDATION'
                  ? 'bg-indigo-950 text-indigo-300 border border-indigo-500/60 shadow-lg shadow-indigo-950/50'
                  : 'bg-slate-950/60 text-slate-400 border border-slate-800 hover:text-indigo-300'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-indigo-400" />
              الأكثر توصية من المؤسسات المالية
            </button>

            {onOpenScreener && (
              <button
                onClick={onOpenScreener}
                className="px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 hover:scale-[1.02]"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 fill-slate-950" />
                <span>الفلاتر المتقدمة 🎯</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Recommended Stock Cards Grid */}
      {filteredPicks.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
          لا توجد أسهم حالياً مطابقة لهذا الفلتر المحدد. جرب اختيار سوق آخر أو تبويب مختلف.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPicks.map((stock) => {
            const isAddedToPortfolio = portfolioSymbolList.includes(stock.symbol);
            const isJustUpdated = lastUpdatedSymbol === stock.symbol;

            return (
              <div
                key={stock.symbol}
                className={`bg-slate-900 border rounded-2xl p-5 shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between space-y-4 group relative overflow-hidden ${
                  isJustUpdated
                    ? lastTickDirection === 'UP'
                      ? 'border-emerald-500 ring-2 ring-emerald-500/40 bg-emerald-950/20'
                      : 'border-rose-500 ring-2 ring-rose-500/40 bg-rose-950/20'
                    : 'border-slate-800 hover:border-amber-500/50 hover:shadow-amber-500/5'
                }`}
              >
                {/* Header Info */}
                <div>
                  <div className="flex items-center justify-between gap-3 mb-2 pb-2 border-b border-slate-800/80">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xl font-black text-white group-hover:text-amber-400 transition-colors">
                        {stock.symbol}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-semibold whitespace-nowrap">
                        {stock.market === 'SAUDI' ? '🇸🇦 تاسي' : '🇺🇸 أمريكي'}
                      </span>
                    </div>

                    <div className="text-left flex flex-col items-end shrink-0">
                      <span className="font-mono font-bold text-white text-sm sm:text-base whitespace-nowrap">
                        {stock.currency === 'SAR' ? 'ر.س ' : '$'}
                        {stock.currentPrice ? stock.currentPrice.toFixed(2) : 'جاري التحميل...'}
                      </span>
                      {stock.changePercent !== undefined ? (
                        <span
                          className={`text-xs font-mono font-bold ${
                            stock.change >= 0 ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {stock.change >= 0 ? '+' : ''}
                          {stock.changePercent.toFixed(2)}%
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500">N/A</span>
                      )}
                    </div>
                  </div>

                  <h3 className="font-bold text-slate-100 text-sm mb-0.5">{stock.nameAr}</h3>
                  <span className="text-xs text-slate-400 block mb-2">{stock.sectorAr}</span>

                  {/* Real-time TradingView Widget Card */}
                  <div className="mb-3">
                    <TradingViewMiniChartCard symbol={stock.symbol} market={stock.market} />
                  </div>

                  {/* Catalyst Box */}
                  <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 text-xs text-slate-300 space-y-1">
                    <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                      <Sparkles className="w-3.5 h-3.5" />
                      المحفز المؤسسي:
                    </div>
                    <p className="leading-relaxed text-slate-300">{stock.catalystAr}</p>
                  </div>
                </div>

                {/* Targets & Risk Management Matrix */}
                <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/60 space-y-2 text-xs">
                  <div className="grid grid-cols-2 gap-2 text-center pb-2 border-b border-slate-800/60">
                    <div className="bg-emerald-950/30 border border-emerald-800/40 rounded-lg p-1.5">
                      <span className="text-emerald-400 text-[10px] block font-medium">نطاق الدخول</span>
                      <span className="font-mono font-bold text-emerald-300 text-xs">
                        {stock.entryRangeMin} - {stock.entryRangeMax}
                      </span>
                    </div>
                    <div className="bg-rose-950/30 border border-rose-800/40 rounded-lg p-1.5">
                      <span className="text-rose-400 text-[10px] block font-medium">وقف الخسارة (SL)</span>
                      <span className="font-mono font-bold text-rose-300 text-xs">{stock.stopLoss}</span>
                    </div>
                  </div>

                  {/* Profit Targets */}
                  <div className="grid grid-cols-3 gap-1.5 text-center text-[11px] pt-1">
                    <div className="bg-slate-900 rounded p-1">
                      <span className="text-slate-400 text-[9px] block">هدف 1</span>
                      <span className="font-mono font-bold text-emerald-400">{stock.target1}</span>
                    </div>
                    <div className="bg-slate-900 rounded p-1">
                      <span className="text-slate-400 text-[9px] block">هدف 2</span>
                      <span className="font-mono font-bold text-emerald-400">{stock.target2}</span>
                    </div>
                    <div className="bg-slate-900 rounded p-1">
                      <span className="text-slate-400 text-[9px] block">هدف 3</span>
                      <span className="font-mono font-bold text-emerald-400">{stock.target3}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
                    <span>عائد / مخاطرة: <strong className="text-amber-400 font-mono">{stock.riskRewardRatio}</strong></span>
                    <span>الأفق: <strong className="text-slate-200">{stock.timeHorizonAr}</strong></span>
                  </div>
                </div>

                {/* Backing Institutions Badge Bar */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400 text-[10px]">داعمو التوصية:</span>
                    <div className="flex -space-x-1 space-x-reverse">
                      {stock.institutionalRatings.map((inst) => (
                        <span
                          key={inst.institutionId}
                          title={`${inst.institutionNameAr}: ${inst.rating}`}
                          className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 text-[9px] font-bold text-amber-400 flex items-center justify-center"
                        >
                          {inst.institutionNameAr.charAt(0)}
                        </span>
                      ))}
                    </div>
                  </div>

                  <span className="text-emerald-400 font-bold text-[11px]">
                    التوافق: {stock.consensusRating === 'STRONG_BUY' ? 'شراء قوي' : 'شراء'}
                  </span>
                </div>

                {/* Live Data Sources Links */}
                <div className="bg-slate-950/90 border border-slate-800/80 rounded-xl p-2 flex items-center justify-between text-[10px]">
                  <span className="text-slate-400 font-medium flex items-center gap-1">
                    <ExternalLink className="w-3 h-3 text-amber-400" />
                    المصدر المباشر:
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <a
                      href={
                        stock.market === 'SAUDI'
                          ? `https://app.sahmcapital.com/stock/detail?code=${stock.code || stock.symbol.replace('.SR', '')}.SA`
                          : `https://app.sahmcapital.com/stock/detail?code=${stock.symbol}`
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="px-2 py-0.5 rounded bg-emerald-950/90 hover:bg-emerald-900 border border-emerald-600/80 text-emerald-300 font-bold hover:text-emerald-200 transition-colors shadow-sm"
                    >
                      سهم كابيتال Sahm ↗
                    </a>
                    {stock.market === 'SAUDI' ? (
                      <>
                        <a
                          href={`https://www.argaam.com/ar/company/companyoverview/marketid/3/companyid/${stock.code || stock.symbol.replace('.SR','')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700/60 text-slate-300 font-semibold hover:text-white transition-colors"
                        >
                          أرقام ↗
                        </a>
                        <a
                          href="https://www.sauditadawul.com.sa"
                          target="_blank"
                          rel="noreferrer"
                          className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700/60 text-slate-300 font-semibold hover:text-white transition-colors"
                        >
                          تداول ↗
                        </a>
                        <a
                          href="https://www.alrajhi-capital.com"
                          target="_blank"
                          rel="noreferrer"
                          className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700/60 text-amber-300 font-semibold hover:text-amber-200 transition-colors"
                        >
                          الراجحي ↗
                        </a>
                      </>
                    ) : (
                      <>
                        <a
                          href={`https://finviz.com/quote.ashx?t=${stock.symbol}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2 py-0.5 rounded bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-700/60 text-cyan-300 font-bold hover:text-cyan-200 transition-colors"
                        >
                          Finviz ↗
                        </a>
                        <a
                          href={`https://finance.yahoo.com/quote/${stock.symbol}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2 py-0.5 rounded bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/60 text-indigo-300 font-bold hover:text-indigo-200 transition-colors"
                        >
                          Yahoo ↗
                        </a>
                      </>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => onSelectStock(stock)}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1 shadow-md shadow-amber-500/10"
                  >
                    <Target className="w-3.5 h-3.5" />
                    التحليل العميق
                  </button>

                  <button
                    onClick={() => onAddToPortfolio(stock)}
                    disabled={isAddedToPortfolio}
                    className={`font-semibold text-xs py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1 border ${
                      isAddedToPortfolio
                        ? 'bg-emerald-950/60 border-emerald-800/80 text-emerald-400 cursor-default'
                        : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                    }`}
                  >
                    {isAddedToPortfolio ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        بالمحفظة
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5 text-amber-400" />
                        إضافة محفظة
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
