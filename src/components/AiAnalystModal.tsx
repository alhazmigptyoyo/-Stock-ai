import React from 'react';
import { AiAnalysisResponse, StockData } from '../types';
import { X, Sparkles, ShieldCheck, Target, AlertTriangle, Activity, PieChart, CheckCircle2 } from 'lucide-react';

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
          <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm text-slate-200">
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
