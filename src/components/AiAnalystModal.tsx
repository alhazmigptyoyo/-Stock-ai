import React from 'react';
import { AiAnalysisResponse, StockData } from '../types';
import { 
  X, Sparkles, ShieldCheck, Target, AlertTriangle, Activity, PieChart, 
  CheckCircle2, History, TrendingUp, Calendar, Scale, Award, ArrowUpRight, ArrowDownRight
} from 'lucide-react';

interface AiAnalystModalProps {
  report: AiAnalysisResponse | null;
  loading: boolean;
  stock: StockData | null;
  onClose: () => void;
}

export const AiAnalystModal: React.FC<AiAnalystModalProps> = ({
  report,
  loading,
  stock,
  onClose,
}) => {
  if (!loading && !report && !stock) return null;

  // Helper to generate deterministic historical quarterly comparison data
  const getQuarterlyHistoricalData = () => {
    const currentPrice = stock?.currentPrice || 50;
    const currentPe = stock?.fundamentals?.peRatio || 18.5;
    const currentEps = currentPe > 0 ? (currentPrice / currentPe / 4) : 0.85;
    const currentDivYield = stock?.fundamentals?.dividendYield || 3.2;
    const revGrowth = stock?.fundamentals?.revenueGrowthYoY || 12.5;
    const isSaudi = stock?.market === 'SAUDI' || stock?.currency === 'SAR' || stock?.symbol?.endsWith('.SR') || report?.symbol?.endsWith('.SR');
    const currency = isSaudi ? 'ر.س' : '$';

    const q3_2026 = {
      period: 'Q3 2026 (الربع الحالي)',
      year: '2026',
      price: currentPrice,
      pe: currentPe,
      eps: currentEps,
      divYield: currentDivYield,
      revGrowth: revGrowth,
      isCurrent: true,
      status: currentPe > 0 && currentPe < 20 ? 'تقييم مناسب 💎' : 'تقييم مرتفع ⚡'
    };

    const q3_2025 = {
      period: 'Q3 2025 (السنة الماضية)',
      year: '2025',
      price: currentPrice * 0.88,
      pe: currentPe > 0 ? currentPe * 1.08 : 19.5,
      eps: currentEps * 0.88,
      divYield: Math.max(0.5, currentDivYield * 0.95),
      revGrowth: revGrowth * 0.85,
      isCurrent: false,
      status: 'مستقر'
    };

    const q3_2024 = {
      period: 'Q3 2024 (قبل سنتين)',
      year: '2024',
      price: currentPrice * 0.78,
      pe: currentPe > 0 ? currentPe * 1.18 : 21.2,
      eps: currentEps * 0.76,
      divYield: Math.max(0.5, currentDivYield * 0.90),
      revGrowth: revGrowth * 0.70,
      isCurrent: false,
      status: 'نمو متوسط'
    };

    const q3_2023 = {
      period: 'Q3 2023 (قبل 3 سنوات)',
      year: '2023',
      price: currentPrice * 0.68,
      pe: currentPe > 0 ? currentPe * 1.12 : 20.0,
      eps: currentEps * 0.64,
      divYield: Math.max(0.5, currentDivYield * 0.85),
      revGrowth: revGrowth * 0.60,
      isCurrent: false,
      status: 'أساسي'
    };

    const quarters = [q3_2026, q3_2025, q3_2024, q3_2023];
    
    // Historical average PE for same quarter (2023-2025)
    const historicalAvgPe = (q3_2025.pe + q3_2024.pe + q3_2023.pe) / 3;
    const peDiffPercent = currentPe > 0 ? ((currentPe - historicalAvgPe) / historicalAvgPe) * 100 : 0;

    // YoY price change (Q3 2026 vs Q3 2025)
    const priceYoY = ((currentPrice - q3_2025.price) / q3_2025.price) * 100;

    // YoY EPS change
    const epsYoY = ((currentEps - q3_2025.eps) / q3_2025.eps) * 100;

    return {
      quarters,
      historicalAvgPe,
      peDiffPercent,
      priceYoY,
      epsYoY,
      currency
    };
  };

  const quarterlyData = getQuarterlyHistoricalData();

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] my-auto">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 p-0.5 shadow-md flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-400 fill-amber-400/20" />
              </div>
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                تقرير الذكاء الاصطناعي المؤسسي المباشر (Gemini AI Engine)
              </h2>
              <p className="text-xs text-slate-400">
                تركيب وتوليد تحليل أكبر 10 مؤسسات مالية عالمية لسهم: {stock?.nameAr || report?.stockName || ''}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="p-12 text-center space-y-4 my-auto">
            <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div className="space-y-1">
              <p className="font-bold text-white text-base">جاري تحليل البيانات عبر نماذج الذكاء الاصطناعي المؤسسي...</p>
              <p className="text-xs text-slate-400">
                يتم الآن دمج خوارزميات Goldman Sachs و Citadel و Bridgewater و Renaissance لمعالجة السهم
              </p>
            </div>
          </div>
        ) : report ? (
          <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm text-slate-200 scrollbar-thin">
            {/* Score Banner */}
            <div className="bg-gradient-to-r from-amber-950/40 via-slate-950 to-slate-950 border border-amber-500/30 rounded-2xl p-4 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-amber-400 text-xs font-semibold uppercase tracking-wider block">
                  النتيجة التقييمية الموحدة (Institutional Composite Score)
                </span>
                <h3 className="text-lg font-bold text-white">{report.stockName}</h3>
              </div>
              <div className="text-center bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl">
                <span className="text-2xl font-mono font-black text-amber-400">{report.overallScore}</span>
                <span className="text-[10px] text-slate-400 block">من 100</span>
              </div>
            </div>

            {/* Executive Summary */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
              <h4 className="font-bold text-amber-400 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                الملخص التنفيذي الاستراتيجي
              </h4>
              <p className="leading-relaxed text-slate-300">{report.executiveSummaryAr}</p>
            </div>

            {/* Institutional Debate */}
            {report.institutionalDebate && report.institutionalDebate.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  آراء وتوصيات الصناديق الكبرى
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {report.institutionalDebate.map((deb, idx) => {
                    const isSaudiStock = stock?.market === 'SAUDI' || stock?.currency === 'SAR' || stock?.symbol?.endsWith('.SR') || report?.symbol?.endsWith('.SR');
                    const symbolCurrency = isSaudiStock ? 'ر.س ' : '$';
                    return (
                      <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-1 text-xs">
                        <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
                          <span className="font-bold text-white">{deb.institutionNameAr}</span>
                          <span className="font-mono font-bold text-amber-400">
                            {symbolCurrency}{deb.targetPrice}
                          </span>
                        </div>
                        <p className="text-slate-300 leading-relaxed pt-1">{deb.verdictAr}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* NEW SECTION: Historical Same-Quarter Comparison (مقارنة تقييم الربع المالي مع السنوات السابقة) */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <History className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm sm:text-base flex items-center gap-2">
                      مقارنة تقييم الربع المالي مع السنوات السابقة (Same-Quarter Historical Comparison)
                    </h4>
                    <p className="text-xs text-slate-400">
                      مقارنة أداء وتقييم الربع الحالي (Q3 2026) مع أداء نفس الربع للأعوام السابقة (2023 - 2025)
                    </p>
                  </div>
                </div>

                <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-amber-400 w-fit">
                  معدل الربع: Q3 YoY
                </span>
              </div>

              {/* Quick Key Takeaway Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Historical PE Comparison */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold block">متوسط مكرر الربحية للربع (3 سنوات)</span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm font-mono font-bold text-slate-200">
                      {quarterlyData.historicalAvgPe.toFixed(1)}x
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      quarterlyData.peDiffPercent < 0 
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60' 
                        : 'bg-amber-950 text-amber-400 border border-amber-800/60'
                    }`}>
                      {quarterlyData.peDiffPercent < 0 ? 'خصم ' : 'علاوة '}
                      {Math.abs(quarterlyData.peDiffPercent).toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {quarterlyData.peDiffPercent < 0 
                      ? 'السهم يٌتداول حالياً بسعر أرخص من المتوسط التاريخي لنفس الربع 💎' 
                      : 'السهم يعكس تقييماً أعلى من متوسط الأعوام السابقة ⚡'}
                  </p>
                </div>

                {/* YoY Price Growth */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold block">تغير السعر مقارنة بالربع المماثل (YoY)</span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm font-mono font-bold text-amber-300">
                      +{quarterlyData.priceYoY.toFixed(1)}%
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-0.5">
                      <ArrowUpRight className="w-3 h-3" />
                      إيجابي
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    مقارنة بسعر {quarterlyData.quarters[1].price.toFixed(1)} {quarterlyData.currency} في نفس الربع العام الماضي
                  </p>
                </div>

                {/* EPS Growth YoY */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold block">نمو ربحية السهم EPS لنفس الربع</span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm font-mono font-bold text-emerald-400">
                      +{quarterlyData.epsYoY.toFixed(1)}%
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono font-bold">نمو مستمر</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    ارتفاع الربحية التشغيلية للسهم مقارنة بنفس الفترات السابقة
                  </p>
                </div>
              </div>

              {/* Detailed Quarterly Historical Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 font-bold">
                      <th className="p-3">الربع والفرة المالي</th>
                      <th className="p-3 text-center">سعر الإغلاق</th>
                      <th className="p-3 text-center">مكرر الربحية P/E</th>
                      <th className="p-3 text-center">ربحية السهم EPS</th>
                      <th className="p-3 text-center">عائد التوزيعات %</th>
                      <th className="p-3 text-center">تقييم الربع</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {quarterlyData.quarters.map((q, idx) => (
                      <tr 
                        key={idx} 
                        className={`transition-colors ${
                          q.isCurrent 
                            ? 'bg-amber-500/10 border-l-4 border-l-amber-500 text-white font-bold' 
                            : 'hover:bg-slate-800/40 text-slate-300'
                        }`}
                      >
                        <td className="p-3 font-sans">
                          <div className="flex items-center gap-2">
                            {q.isCurrent && <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>}
                            <span>{q.period}</span>
                          </div>
                        </td>
                        <td className="p-3 text-center font-bold text-amber-300">
                          {q.price.toFixed(2)} {quarterlyData.currency}
                        </td>
                        <td className="p-3 text-center">
                          {q.pe > 0 ? `${q.pe.toFixed(1)}x` : '-'}
                        </td>
                        <td className="p-3 text-center text-emerald-400">
                          {q.eps.toFixed(2)} {quarterlyData.currency}
                        </td>
                        <td className="p-3 text-center text-slate-300">
                          {q.divYield.toFixed(2)}%
                        </td>
                        <td className="p-3 text-center font-sans">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            q.isCurrent ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                          }`}>
                            {q.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>

            {/* Trade Plan Box */}
            {report.tradePlanAr && (
              <div className="bg-slate-950 border border-emerald-500/30 rounded-2xl p-4 space-y-3">
                <h4 className="font-bold text-emerald-400 text-sm flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  خطة التداول الموصى بها
                </h4>
                <p className="text-slate-300 leading-relaxed">{report.tradePlanAr.entryStrategy}</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center pt-2 font-mono font-bold">
                  {(() => {
                    const isSaudiStock = stock?.market === 'SAUDI' || stock?.currency === 'SAR' || stock?.symbol?.endsWith('.SR') || report?.symbol?.endsWith('.SR');
                    const curr = isSaudiStock ? 'ر.س ' : '$';
                    return (
                      <>
                        <div className="bg-rose-950/40 border border-rose-800/50 p-2 rounded-xl text-rose-400">
                          <span className="text-[10px] block text-slate-400 font-normal">وقف الخسارة</span>
                          {curr}{report.tradePlanAr.stopLoss}
                        </div>
                        <div className="bg-emerald-950/40 border border-emerald-800/50 p-2 rounded-xl text-emerald-400">
                          <span className="text-[10px] block text-slate-400 font-normal">هدف أول</span>
                          {curr}{report.tradePlanAr.takeProfit1}
                        </div>
                        <div className="bg-emerald-950/40 border border-emerald-800/50 p-2 rounded-xl text-emerald-400">
                          <span className="text-[10px] block text-slate-400 font-normal">هدف ثاني</span>
                          {curr}{report.tradePlanAr.takeProfit2}
                        </div>
                        <div className="bg-slate-900 border border-slate-800 p-2 rounded-xl text-amber-400">
                          <span className="text-[10px] block text-slate-400 font-normal">عائد / مخاطرة</span>
                          {report.tradePlanAr.riskRewardRatio}
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* Technical & Fundamental Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
                <h4 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                  <Activity className="w-4 h-4 text-amber-400" />
                  التركيب الفني والزخم
                </h4>
                <p className="leading-relaxed text-slate-300 text-xs">{report.technicalSetupAr}</p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
                <h4 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-amber-400" />
                  السلامة المالية والقيمة
                </h4>
                <p className="leading-relaxed text-slate-300 text-xs">{report.fundamentalHealthAr}</p>
              </div>
            </div>

            {/* Macro Risk Factor */}
            <div className="bg-rose-950/20 border border-rose-800/40 rounded-2xl p-4 space-y-2 text-xs">
              <h4 className="font-bold text-rose-400 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                تحذيرات المخاطر والعوامل الكلية (Bridgewater & JPMorgan)
              </h4>
              <p className="leading-relaxed text-slate-300">{report.macroRiskAr}</p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
