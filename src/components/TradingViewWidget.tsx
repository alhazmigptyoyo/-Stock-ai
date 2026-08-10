import React, { useEffect, useRef, useState } from 'react';
import { BarChart2, Activity, AlertCircle, RefreshCw, Radio, Layers, Table } from 'lucide-react';

interface TradingViewWidgetProps {
  symbol: string; // e.g., "2082.SR", "NVDA", "AAPL", "1120.SR", "2222"
  market?: string;
  height?: number;
  showTechnicalSummary?: boolean;
}

// Convert local symbol format to TradingView symbol format
export function formatTradingViewSymbol(symbol: string, market?: string): string {
  if (!symbol) return 'TADAWUL:2082';
  const cleanSymbol = symbol.trim().toUpperCase().replace('.SR', '');

  // Numeric symbols are Saudi TADAWUL stocks
  if (/^\d+$/.test(cleanSymbol) || market === 'SAUDI' || market === 'TASI') {
    return `TADAWUL:${cleanSymbol}`;
  }

  // Common US exchanges or default US NASDAQ/NYSE
  if (['AAPL', 'NVDA', 'MSFT', 'AMZN', 'GOOGL', 'TSLA', 'META', 'AMD', 'INTC', 'QQQ', 'NFLX', 'COIN', 'AVGO'].includes(cleanSymbol)) {
    return `NASDAQ:${cleanSymbol}`;
  }

  if (['PLTR', 'JPM', 'BAC', 'DIS', 'UNH', 'V', 'MA', 'SPY', 'XOM', 'CVX', 'BRK.B'].includes(cleanSymbol)) {
    return `NYSE:${cleanSymbol}`;
  }

  return cleanSymbol.includes(':') ? cleanSymbol : `NASDAQ:${cleanSymbol}`;
}

// 1. Advanced Chart Widget
export const TradingViewAdvancedChart: React.FC<TradingViewWidgetProps> = ({
  symbol,
  market = 'SAUDI',
  height = 500,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasError, setHasError] = useState(false);
  const tvSymbol = formatTradingViewSymbol(symbol, market);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    setHasError(false);
    container.innerHTML = '';

    try {
      const widgetDiv = document.createElement('div');
      widgetDiv.className = 'tradingview-widget-container__widget';
      widgetDiv.style.height = '100%';
      widgetDiv.style.width = '100%';
      container.appendChild(widgetDiv);

      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
      script.type = 'text/javascript';
      script.async = true;
      script.onerror = () => setHasError(true);
      script.innerHTML = JSON.stringify({
        autosize: true,
        symbol: tvSymbol,
        interval: 'D',
        timezone: 'Asia/Riyadh',
        theme: 'dark',
        style: '1',
        locale: 'ar_SA',
        enable_publishing: false,
        hide_side_toolbar: false,
        allow_symbol_change: true,
        calendar: false,
        studies: ['STD;RSI', 'STD;MACD', 'STD;SMA', 'STD;EMA'],
        support_host: 'https://www.tradingview.com'
      });

      container.appendChild(script);
    } catch (e) {
      console.warn('TradingView Advanced Chart error:', e);
      setHasError(true);
    }

    return () => {
      if (container) container.innerHTML = '';
    };
  }, [tvSymbol]);

  return (
    <div className="w-full bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl p-2 relative">
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900/80 border-b border-slate-800 rounded-t-xl mb-2">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-white">الرسم البياني المباشر من TradingView</span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 border border-emerald-700 text-emerald-300 font-mono font-bold">
            {tvSymbol}
          </span>
        </div>
        <span className="text-[10px] text-slate-400">بيانات لحظية مباشرة</span>
      </div>

      {hasError ? (
        <div className="flex flex-col items-center justify-center p-8 bg-slate-900/50 rounded-xl text-center space-y-2 border border-slate-800" style={{ height: `${height}px` }}>
          <AlertCircle className="w-8 h-8 text-amber-400" />
          <p className="text-xs text-slate-300 font-bold">تحميل الرسم البياني التفاعلي من TradingView ({tvSymbol})</p>
        </div>
      ) : (
        <div
          className="tradingview-widget-container rounded-xl overflow-hidden"
          ref={containerRef}
          style={{ height: `${height}px`, width: '100%' }}
        />
      )}
    </div>
  );
};

// 2. Technical Gauge Analysis Widget
export const TradingViewTechnicalGauge: React.FC<TradingViewWidgetProps> = ({
  symbol,
  market = 'SAUDI',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasError, setHasError] = useState(false);
  const tvSymbol = formatTradingViewSymbol(symbol, market);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    setHasError(false);
    container.innerHTML = '';

    try {
      const widgetDiv = document.createElement('div');
      widgetDiv.className = 'tradingview-widget-container__widget';
      container.appendChild(widgetDiv);

      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js';
      script.type = 'text/javascript';
      script.async = true;
      script.onerror = () => setHasError(true);
      script.innerHTML = JSON.stringify({
        interval: '1D',
        width: '100%',
        isTransparent: true,
        height: '420',
        symbol: tvSymbol,
        showIntervalTabs: true,
        displayMode: 'single',
        locale: 'ar_SA',
        colorTheme: 'dark'
      });

      container.appendChild(script);
    } catch (e) {
      console.warn('TradingView Technical Gauge error:', e);
      setHasError(true);
    }

    return () => {
      if (container) container.innerHTML = '';
    };
  }, [tvSymbol]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
      <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-bold text-white">مقياس التحليل الفني المباشر (TradingView Gauge)</h3>
        </div>
        <span className="text-[10px] text-slate-400 font-mono">{tvSymbol}</span>
      </div>

      {hasError ? (
        <div className="p-6 text-center text-xs text-slate-400">
          مؤشر التحليل الفني المباشر ({tvSymbol})
        </div>
      ) : (
        <div className="tradingview-widget-container" ref={containerRef} />
      )}
    </div>
  );
};

// 3. Mini Chart Overview Card Component
export const TradingViewMiniChartCard: React.FC<{ symbol: string; titleAr?: string; market?: string }> = ({
  symbol,
  titleAr,
  market = 'SAUDI',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasError, setHasError] = useState(false);
  const tvSymbol = formatTradingViewSymbol(symbol, market);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    setHasError(false);
    container.innerHTML = '';

    try {
      const widgetDiv = document.createElement('div');
      widgetDiv.className = 'tradingview-widget-container__widget';
      container.appendChild(widgetDiv);

      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js';
      script.type = 'text/javascript';
      script.async = true;
      script.onerror = () => setHasError(true);
      script.innerHTML = JSON.stringify({
        symbol: tvSymbol,
        width: '100%',
        height: '210',
        locale: 'ar_SA',
        dateRange: '1D',
        colorTheme: 'dark',
        isTransparent: true,
        autosize: false,
        largeChartUrl: ''
      });

      container.appendChild(script);
    } catch (e) {
      console.warn('TradingView Mini Chart error:', e);
      setHasError(true);
    }

    return () => {
      if (container) container.innerHTML = '';
    };
  }, [tvSymbol]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 shadow-lg hover:border-slate-700 transition-colors">
      {titleAr && (
        <div className="flex items-center justify-between px-2 pb-2 mb-1 border-b border-slate-800 text-xs font-bold text-slate-200">
          <span>{titleAr}</span>
          <span className="text-[10px] font-mono text-amber-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
            {tvSymbol}
          </span>
        </div>
      )}
      {hasError ? (
        <div className="min-h-[190px] flex items-center justify-center text-xs text-slate-400">
          بيانات TradingView المباشرة ({tvSymbol})
        </div>
      ) : (
        <div className="tradingview-widget-container min-h-[190px]" ref={containerRef} />
      )}
    </div>
  );
};

// 4. Live Stock Screener Widget Component
export const TradingViewScreener: React.FC<{ market?: 'saudi' | 'america' }> = ({ market = 'saudi' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    setHasError(false);
    container.innerHTML = '';

    try {
      const widgetDiv = document.createElement('div');
      widgetDiv.className = 'tradingview-widget-container__widget';
      container.appendChild(widgetDiv);

      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-screener.js';
      script.type = 'text/javascript';
      script.async = true;
      script.onerror = () => setHasError(true);
      script.innerHTML = JSON.stringify({
        width: '100%',
        height: '550',
        defaultColumn: 'overview',
        defaultScreen: 'most_capitalized',
        market: market,
        showToolbar: true,
        colorTheme: 'dark',
        locale: 'ar_SA',
        isTransparent: true
      });

      container.appendChild(script);
    } catch (e) {
      console.warn('TradingView Screener error:', e);
      setHasError(true);
    }

    return () => {
      if (container) container.innerHTML = '';
    };
  }, [market]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-2xl">
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Table className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-white">
            جدول الأسعار والأسهم المباشر (TradingView Live Screener - {market === 'saudi' ? 'السوق السعودي تاسي' : 'الأسواق الأمريكية'})
          </h3>
        </div>
        <span className="text-[10px] px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-800">
          تحديث فوري مباشر 🟢
        </span>
      </div>

      {hasError ? (
        <div className="p-8 text-center text-xs text-slate-400">
          جاري تحميل جدول الأسعار المباشرة من TradingView...
        </div>
      ) : (
        <div className="tradingview-widget-container min-h-[500px]" ref={containerRef} />
      )}
    </div>
  );
};

// 5. Market Overview & Quotes Widget
export const TradingViewMarketOverview: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    setHasError(false);
    container.innerHTML = '';

    try {
      const widgetDiv = document.createElement('div');
      widgetDiv.className = 'tradingview-widget-container__widget';
      container.appendChild(widgetDiv);

      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js';
      script.type = 'text/javascript';
      script.async = true;
      script.onerror = () => setHasError(true);
      script.innerHTML = JSON.stringify({
        colorTheme: 'dark',
        dateRange: '1D',
        showChart: true,
        locale: 'ar_SA',
        width: '100%',
        height: '600',
        largeChartUrl: '',
        isTransparent: true,
        showSymbolLogo: true,
        showFloatingTooltip: true,
        tabs: [
          {
            title: '🇸🇦 الأسهم السعودية (تاسي)',
            symbols: [
              { s: 'TADAWUL:2082', d: 'أكوا باور' },
              { s: 'TADAWUL:1120', d: 'مصرف الراجحي' },
              { s: 'TADAWUL:2222', d: 'أرامكو السعودية' },
              { s: 'TADAWUL:2010', d: 'سابك' },
              { s: 'TADAWUL:1180', d: 'البنك الأهلي' },
              { s: 'TADAWUL:1211', d: 'معادن' },
              { s: 'TADAWUL:7010', d: 'اس تي سي' },
              { s: 'TADAWUL:1150', d: 'مصرف الإنماء' }
            ]
          },
          {
            title: '🇺🇸 الأسهم الأمريكية',
            symbols: [
              { s: 'NASDAQ:NVDA', d: 'إنفيديا (Nvidia)' },
              { s: 'NASDAQ:AAPL', d: 'أبل (Apple)' },
              { s: 'NASDAQ:MSFT', d: 'مايكروسوفت' },
              { s: 'NASDAQ:TSLA', d: 'تسلا' },
              { s: 'NASDAQ:AMZN', d: 'أمازون' },
              { s: 'NASDAQ:GOOGL', d: 'جوجل' },
              { s: 'NASDAQ:META', d: 'ميتا' }
            ]
          },
          {
            title: '📊 المؤشرات المباشرة',
            symbols: [
              { s: 'TADAWUL:TASI', d: 'مؤشر تاسي' },
              { s: 'FOREXCOM:SPXUSD', d: 'مؤشر S&P 500' },
              { s: 'NASDAQ:IXIC', d: 'مؤشر ناسداك' },
              { s: 'TVC:UKOIL', d: 'نفط برنت' }
            ]
          }
        ]
      });

      container.appendChild(script);
    } catch (e) {
      console.warn('TradingView Market Overview error:', e);
      setHasError(true);
    }

    return () => {
      if (container) container.innerHTML = '';
    };
  }, []);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-2xl">
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-white">
            وديعة الأسعار والأسواق المباشرة من TradingView (TADAWUL & US Markets)
          </h3>
        </div>
        <span className="text-[10px] text-amber-400 font-mono font-bold bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20">
          تحديث فوري
        </span>
      </div>

      {hasError ? (
        <div className="p-8 text-center text-xs text-slate-400">
          جاري التحميل المباشر للأسعار من TradingView...
        </div>
      ) : (
        <div className="tradingview-widget-container min-h-[550px]" ref={containerRef} />
      )}
    </div>
  );
};

// 6. Real-time Ticker Tape Widget Component
export const TradingViewTickerTape: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    setHasError(false);
    container.innerHTML = '';

    try {
      const widgetDiv = document.createElement('div');
      widgetDiv.className = 'tradingview-widget-container__widget';
      container.appendChild(widgetDiv);

      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
      script.type = 'text/javascript';
      script.async = true;
      script.onerror = () => setHasError(true);
      script.innerHTML = JSON.stringify({
        symbols: [
          { proName: 'TADAWUL:2082', title: 'أكوا باور (2082)' },
          { proName: 'NASDAQ:NVDA', title: 'إنفيديا (NVDA)' },
          { proName: 'TADAWUL:2222', title: 'أرامكو (2222)' },
          { proName: 'TADAWUL:1120', title: 'الراجحي (1120)' },
          { proName: 'NASDAQ:AAPL', title: 'أبل (AAPL)' },
          { proName: 'NASDAQ:TSLA', title: 'تسلا (TSLA)' },
          { proName: 'TADAWUL:1150', title: 'الإنماء (1150)' },
          { proName: 'NASDAQ:MSFT', title: 'مايكروسوفت (MSFT)' }
        ],
        showSymbolLogo: true,
        colorTheme: 'dark',
        isTransparent: false,
        displayMode: 'adaptive',
        locale: 'ar_SA'
      });

      container.appendChild(script);
    } catch (e) {
      console.warn('TradingView Ticker Tape error:', e);
      setHasError(true);
    }

    return () => {
      if (container) container.innerHTML = '';
    };
  }, []);

  if (hasError) {
    return (
      <div className="bg-slate-950 border-b border-slate-800 py-2 px-4 text-xs text-slate-400 flex items-center gap-2 dir-rtl">
        <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
        <span>الأسعار والأسواق المباشرة (TADAWUL & US Markets)</span>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 border-b border-slate-800 py-1 overflow-hidden">
      <div className="tradingview-widget-container" ref={containerRef} />
    </div>
  );
};
