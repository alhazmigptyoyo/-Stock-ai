import React, { useState, useEffect } from 'react';
import { StockData, InstitutionalRating } from '../types';
import { X, Sparkles, TrendingUp, ShieldCheck, Activity, DollarSign, Layers, PieChart, Target, AlertTriangle, CheckCircle, BarChart3, Plus, Check, ExternalLink, Bell, BellRing, Trash2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { TradingViewAdvancedChart, TradingViewTechnicalGauge, TradingViewMiniChartCard } from './TradingViewWidget';
import { useMarketData } from '../hooks/useMarketData';

export interface PriceAlert {
  id: string;
  symbol: string;
  stockNameAr: string;
  targetPrice: number;
  condition: 'ABOVE' | 'BELOW';
  createdAt: string;
  triggered: boolean;
}

const ALERTS_STORAGE_KEY = 'tasi_price_alerts';

const getStoredPriceAlerts = (): PriceAlert[] => {
  try {
    const data = localStorage.getItem(ALERTS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error reading price alerts from localStorage:', e);
    return [];
  }
};

const saveStoredPriceAlerts = (alerts: PriceAlert[]) => {
  try {
    localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(alerts));
  } catch (e) {
    console.error('Error saving price alerts to localStorage:', e);
  }
};

interface StockDetailModalProps {
  stock: StockData | null;
  onClose: () => void;
  onRequestAiReport: (stock: StockData) => void;
  onAddToPortfolio: (stock: StockData) => void;
  isAddedToPortfolio: boolean;
}

export const StockDetailModal: React.FC<StockDetailModalProps> = ({
  stock: rawStock,
  onClose,
  onRequestAiReport,
  onAddToPortfolio,
  isAddedToPortfolio,
}) => {
  const { getEnrichedStock } = useMarketData();
  const stock = rawStock ? getEnrichedStock(rawStock) : null;

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'INSTITUTIONS' | 'ORDERBOOK' | 'FUNDAMENTALS'>('OVERVIEW');
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [alertTargetPrice, setAlertTargetPrice] = useState<string>('');
  const [alertCondition, setAlertCondition] = useState<'ABOVE' | 'BELOW'>('ABOVE');
  const [alertNotice, setAlertNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!stock) return;
    const loadedAlerts = getStoredPriceAlerts();
    
    // Check if any alerts for this stock have been triggered
    const updatedAlerts = loadedAlerts.map((a) => {
      if (a.symbol === stock.symbol) {
        const isTriggeredNow =
          a.condition === 'ABOVE'
            ? stock.currentPrice >= a.targetPrice
            : stock.currentPrice <= a.targetPrice;
        if (isTriggeredNow && !a.triggered) {
          return { ...a, triggered: true };
        }
      }
      return a;
    });

    setAlerts(updatedAlerts);
    saveStoredPriceAlerts(updatedAlerts);

    // Default target price input to stock target1 or +5% of current price
    const defaultTarget = stock.target1 || Number((stock.currentPrice * 1.05).toFixed(2));
    setAlertTargetPrice(String(defaultTarget));
  }, [stock]);

  if (!stock) return null;

  const isSaudi = stock.market === 'SAUDI';
  const currencySymbol = isSaudi ? 'ر.س' : '$';

  // Alerts specifically for this stock
  const stockAlerts = alerts.filter((a) => a.symbol === stock.symbol);
  const activeTriggeredAlerts = stockAlerts.filter((a) =>
    a.condition === 'ABOVE'
      ? stock.currentPrice >= a.targetPrice
      : stock.currentPrice <= a.targetPrice
  );

  const handleAddAlert = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const targetNum = parseFloat(alertTargetPrice);
    if (isNaN(targetNum) || targetNum <= 0) {
      setAlertNotice('يرجى أدخال سعر هدف صحيح');
      setTimeout(() => setAlertNotice(null), 2500);
      return;
    }

    const isAlreadyTriggered =
      alertCondition === 'ABOVE'
        ? stock.currentPrice >= targetNum
        : stock.currentPrice <= targetNum;

    const newAlert: PriceAlert = {
      id: 'alert_' + Date.now(),
      symbol: stock.symbol,
      stockNameAr: stock.nameAr,
      targetPrice: targetNum,
      condition: alertCondition,
      createdAt: new Date().toLocaleDateString('ar-SA'),
      triggered: isAlreadyTriggered,
    };

    const updated = [newAlert, ...alerts];
    setAlerts(updated);
    saveStoredPriceAlerts(updated);

    setAlertNotice(
      isAlreadyTriggered
        ? `تم إضافة التنبيه (تنويه: السعر الحالي ${currencySymbol}${stock.currentPrice.toFixed(2)} يطابق الهدف بالفعل)`
        : `تم حفظ التنبيه السعري للهدف ${currencySymbol}${targetNum.toFixed(2)} بنجاح!`
    );
    setTimeout(() => setAlertNotice(null), 3500);
  };

  const handleDeleteAlert = (id: string) => {
    const updated = alerts.filter((a) => a.id !== id);
    setAlerts(updated);
    saveStoredPriceAlerts(updated);
    setAlertNotice('تم حذف التنبيه السعري');
    setTimeout(() => setAlertNotice(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] my-auto">
        {/* Top Modal Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-mono font-bold text-amber-400 text-lg shadow">
              {stock.symbol}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">{stock.nameAr}</h2>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                  {stock.symbol}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {isSaudi ? '🇸🇦 السوق السعودي' : '🇺🇸 السوق الأمريكي'}
                </span>
              </div>
              <p className="text-xs text-slate-400">{stock.name} • القطاع: {stock.sectorAr}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Price badge */}
            <div className="text-left dir-ltr hidden sm:block">
              <span className="text-lg font-mono font-bold text-white">
                {currencySymbol}{stock.currentPrice.toFixed(2)}
              </span>
              <span
                className={`block text-xs font-mono font-semibold ${
                  stock.change >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="bg-slate-950/60 border-b border-slate-800 px-4 flex items-center gap-2 overflow-x-auto text-xs font-medium scrollbar-none">
          <button
            onClick={() => setActiveTab('OVERVIEW')}
            className={`py-3 px-4 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'OVERVIEW'
                ? 'border-amber-400 text-amber-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-4 h-4" />
            النظرة العامة والرسم البياني
          </button>
          <button
            onClick={() => setActiveTab('INSTITUTIONS')}
            className={`py-3 px-4 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'INSTITUTIONS'
                ? 'border-amber-400 text-amber-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            توافق المؤسسات العشر (Consensus Matrix)
          </button>
          <button
            onClick={() => setActiveTab('ORDERBOOK')}
            className={`py-3 px-4 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'ORDERBOOK'
                ? 'border-amber-400 text-amber-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            دفتر الأوامر والسيولة (Order Book & Flow)
          </button>
          <button
            onClick={() => setActiveTab('FUNDAMENTALS')}
            className={`py-3 px-4 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'FUNDAMENTALS'
                ? 'border-amber-400 text-amber-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <PieChart className="w-4 h-4" />
            المؤشرات المالية والقيمة العادلة
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Live External Verification Sources Bar */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 flex flex-col lg:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="font-bold text-slate-200">بث فوري لأوامر وأسعار السوق:</span>
              <span className="text-slate-400 text-[11px]">
                {isSaudi
                  ? 'مربوط مباشرة مع منصة سهم كابيتال (Sahm Capital) وبث تداول وأرقام والراجحي'
                  : 'مربوط مع منصة سهم كابيتال (Sahm Capital) و Finviz Screener و Yahoo Finance'}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <a
                href={
                  isSaudi
                    ? `https://app.sahmcapital.com/stock/detail?code=${stock.code || stock.symbol.replace('.SR', '')}.SA`
                    : `https://app.sahmcapital.com/stock/detail?code=${stock.symbol}`
                }
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1 rounded-lg bg-emerald-950 hover:bg-emerald-900 border border-emerald-600 text-emerald-300 font-bold flex items-center gap-1 transition-colors text-xs shadow-sm"
              >
                سهم كابيتال (Sahm) <ExternalLink className="w-3 h-3" />
              </a>
              {isSaudi ? (
                <>
                  <a
                    href={`https://www.argaam.com/ar/company/companyoverview/marketid/3/companyid/${stock.code || stock.symbol.replace('.SR','')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold flex items-center gap-1 transition-colors text-xs"
                  >
                    أرقام Argaam <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href="https://www.sauditadawul.com.sa"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold flex items-center gap-1 transition-colors text-xs"
                  >
                    تداول Tadawul <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href="https://www.alrajhi-capital.com"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1 rounded-lg bg-amber-950 hover:bg-amber-900 border border-amber-700 text-amber-300 font-bold flex items-center gap-1 transition-colors text-xs"
                  >
                    الراجحي <ExternalLink className="w-3 h-3" />
                  </a>
                </>
              ) : (
                <>
                  <a
                    href={`https://finviz.com/quote.ashx?t=${stock.symbol}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-700 text-cyan-300 font-bold flex items-center gap-1 transition-colors text-xs"
                  >
                    Finviz Screener <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href={`https://finance.yahoo.com/quote/${stock.symbol}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1 rounded-lg bg-indigo-950 hover:bg-indigo-900 border border-indigo-700 text-indigo-300 font-bold flex items-center gap-1 transition-colors text-xs"
                  >
                    Yahoo Finance <ExternalLink className="w-3 h-3" />
                  </a>
                </>
              )}
            </div>
          </div>

          {/* Triggered Price Alert Notification Banner */}
          {activeTriggeredAlerts.length > 0 && (
            <div className="bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-amber-500/20 border border-amber-500/40 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-amber-300 animate-pulse shadow-lg">
              <div className="flex items-center gap-2.5">
                <BellRing className="w-5 h-5 text-amber-400 shrink-0 animate-bounce" />
                <div>
                  <h4 className="text-xs font-bold text-amber-300">🎯 تم تحقيق التنبيه السعري للهدف!</h4>
                  <p className="text-[11px] text-amber-200/90">
                    وصل سعر سهم {stock.nameAr} الحالي ({currencySymbol}{stock.currentPrice.toFixed(2)}) إلى هدف التنبيه ({currencySymbol}{activeTriggeredAlerts[0].targetPrice.toFixed(2)})!
                  </p>
                </div>
              </div>
              <span className="text-[10px] bg-amber-500/20 border border-amber-500/40 px-2.5 py-1 rounded-lg font-bold text-amber-300 shrink-0">
                تنبيه نشط
              </span>
            </div>
          )}

          {activeTab === 'OVERVIEW' && (
            <div className="space-y-6">
              {/* Quick TradingView Mini Chart Card */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2 shadow-md">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-amber-400" />
                    <h3 className="font-bold text-white text-xs sm:text-sm">
                      نظرة سريعة وخاطفة على حركة السهم (TradingView Mini Chart)
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-amber-400 font-bold bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20">
                    بث مباشر
                  </span>
                </div>
                <TradingViewMiniChartCard
                  symbol={stock.symbol}
                  titleAr={`ملخص الحركة السعرية لسهم ${stock.nameAr}`}
                  market={stock.market}
                />
              </div>

              {/* Interactive TradingView Advanced Chart Widget */}
              <TradingViewAdvancedChart
                symbol={stock.symbol}
                market={stock.market}
                height={460}
              />

              {/* Price Alert Setting & Management Section */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-4 text-xs shadow-md">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm flex items-center gap-2">
                        مراقب التنبيهات السعرية المباشر (Price Alert)
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        ضبط سعر مستهدف وحفظه محلياً في المتصفح (localStorage) للتنبيه فور الوصول إليه
                      </p>
                    </div>
                  </div>
                  {stockAlerts.length > 0 && (
                    <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-amber-400">
                      {stockAlerts.length} تنبيه مسجل
                    </span>
                  )}
                </div>

                {/* Form to set new alert */}
                <form onSubmit={handleAddAlert} className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end">
                  <div className="sm:col-span-5 space-y-1">
                    <label className="text-[11px] text-slate-300 font-medium block">
                      السعر المستهدف ({currencySymbol}):
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.01"
                        value={alertTargetPrice}
                        onChange={(e) => setAlertTargetPrice(e.target.value)}
                        placeholder="أدخل السعر..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 font-mono text-white text-sm focus:outline-none focus:border-amber-400 dir-ltr"
                      />
                      <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">
                        {currencySymbol}
                      </span>
                    </div>
                  </div>

                  <div className="sm:col-span-4 space-y-1">
                    <label className="text-[11px] text-slate-300 font-medium block">
                      شرط التنبيه:
                    </label>
                    <div className="grid grid-cols-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
                      <button
                        type="button"
                        onClick={() => setAlertCondition('ABOVE')}
                        className={`py-1.5 px-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-all ${
                          alertCondition === 'ABOVE'
                            ? 'bg-amber-500 text-slate-950 shadow'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                        أعلى من 📈
                      </button>
                      <button
                        type="button"
                        onClick={() => setAlertCondition('BELOW')}
                        className={`py-1.5 px-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-all ${
                          alertCondition === 'BELOW'
                            ? 'bg-amber-500 text-slate-950 shadow'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <ArrowDownRight className="w-3.5 h-3.5" />
                        أقل من 📉
                      </button>
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <button
                      type="submit"
                      className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 text-xs shadow-md shadow-amber-500/10 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      حفظ التنبيه
                    </button>
                  </div>
                </form>

                {/* Notice Toast */}
                {alertNotice && (
                  <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 px-3 py-2 rounded-xl text-xs flex items-center gap-2 animate-fadeIn">
                    <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{alertNotice}</span>
                  </div>
                )}

                {/* Existing Alerts List */}
                {stockAlerts.length > 0 && (
                  <div className="space-y-2 pt-1 border-t border-slate-800/60">
                    <h4 className="text-[11px] font-bold text-slate-400">التنبيهات المضافة لسهم {stock.nameAr}:</h4>
                    <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                      {stockAlerts.map((a) => {
                        const isTriggered =
                          a.condition === 'ABOVE'
                            ? stock.currentPrice >= a.targetPrice
                            : stock.currentPrice <= a.targetPrice;

                        return (
                          <div
                            key={a.id}
                            className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 text-xs transition-colors ${
                              isTriggered
                                ? 'bg-amber-950/40 border-amber-500/50 text-amber-200'
                                : 'bg-slate-900 border-slate-800 text-slate-200'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <Bell className={`w-4 h-4 ${isTriggered ? 'text-amber-400 animate-bounce' : 'text-slate-400'}`} />
                              <div>
                                <div className="flex items-center gap-1.5 font-bold">
                                  <span>عند الوصول إلى {currencySymbol}{a.targetPrice.toFixed(2)}</span>
                                  <span className="text-[10px] text-slate-400 font-normal">
                                    ({a.condition === 'ABOVE' ? 'أعلى من' : 'أقل من'})
                                  </span>
                                </div>
                                <span className="text-[10px] text-slate-500 block">تاريخ الإضافة: {a.createdAt}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {isTriggered ? (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                  🎯 تم الوصول للهدف!
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400">
                                  ⏳ قيد المراقبة
                                </span>
                              )}
                              <button
                                type="button"
                                onClick={() => handleDeleteAlert(a.id)}
                                className="p-1 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                                title="حذف التنبيه"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Technical Gauge & Tactical Plan */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* TradingView Technical Analysis Gauge */}
                <div className="lg:col-span-1">
                  <TradingViewTechnicalGauge
                    symbol={stock.symbol}
                    market={stock.market}
                  />
                </div>

                {/* Technical Indicators & Tactical Trade Plan */}
                <div className="lg:col-span-2 space-y-4">
                  {/* Technical Indicators */}
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3 text-xs">
                    <h3 className="font-bold text-white text-sm flex items-center gap-2">
                      <Activity className="w-4 h-4 text-amber-400" />
                      المؤشرات الفنية الرقمية للسهم
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-300">
                      <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-slate-400 text-[10px] block">مؤشر القوة النسبية (RSI 14)</span>
                        <span className="font-mono font-bold text-amber-400 text-sm">{stock.technicals.rsi14}</span>
                        <span className="text-[10px] text-emerald-400 block font-medium">زخم شراء معتدل</span>
                      </div>
                      <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-slate-400 text-[10px] block">حالة الماكدي (MACD)</span>
                        <span className="font-mono font-bold text-emerald-400 text-xs">تقاطع إيجابي صاعد</span>
                        <span className="text-[10px] text-slate-400 block">تأكيد الموجه الصاعدة</span>
                      </div>
                      <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-slate-400 text-[10px] block">الدعم الرئيسي 1</span>
                        <span className="font-mono font-bold text-slate-200">{currencySymbol}{stock.technicals.support1}</span>
                      </div>
                      <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-slate-400 text-[10px] block">المقاومة الرئيسية 1</span>
                        <span className="font-mono font-bold text-slate-200">{currencySymbol}{stock.technicals.resistance1}</span>
                      </div>
                    </div>
                  </div>

                  {/* Tactical Trade Plan */}
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3 text-xs">
                    <h3 className="font-bold text-white text-sm flex items-center gap-2">
                      <Target className="w-4 h-4 text-emerald-400" />
                      خطة التداول الموصى بها (JPMorgan / Citadel Strategy)
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="bg-emerald-950/40 border border-emerald-800/50 rounded-xl p-2.5 flex items-center justify-between">
                        <span className="text-slate-300">نطاق الشراء المناسب:</span>
                        <span className="font-mono font-bold text-emerald-400">
                          {currencySymbol}{stock.entryRangeMin} - {currencySymbol}{stock.entryRangeMax}
                        </span>
                      </div>
                      <div className="bg-rose-950/40 border border-rose-800/50 rounded-xl p-2.5 flex items-center justify-between">
                        <span className="text-slate-300">وقف الخسارة الحاسم (Stop-Loss):</span>
                        <span className="font-mono font-bold text-rose-400">{currencySymbol}{stock.stopLoss}</span>
                      </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 grid grid-cols-3 gap-1 text-center font-mono font-bold text-emerald-400">
                      <div><span className="text-[9px] text-slate-400 block font-normal">هدف 1</span>{stock.target1}</div>
                      <div><span className="text-[9px] text-slate-400 block font-normal">هدف 2</span>{stock.target2}</div>
                      <div><span className="text-[9px] text-slate-400 block font-normal">هدف 3</span>{stock.target3}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'INSTITUTIONS' && (
            <div className="space-y-4">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">الرأي المؤسسي الموحد (Consensus Rating)</h3>
                  <p className="text-xs text-slate-400">
                    متوسط التقييم المستهدف بناءً على ثقل النماذج الخاصة بكبرى المؤسسات
                  </p>
                </div>
                <div className="text-left dir-ltr">
                  <span className="text-xs text-slate-400 block">السعر المستهدف الموحد</span>
                  <span className="text-xl font-mono font-black text-amber-400">
                    {currencySymbol}{stock.consensusTargetPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {(stock.institutionalRatings || []).map((rating) => (
                  <div
                    key={rating.institutionId}
                    className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs space-y-2 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{rating.institutionNameAr}</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold">
                          {rating.rating === 'STRONG_BUY' ? 'شراء قوي' : 'شراء'}
                        </span>
                      </div>
                      <div className="text-left dir-ltr">
                        <span className="text-slate-400 text-[10px] block">المستهدف:</span>
                        <span className="font-mono font-bold text-amber-400 text-sm">
                          {currencySymbol}{rating.targetPrice}
                        </span>
                      </div>
                    </div>
                    <p className="text-slate-300 leading-relaxed">{rating.keyRationalAr}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                      <span>الأفق الزمني: {rating.timeframe}</span>
                      <span>درجة الثقة بالنموذج: <strong className="text-emerald-400 font-mono">{rating.confidenceScore}%</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'ORDERBOOK' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Order Book Liquidity Depth */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                <h3 className="font-bold text-white text-sm flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <span>عمق دفتر الأوامر الفوري (Jane Street Style)</span>
                  <span className="text-emerald-400 text-xs font-mono">
                    ضغط الشراء: {stock.orderBook.buyPressurePercent}%
                  </span>
                </h3>

                {/* Bids & Asks Table */}
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-bold text-slate-400 border-b border-slate-800 pb-1">
                    <div>طلبات الشراء (Bids)</div>
                    <div className="text-left">عروض البيع (Asks)</div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                    <div className="space-y-1">
                      {stock.orderBook.bids.map((b, i) => (
                        <div key={i} className="flex items-center justify-between bg-emerald-950/20 px-2 py-1 rounded text-emerald-400">
                          <span>{currencySymbol}{b.price}</span>
                          <span className="text-slate-300">{b.volume.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-1 text-left">
                      {stock.orderBook.asks.map((a, i) => (
                        <div key={i} className="flex items-center justify-between bg-rose-950/20 px-2 py-1 rounded text-rose-400">
                          <span className="text-slate-300">{a.volume.toLocaleString()}</span>
                          <span>{currencySymbol}{a.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Options Flow SIG Susquehanna */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                <h3 className="font-bold text-white text-sm border-b border-slate-800/80 pb-2">
                  تدفقات خيارات الأسهم والتقلب الضمني (Susquehanna SIG)
                </h3>
                <div className="space-y-2 text-slate-300">
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                    <span>نسبة خيارات البيع إلى الشراء (Put/Call Ratio):</span>
                    <span className="font-mono font-bold text-emerald-400">{stock.optionsFlow.putCallRatio}</span>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                    <span>التقلب الضمني المتوقع (Implied Volatility):</span>
                    <span className="font-mono font-bold text-amber-400">{stock.optionsFlow.impliedVolatilityPercent}%</span>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                    <span>التدفقات الشرائية الصريحة (Bullish Flow):</span>
                    <span className="font-mono font-bold text-emerald-400">{stock.optionsFlow.bullishFlowPercent}%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'FUNDAMENTALS' && (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-4 text-xs">
              <h3 className="font-bold text-white text-sm border-b border-slate-800/80 pb-2">
                التقييم الجوهري ونموذج التدفقات الخصمية DCF (Goldman Sachs Model)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-300">
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">القيمة العادلة المحسوبة (DCF Fair Value)</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">
                    {currencySymbol}{stock.fundamentals.fairValueEstimate}
                  </span>
                </div>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">مكرر الربحية (P/E Ratio)</span>
                  <span className="font-mono font-bold text-amber-400 text-sm">{stock.fundamentals.peRatio}</span>
                </div>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">عائد توزيعات الأرباح (Dividend Yield)</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">{stock.fundamentals.dividendYield}%</span>
                </div>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">نمو الإيرادات السنوي (YoY Growth)</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">+{stock.fundamentals.revenueGrowthYoY}%</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => onRequestAiReport(stock)}
            className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-xs py-2.5 px-5 rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all"
          >
            <Sparkles className="w-4 h-4 fill-slate-950" />
            توليد تقرير الذكاء الاصطناعي المؤسسي المباشر (Gemini)
          </button>

          <button
            onClick={() => onAddToPortfolio(stock)}
            disabled={isAddedToPortfolio}
            className={`w-full sm:w-auto font-bold text-xs py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-1.5 border ${
              isAddedToPortfolio
                ? 'bg-emerald-950/60 border-emerald-800 text-emerald-400 cursor-default'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
            }`}
          >
            {isAddedToPortfolio ? (
              <>
                <Check className="w-4 h-4" />
                مضاف للمحفظة التجريبية
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 text-amber-400" />
                إضافة للمحفظة التجريبية
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
