import React, { useEffect, useRef, useState } from 'react';
import { X, SlidersHorizontal, Globe, Sparkles, Filter, RefreshCw, Layers } from 'lucide-react';

interface AdvancedScreenerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMarket?: 'america' | 'saudi';
}

export const AdvancedScreenerModal: React.FC<AdvancedScreenerModalProps> = ({
  isOpen,
  onClose,
  initialMarket = 'america',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedMarket, setSelectedMarket] = useState<'america' | 'saudi'>(initialMarket);
  const [selectedScreen, setSelectedScreen] = useState<'general' | 'top_gainers' | 'most_active' | 'outperforming_3m'>('general');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const container = containerRef.current;
    if (!container) return;

    setIsLoading(true);
    container.innerHTML = '';

    try {
      const widgetDiv = document.createElement('div');
      widgetDiv.className = 'tradingview-widget-container__widget';
      widgetDiv.style.height = '100%';
      widgetDiv.style.width = '100%';
      container.appendChild(widgetDiv);

      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-screener.js';
      script.type = 'text/javascript';
      script.async = true;
      script.onload = () => setIsLoading(false);
      script.onerror = () => setIsLoading(false);

      script.innerHTML = JSON.stringify({
        width: '100%',
        height: 600,
        defaultColumn: 'overview',
        defaultScreen: selectedScreen,
        market: selectedMarket,
        showToolbar: true,
        colorTheme: 'dark',
        locale: 'ar_SA',
        isTransparent: false
      });

      container.appendChild(script);
    } catch (e) {
      console.error('TradingView Screener widget loading error:', e);
      setIsLoading(false);
    }

    return () => {
      if (container) container.innerHTML = '';
    };
  }, [isOpen, selectedMarket, selectedScreen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in dir-rtl">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">الفلاتر المتقدمة ومسح الأسهم (Stock Screener)</h2>
                <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> مباشر TradingView
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                مسح وتحليل كافة الأسهم وحجم التداول ومؤشرات السيولة والتقييمات الفنية
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters & Control Bar */}
        <div className="p-3 sm:p-4 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          
          {/* Market selector */}
          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setSelectedMarket('america')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                selectedMarket === 'america'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>الأسهم الأمريكية (US Market)</span>
            </button>

            <button
              onClick={() => setSelectedMarket('saudi')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                selectedMarket === 'saudi'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>السوق السعودي (TASI)</span>
            </button>
          </div>

          {/* Quick presets */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-slate-400 font-medium text-[11px] shrink-0">فلترة سريعة:</span>
            <button
              onClick={() => setSelectedScreen('general')}
              className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-colors shrink-0 ${
                selectedScreen === 'general'
                  ? 'bg-slate-800 border-amber-500/50 text-amber-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              جميع الأسهم
            </button>
            <button
              onClick={() => setSelectedScreen('top_gainers')}
              className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-colors shrink-0 ${
                selectedScreen === 'top_gainers'
                  ? 'bg-slate-800 border-amber-500/50 text-amber-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              الأعلى ارتفاعاً
            </button>
            <button
              onClick={() => setSelectedScreen('most_active')}
              className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-colors shrink-0 ${
                selectedScreen === 'most_active'
                  ? 'bg-slate-800 border-amber-500/50 text-amber-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              الأكثر نشاطاً وحجماً
            </button>
          </div>

        </div>

        {/* Modal Body - TradingView Screener Embed */}
        <div className="flex-1 bg-slate-950 p-2 sm:p-4 overflow-hidden relative min-h-[500px]">
          {isLoading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-950/90 text-slate-400 text-xs gap-3">
              <RefreshCw className="w-6 h-6 text-amber-400 animate-spin" />
              <span>جاري تحميل أداة مسح الأسهم المتقدمة...</span>
            </div>
          )}
          <div className="w-full h-full min-h-[520px] rounded-xl overflow-hidden border border-slate-800/80">
            <div className="tradingview-widget-container h-full w-full" ref={containerRef} />
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-amber-400" />
            <span>يمكنك الفلترة والتصفية حسب القطاع، القيمة السوقية، القيمة الدفترية، ومؤشر RSI مباشرة داخل الجدول</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg transition-colors"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
