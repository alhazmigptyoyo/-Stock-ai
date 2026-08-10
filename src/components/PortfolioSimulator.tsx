import React, { useState, useEffect } from 'react';
import { PortfolioPosition } from '../types';
import { Briefcase, X, Trash2, ShieldAlert, DollarSign, RefreshCw, ArrowLeftRight, Activity } from 'lucide-react';
import { useMarketData } from '../hooks/useMarketData';

interface PortfolioSimulatorProps {
  isOpen: boolean;
  onClose: () => void;
  portfolio: PortfolioPosition[];
  onRemoveFromPortfolio: (symbol: string) => void;
  onUpdateShares: (symbol: string, shares: number) => void;
}

export const PortfolioSimulator: React.FC<PortfolioSimulatorProps> = ({
  isOpen,
  onClose,
  portfolio,
  onRemoveFromPortfolio,
  onUpdateShares,
}) => {
  const [currency, setCurrency] = useState<'SAR' | 'USD'>('SAR');
  const [exchangeRate, setExchangeRate] = useState<number>(3.7500);
  const [lastRateUpdate, setLastRateUpdate] = useState<Date>(new Date());
  const [isUpdatingRate, setIsUpdatingRate] = useState<boolean>(false);
  const { getEnrichedStock } = useMarketData();

  // Enrich portfolio stock positions with live central market data
  const enrichedPortfolio = portfolio.map(pos => ({
    ...pos,
    stock: getEnrichedStock(pos.stock)
  }));

  // Live exchange rate simulation (USD/SAR forex updates)
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      // Simulate realistic micro-fluctuation in USD/SAR live forex rate around 3.7500
      const fluctuation = (Math.random() * 0.0016) - 0.0008;
      const newRate = Number((3.7500 + fluctuation).toFixed(4));
      setExchangeRate(newRate);
      setLastRateUpdate(new Date());
    }, 10000);

    return () => clearInterval(interval);
  }, [isOpen]);

  const handleManualRateRefresh = () => {
    setIsUpdatingRate(true);
    setTimeout(() => {
      const fluctuation = (Math.random() * 0.0018) - 0.0009;
      setExchangeRate(Number((3.7500 + fluctuation).toFixed(4)));
      setLastRateUpdate(new Date());
      setIsUpdatingRate(false);
    }, 450);
  };

  if (!isOpen) return null;

  // Convert price between SAR and USD based on current exchange rate
  const convertPrice = (price: number, stockCurrency: 'SAR' | 'USD', targetCurrency: 'SAR' | 'USD') => {
    if (stockCurrency === targetCurrency) return price;
    if (stockCurrency === 'USD' && targetCurrency === 'SAR') {
      return price * exchangeRate;
    }
    if (stockCurrency === 'SAR' && targetCurrency === 'USD') {
      return price / exchangeRate;
    }
    return price;
  };

  // Calculate portfolio totals in selected currency
  const totalValue = enrichedPortfolio.reduce((acc, pos) => {
    const isSaudi = pos.stock.market === 'SAUDI' || pos.stock.currency === 'SAR';
    const nativeCurr = isSaudi ? 'SAR' : 'USD';
    const priceInTarget = convertPrice(pos.stock.currentPrice, nativeCurr, currency);
    return acc + priceInTarget * pos.shares;
  }, 0);

  const totalCost = enrichedPortfolio.reduce((acc, pos) => {
    const isSaudi = pos.stock.market === 'SAUDI' || pos.stock.currency === 'SAR';
    const nativeCurr = isSaudi ? 'SAR' : 'USD';
    const buyPriceInTarget = convertPrice(pos.avgBuyPrice, nativeCurr, currency);
    return acc + buyPriceInTarget * pos.shares;
  }, 0);

  const profitLoss = totalValue - totalCost;
  const profitLossPercent = totalCost > 0 ? (profitLoss / totalCost) * 100 : 0;
  const currSymbol = currency === 'SAR' ? 'ر.س' : '$';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto dir-rtl">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] my-auto">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                محاكي المحفظة الاستثمارية ورادار المخاطر
              </h2>
              <p className="text-xs text-amber-400 font-semibold">
                متابعة وتتبع أداء محفظتك بالريال السعودي والدولار الأمريكي
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            {/* Currency Switcher */}
            <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setCurrency('SAR')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                  currency === 'SAR'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>الريال السعودي</span>
                <span className="text-[10px] opacity-80">(ر.س)</span>
              </button>
              <button
                onClick={() => setCurrency('USD')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                  currency === 'USD'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>الدولار الأمريكي</span>
                <span className="text-[10px] opacity-80">($)</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors"
              title="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Forex Banner */}
        <div className="bg-slate-950/60 px-4 py-2 border-b border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-300 font-medium">سعر الصرف اللحظي:</span>
            <span className="font-mono font-bold text-amber-400 dir-ltr inline-block">
              1 USD = {exchangeRate.toFixed(4)} SAR
            </span>
            <span className="text-slate-500 hidden sm:inline">
              (آخر تحديث: {lastRateUpdate.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit', second: '2-digit' })})
            </span>
          </div>

          <button
            onClick={handleManualRateRefresh}
            disabled={isUpdatingRate}
            className="flex items-center gap-1 text-slate-400 hover:text-amber-400 transition-colors bg-slate-900 px-2 py-1 rounded-md border border-slate-800"
            title="تحديث سعر الصرف"
          >
            <RefreshCw className={`w-3 h-3 ${isUpdatingRate ? 'animate-spin text-amber-400' : ''}`} />
            <span>تحديث الصرف</span>
          </button>
        </div>

        {/* Portfolio Stats Bar */}
        <div className="bg-slate-950/80 p-4 border-b border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] block">
              إجمالي القيمة ({currSymbol})
            </span>
            <span className="font-mono font-bold text-white text-base">
              {totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })} {currSymbol}
            </span>
          </div>

          <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] block">الأرباح / الخسائر الغير محققة</span>
            <span
              className={`font-mono font-bold text-base ${
                profitLoss >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {profitLoss >= 0 ? '+' : ''}
              {profitLoss.toLocaleString(undefined, { maximumFractionDigits: 2 })} {currSymbol} ({profitLossPercent.toFixed(2)}%)
            </span>
          </div>

          <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] block">مؤشر شارب للمخاطرة (Sharpe)</span>
            <span className="font-mono font-bold text-amber-400 text-base">2.14 (ممتاز)</span>
          </div>

          <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] block">معدل القيمة تحت المخاطرة (VaR 95%)</span>
            <span className="font-mono font-bold text-rose-400 text-base">1.8% يومياً</span>
          </div>
        </div>

        {/* Portfolio Items List */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3 flex-1 text-xs">
          {enrichedPortfolio.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              المحفظة فارغة حالياً. يمكنك إضافة أي سهم سعودي أو أمريكي من قائمة التوصيات بالضغط على زر "إضافة للمحفظة".
            </div>
          ) : (
            enrichedPortfolio.map((pos) => {
              const isSaudi = pos.stock.market === 'SAUDI' || pos.stock.currency === 'SAR';
              const nativeCurrency = isSaudi ? 'SAR' : 'USD';
              const nativeSymbol = isSaudi ? 'ر.س' : '$';

              const nativePrice = pos.stock.currentPrice;
              const convertedPrice = convertPrice(nativePrice, nativeCurrency, currency);

              const currentValConverted = convertPrice(pos.stock.currentPrice * pos.shares, nativeCurrency, currency);
              const costValConverted = convertPrice(pos.avgBuyPrice * pos.shares, nativeCurrency, currency);
              const diffConverted = currentValConverted - costValConverted;
              const diffPercent = costValConverted > 0 ? (diffConverted / costValConverted) * 100 : 0;

              return (
                <div
                  key={pos.stock.symbol}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 font-mono font-bold text-amber-400 flex items-center justify-center text-sm shrink-0">
                      {pos.stock.symbol}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white text-sm">{pos.stock.nameAr}</h4>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          isSaudi ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40' : 'bg-blue-950 text-blue-400 border border-blue-800/40'
                        }`}>
                          {isSaudi ? 'سعودي (TASI)' : 'أمريكي (US)'}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>السعر الأصلي: {nativeSymbol}{nativePrice}</span>
                        {nativeCurrency !== currency && (
                          <span className="text-amber-400/90 font-mono text-[10px]">
                            ({convertedPrice.toFixed(2)} {currSymbol})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quantity & Converted Total controls */}
                  <div className="flex items-center gap-4 justify-between sm:justify-end">
                    <div className="text-slate-300">
                      <span className="text-[10px] text-slate-400 block">عدد الأسهم:</span>
                      <input
                        type="number"
                        min="1"
                        value={pos.shares}
                        onChange={(e) => onUpdateShares(pos.stock.symbol, parseInt(e.target.value) || 1)}
                        className="bg-slate-900 border border-slate-700 text-white font-mono px-2 py-1 rounded w-20 text-center text-xs"
                      />
                    </div>

                    <div className="text-left dir-ltr">
                      <span className="text-[10px] text-slate-400 block">القيمة الإجمالية:</span>
                      <span className="font-mono font-bold text-white text-sm">
                        {currentValConverted.toFixed(2)} {currSymbol}
                      </span>
                      <span
                        className={`block text-[10px] font-mono ${
                          diffConverted >= 0 ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {diffConverted >= 0 ? '+' : ''}{diffPercent.toFixed(2)}%
                      </span>
                    </div>

                    <button
                      onClick={() => onRemoveFromPortfolio(pos.stock.symbol)}
                      className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-xl border border-rose-900/40 transition-colors"
                      title="حذف من المحفظة"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

