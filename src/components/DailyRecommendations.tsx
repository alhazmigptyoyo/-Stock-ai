import React, { useState } from 'react';
import { StockData, RecommendationCategory, MarketType } from '../types';
import { Zap, TrendingUp, Landmark, ArrowUpRight, ShieldAlert, Sparkles, Target, Clock, Plus, Check, ExternalLink, ArrowUpDown, Award, SlidersHorizontal, BarChart2, Scale, LayoutGrid, Table, X } from 'lucide-react';
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
  comparedStocks?: string[];
  onToggleCompareStock?: (stock: StockData) => void;
  onOpenComparisonModal?: () => void;
  onClearComparison?: () => void;
}

type SortOption = 'DEFAULT' | 'HIGHEST_CHANGE' | 'HIGHEST_UPSIDE' | 'INSTITUTIONAL_RECOMMENDATION';
type ViewMode = 'GRID' | 'TABLE';

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
  onOpenScreener,
  comparedStocks = [],
  onToggleCompareStock,
  onOpenComparisonModal,
  onClearComparison
}) => {
  const [activeCategory, setActiveCategory] = useState<RecommendationCategory>('DAY_TRADING');
  const [sortBy, setSortBy] = useState<SortOption>('DEFAULT');
  const [viewMode, setViewMode] = useState<ViewMode>('GRID');
  const { getEnrichedStock } = useMarketData();

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

  return (
    <div className="space-y-5 relative">
      {/* Category Tabs & Sorting Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-4 space-y-3 shadow-lg">
        {/* Top Bar: Tabs */}
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
              توصيات الاستثمار المتوسط (أسبوعي - شهر)
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
              توصيات النمو والتوزيعات (طويلة الأجل)
              <span className="bg-slate-950/30 text-xs px-2 py-0.5 rounded-full font-mono">
                {longInvestmentPicks.length}
              </span>
            </button>
          </div>

          {/* View Mode Switcher (Grid vs Table) */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold shrink-0 self-end lg:self-auto">
            <button
              onClick={() => setViewMode('GRID')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                viewMode === 'GRID' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              شبكة البطاقات
            </button>
            <button
              onClick={() => setViewMode('TABLE')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                viewMode === 'TABLE' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              جدول الأسهم
            </button>
          </div>
        </div>

        {/* Bottom Sorting Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-slate-800/80 text-xs">
          <div className="flex items-center gap-2 text-slate-300 font-bold shrink-0">
            <SlidersHorizontal className="w-4 h-4 text-amber-400" />
            <span>ترتيب النتائج حسب:</span>
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
              الأكثر توصية من المؤسسات
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

      {/* Floating Comparison Sticky Trigger Bar */}
      {comparedStocks.length > 0 && (
        <div className="bg-slate-900 border-2 border-amber-500/80 rounded-2xl p-3 sm:p-4 shadow-2xl backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3 animate-fade-in my-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>وضع المقارنة بين الأسهم تفاعلي</span>
                <span className="bg-amber-500 text-slate-950 font-mono text-[11px] font-black px-2 py-0.5 rounded-full">
                  {comparedStocks.length}/2 سهم
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                {comparedStocks.length === 1 
                  ? 'اختر سهماً ثانياً بالنقر على زر "مقارنة" على أي سهم، أو افتح المقارنة الآن.'
                  : 'تم اختيار سهمين بنجاح! اعرض البيانات المباشرة جنباً إلى جنب الآن.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
            <button
              onClick={onOpenComparisonModal}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs py-2 px-4 rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-1.5 flex-1 sm:flex-none"
            >
              <Scale className="w-4 h-4" />
              عرض جدول المقارنة الجانبي ⚔️
            </button>

            {onClearComparison && (
              <button
                onClick={onClearComparison}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                title="إلغاء التحديد"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Stock Content Display (Grid Mode vs Table Mode) */}
      {filteredPicks.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
          لا توجد أسهم حالياً مطابقة لهذا الفلتر المحدد. جرب اختيار سوق آخر أو تبويب مختلف.
        </div>
      ) : viewMode === 'TABLE' ? (

        /* HTML Table View */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto shadow-xl">
          <table className="w-full text-right border-collapse text-xs whitespace-nowrap">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-slate-300 font-bold text-xs">
                <th className="p-3 text-center">المقارنة</th>
                <th className="p-3">السهم والتداول</th>
                <th className="p-3">السعر اللحظي (%)</th>
                <th className="p-3 text-center">نطاق الدخول</th>
                <th className="p-3 text-center">وقف الخسارة</th>
                <th className="p-3 text-center">الهدف الأول (Target 1)</th>
                <th className="p-3 text-center">العائد/المخاطرة</th>
                <th className="p-3">المؤسسات الداعمة</th>
                <th className="p-3 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-medium">
              {filteredPicks.map((stock) => {
                const isCompared = comparedStocks.includes(stock.symbol);
                const isAddedToPortfolio = portfolioSymbolList.includes(stock.symbol);
                const upside = ((stock.target1 - stock.currentPrice) / stock.currentPrice) * 100;

                return (
                  <tr
                    key={stock.symbol}
                    className={`hover:bg-slate-800/50 transition-colors ${
                      isCompared ? 'bg-amber-500/10 border-l-4 border-l-amber-500' : ''
                    }`}
                  >
                    {/* Compare Selection Checkbox Button */}
                    <td className="p-3 text-center">
                      <button
                        onClick={() => onToggleCompareStock && onToggleCompareStock(stock)}
                        className={`p-1.5 rounded-lg text-xs font-bold transition-all border ${
                          isCompared
                            ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                            : 'bg-slate-950/80 hover:bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                        title="اختيار للمقارنة الجانبية"
                      >
                        <Scale className="w-3.5 h-3.5" />
                      </button>
                    </td>

                    {/* Stock Info */}
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                          {stock.code || stock.symbol}
                        </span>
                        <div>
                          <div className="font-bold text-white text-xs">{stock.nameAr}</div>
                          <div className="text-[10px] text-slate-400">{stock.sectorAr}</div>
                        </div>
                      </div>
                    </td>

                    {/* Live Price & Change */}
                    <td className="p-3">
                      <div className="font-mono font-bold text-amber-300 text-xs dir-ltr">
                        {(stock.currentPrice || 0).toFixed(2)} {stock.currency === 'SAR' || stock.market === 'SAUDI' ? 'ر.س' : '$'}
                      </div>
                      <span className={`text-[10px] font-mono font-bold px-1 py-0.2 rounded ${
                        (stock.changePercent || 0) >= 0 ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'
                      }`}>
                        {(stock.changePercent || 0) >= 0 ? '+' : ''}{(stock.changePercent || 0).toFixed(2)}%
                      </span>
                    </td>

                    {/* Entry Range */}
                    <td className="p-3 text-center font-mono text-emerald-300 font-bold">
                      {stock.entryRangeMin} - {stock.entryRangeMax}
                    </td>

                    {/* Stop Loss */}
                    <td className="p-3 text-center font-mono text-rose-400 font-bold">
                      {stock.stopLoss}
                    </td>

                    {/* Target 1 */}
                    <td className="p-3 text-center font-mono">
                      <span className="text-emerald-400 font-bold">{stock.target1}</span>
                      <span className="text-[10px] text-emerald-300/80 block font-sans">
                        (+{upside.toFixed(1)}%)
                      </span>
                    </td>

                    {/* Risk Reward */}
                    <td className="p-3 text-center font-mono font-bold text-amber-400">
                      {stock.riskRewardRatio}
                    </td>

                    {/* Supporting Institutions */}
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <div className="flex -space-x-1 space-x-reverse">
                          {stock.institutionalRatings?.slice(0, 3).map((inst) => (
                            <span
                              key={inst.institutionId}
                              className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 text-[9px] font-bold text-amber-400 flex items-center justify-center"
                              title={inst.institutionNameAr}
                            >
                              {inst.institutionNameAr.charAt(0)}
                            </span>
                          ))}
                        </div>
                        <span className="text-[10px] text-slate-400 font-bold">
                          ({stock.institutionalRatings?.length || 0})
                        </span>
                      </div>
                    </td>

                    {/* Action buttons */}
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onSelectStock(stock)}
                          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] py-1 px-2.5 rounded-lg transition-all"
                        >
                          تحليل
                        </button>

                        <button
                          onClick={() => onAddToPortfolio(stock)}
                          disabled={isAddedToPortfolio}
                          className={`font-semibold text-[11px] py-1 px-2.5 rounded-lg transition-all border ${
                            isAddedToPortfolio
                              ? 'bg-emerald-950/60 border-emerald-800/80 text-emerald-400'
                              : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                          }`}
                        >
                          {isAddedToPortfolio ? '✓ بالمحفظة' : '+ محفظة'}
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      ) : (

        /* Grid View Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPicks.map((stock) => {
            const isAddedToPortfolio = portfolioSymbolList.includes(stock.symbol);
            const isJustUpdated = lastUpdatedSymbol === stock.symbol;
            const isCompared = comparedStocks.includes(stock.symbol);

            return (
              <div
                key={stock.symbol}
                className={`bg-slate-900 border rounded-2xl p-5 shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between space-y-4 group relative overflow-hidden ${
                  isCompared
                    ? 'border-amber-500 ring-2 ring-amber-500/40 bg-amber-950/10'
                    : isJustUpdated
                    ? lastTickDirection === 'UP'
                      ? 'border-emerald-500 ring-2 ring-emerald-500/40 bg-emerald-950/20'
                      : 'border-rose-500 ring-2 ring-rose-500/40 bg-rose-950/20'
                    : 'border-slate-800 hover:border-amber-500/50 hover:shadow-amber-500/5'
                }`}
              >
                {/* Header Info */}
                <div>
                  <div className="flex items-center justify-between gap-3 mb-2 pb-2.5 border-b border-slate-800">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-lg font-black text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                        {stock.code || stock.symbol}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 font-semibold whitespace-nowrap">
                        {stock.market === 'SAUDI' ? '🇸🇦 تاسي' : '🇺🇸 أمريكي'}
                      </span>

                      {/* Compare Toggle Button */}
                      <button
                        onClick={() => onToggleCompareStock && onToggleCompareStock(stock)}
                        className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-all flex items-center gap-1 border ${
                          isCompared
                            ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                            : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                      >
                        <Scale className="w-3 h-3" />
                        {isCompared ? 'مقارن ✓' : 'مقارنة'}
                      </button>
                    </div>

                    <div className="text-left flex flex-col items-end shrink-0">
                      <div className="flex items-center gap-1">
                        <span className="font-mono font-black text-amber-300 text-base sm:text-lg dir-ltr">
                          {(stock.currentPrice || stock.entryRangeMin || 100).toFixed(2)}
                        </span>
                        <span className="text-xs font-bold text-amber-400/90">
                          {stock.currency === 'SAR' || stock.market === 'SAUDI' ? 'ر.س' : '$'}
                        </span>
                      </div>
                      <span
                        className={`text-xs font-mono font-bold px-1.5 py-0.2 rounded mt-0.5 flex items-center gap-0.5 ${
                          (stock.changePercent || 0) >= 0
                            ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/80'
                            : 'bg-rose-950/80 text-rose-400 border border-rose-800/80'
                        }`}
                      >
                        {(stock.changePercent || 0) >= 0 ? '+' : ''}
                        {(stock.changePercent || 0).toFixed(2)}%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-extrabold text-white text-base">{stock.nameAr}</h3>
                    <span className="text-[10px] font-mono text-slate-400">{stock.symbol}</span>
                  </div>
                  <span className="text-xs text-amber-500/80 font-medium block mb-3">{stock.sectorAr}</span>

                  {/* Real-time Live Price Display (Saudi Stocks & US Stocks) */}
                  <div className="mb-3">
                    <TradingViewMiniChartCard symbol={stock.symbol} titleAr={stock.nameAr} market={stock.market} />
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
                      {stock.institutionalRatings?.map((inst) => (
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
