import React, { useState, useEffect } from 'react';
import { Search, Sparkles, TrendingUp, Globe, Briefcase, RefreshCw, Clock, Eye, Moon, Sun, Contrast, SlidersHorizontal, Target, Settings, LayoutGrid } from 'lucide-react';
import { MarketType, StockData, MarketIndex } from '../types';
import { TradingViewTickerTape } from './TradingViewWidget';
import { useMarketData } from '../hooks/useMarketData';

interface NavbarProps {
  selectedMarket: MarketType | 'ALL';
  onSelectMarket: (market: MarketType | 'ALL') => void;
  onSelectStock: (stock: StockData) => void;
  onOpenAiTerminal: () => void;
  onOpenPortfolio: () => void;
  onOpenScreener?: () => void;
  onOpenSettings?: () => void;
  portfolioCount: number;
  liveIndices?: MarketIndex[];
  isHighContrast?: boolean;
  onToggleHighContrast?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  selectedMarket,
  onSelectMarket,
  onSelectStock,
  onOpenAiTerminal,
  onOpenPortfolio,
  onOpenScreener,
  onOpenSettings,
  portfolioCount,
  liveIndices = [],
  isHighContrast = false,
  onToggleHighContrast
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<StockData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Live session clock state
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length < 1) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/stocks?query=${encodeURIComponent(searchQuery)}&market=${selectedMarket}`);
        const data = await res.json();
        setSearchResults(data.stocks || []);
        setShowDropdown(true);
      } catch (err) {
        console.error('Search error', err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedMarket]);

  const { indices: centralIndices, isLoading: centralLoading } = useMarketData();

  // Display indices from central hook if available, or prop, or fallback
  const displayIndices = liveIndices.length > 0
    ? liveIndices
    : (centralIndices && centralIndices.length > 0
        ? centralIndices
        : []);

  const todayArabicDate = new Date().toLocaleDateString('ar-SA', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 shadow-xl">
      {/* Real-time TradingView Ticker Tape */}
      <TradingViewTickerTape />
      <div className="bg-slate-950/90 border-b border-slate-800/80 py-2 px-4 text-xs overflow-x-auto whitespace-nowrap text-slate-400 flex items-center justify-between gap-6 scrollbar-none">
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-1.5 text-amber-400 font-bold bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            جلسة تداول اليوم المباشرة
          </span>

          <div className="flex items-center gap-1.5 font-mono text-emerald-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800 text-[11px]">
            <Clock className="w-3 h-3 text-amber-400" />
            <span>{todayArabicDate} • {timeStr}</span>
          </div>

          <span className="text-slate-600 hidden sm:inline">|</span>

          {displayIndices.map((idx) => (
            <React.Fragment key={idx.symbol}>
              <span className="flex items-center gap-1.5 font-sans">
                <span className="text-slate-200 font-semibold">{idx.nameAr || idx.symbol}:</span>
                <span className={`font-mono dir-ltr font-bold ${idx.changePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {idx.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  {' '}({idx.changePercent >= 0 ? '+' : ''}{idx.changePercent.toFixed(2)}%)
                </span>
              </span>
              <span className="text-slate-700 hidden sm:inline">•</span>
            </React.Fragment>
          ))}
        </div>

        <div className="flex items-center gap-2 text-slate-400 text-[11px] hidden lg:flex">
          <a
            href="https://app.sahmcapital.com/market"
            target="_blank"
            rel="noreferrer"
            className="px-2.5 py-1 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/60 font-bold flex items-center gap-1 transition-colors shadow-sm"
          >
            سهم كابيتال (Sahm) ↗
          </a>
          <a
            href="https://finviz.com/screener.ashx"
            target="_blank"
            rel="noreferrer"
            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-800 font-bold flex items-center gap-1 transition-colors"
          >
            Finviz Screener ↗
          </a>
          <a
            href="https://www.argaam.com/ar"
            target="_blank"
            rel="noreferrer"
            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-slate-800 font-bold flex items-center gap-1 transition-colors"
          >
            أرقام / تداول ↗
          </a>
          <a
            href="https://www.alrajhi-capital.com"
            target="_blank"
            rel="noreferrer"
            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-800 font-bold flex items-center gap-1 transition-colors"
          >
            الراجحي كابيتال ↗
          </a>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-600 to-yellow-400 p-0.5 shadow-lg shadow-amber-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white tracking-tight">فرص تداول</h1>
              <span className="text-[10px] uppercase tracking-wider font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded">
                PRO 10
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              محاكاة استراتيجيات أكبر 10 مؤسسات مالية عالمية • السوق السعودي والأمريكي
            </p>
          </div>
        </div>

        {/* Market Selector Tabs */}
        <div className="hidden md:flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-medium">
          <button
            onClick={() => onSelectMarket('ALL')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              selectedMarket === 'ALL'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            الكل
          </button>
          <button
            onClick={() => onSelectMarket('SAUDI')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              selectedMarket === 'SAUDI'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="text-sm">🇸🇦</span>
            السوق السعودي (TASI)
          </button>
          <button
            onClick={() => onSelectMarket('US')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              selectedMarket === 'US'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="text-sm">🇺🇸</span>
            السوق الأمريكي (NYSE/NASDAQ)
          </button>
        </div>

        {/* Search Bar with Instant Autocomplete */}
        <div className="relative flex-1 max-w-xs sm:max-w-sm">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.trim() && setShowDropdown(true)}
              placeholder="ابحث عن سهم (مثال: 1120, NVDA, أرامكو)..."
              className="w-full bg-slate-950 border border-slate-800 text-slate-100 text-xs rounded-xl pr-9 pl-8 py-2 focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/50 transition-all placeholder:text-slate-500"
            />
            {isSearching && (
              <RefreshCw className="w-3.5 h-3.5 text-amber-400 absolute left-3 top-1/2 -translate-y-1/2 animate-spin" />
            )}
          </div>

          {/* Search Dropdown */}
          {showDropdown && searchResults.length > 0 && (
            <div className="absolute top-full mt-2 left-0 right-0 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-50 divide-y divide-slate-800 max-h-80 overflow-y-auto">
              {searchResults.map((stock) => (
                <button
                  key={stock.symbol}
                  onClick={() => {
                    onSelectStock(stock);
                    setShowDropdown(false);
                    setSearchQuery('');
                  }}
                  className="w-full px-3 py-2.5 text-right hover:bg-slate-800/80 transition-colors flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-amber-400">{stock.symbol}</span>
                    <span className="text-slate-200 font-medium">{stock.nameAr}</span>
                    <span className="text-[10px] text-slate-400">({stock.market === 'SAUDI' ? 'سعودي' : 'أمريكي'})</span>
                  </div>
                  <div className="text-left dir-ltr">
                    <span className="font-mono text-slate-100 font-medium">
                      {stock.currency === 'SAR' ? 'ر.س' : '$'}{stock.currentPrice.toFixed(2)}
                    </span>
                    <span
                      className={`block text-[10px] font-mono ${
                        stock.change >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Dashboard Customization / Settings Button */}
          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-amber-400 border border-slate-700/80 hover:border-amber-500/40 text-xs font-bold px-3 py-2 rounded-xl shadow-sm flex items-center gap-1.5 transition-all hover:scale-[1.02]"
              title="تخصيص وترتيب بطاقات لوحة التحكم"
            >
              <Settings className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">تخصيص اللوحة ⚙️</span>
            </button>
          )}

          {/* Advanced Screener Button */}
          {onOpenScreener && (
            <button
              onClick={onOpenScreener}
              className="bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-500/30 text-xs font-bold px-3 py-2 rounded-xl shadow-sm flex items-center gap-1.5 transition-all hover:scale-[1.02]"
              title="مسح وفلترة الأسهم الأمريكية والسعودية (TradingView Screener)"
            >
              <SlidersHorizontal className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">الفلاتر المتقدمة 🎯</span>
            </button>
          )}

          {/* High Contrast Mode Toggle Button */}
          {onToggleHighContrast && (
            <button
              onClick={onToggleHighContrast}
              className={`text-xs font-bold px-2.5 py-2 rounded-xl border transition-all flex items-center gap-1.5 shadow-sm ${
                isHighContrast
                  ? 'bg-amber-400 text-slate-950 border-amber-300 ring-2 ring-amber-400/50 shadow-amber-400/20'
                  : 'bg-slate-900 hover:bg-slate-800 text-amber-400 border-slate-700/80 hover:border-amber-500/50'
              }`}
              title={isHighContrast ? 'إيقاف نمط التباين العالي' : 'تفعيل نمط التباين العالي للجلسات الليلية'}
            >
              <Eye className={`w-4 h-4 ${isHighContrast ? 'text-slate-950 font-bold' : 'text-amber-400'}`} />
              <span className="hidden lg:inline">
                {isHighContrast ? 'تباين عالي: نشط' : 'التباين العالي'}
              </span>
            </button>
          )}

          {/* Gemini AI Assistant Button */}
          <button
            onClick={onOpenAiTerminal}
            className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 text-xs font-bold px-3 py-2 rounded-xl shadow-md shadow-amber-500/10 flex items-center gap-1.5 transition-all"
            title="تحليل الذكاء الاصطناعي المؤسسي المتقدم"
          >
            <Sparkles className="w-4 h-4 fill-slate-950" />
            <span className="hidden sm:inline">محلل الذكاء المؤسسي</span>
          </button>

          {/* Portfolio Drawer Button */}
          <button
            onClick={onOpenPortfolio}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-3 py-1.5 rounded-xl border border-slate-700 flex items-center gap-2 transition-all relative"
          >
            <Briefcase className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <div className="flex flex-col items-start text-right leading-tight">
              <span className="font-bold text-xs text-slate-100">المحفظة</span>
              <span className="text-[10px] text-amber-400 font-semibold tracking-tight whitespace-nowrap">
                Frameworks yoyo - Frameworks Eli
              </span>
            </div>
            {portfolioCount > 0 && (
              <span className="bg-amber-500 text-slate-950 font-bold text-[10px] rounded-full w-4 h-4 flex items-center justify-center flex-shrink-0">
                {portfolioCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
