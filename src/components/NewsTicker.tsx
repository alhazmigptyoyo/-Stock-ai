import React, { useState, useEffect, useMemo } from 'react';
import { Radio, ExternalLink, Clock, Pause, Play, Globe, Filter } from 'lucide-react';

export interface MarketNewsItem {
  id: string;
  title: string;
  source: string;
  time: string;
  category: 'SAUDI' | 'US' | 'GLOBAL';
  impact: 'HIGH' | 'MEDIUM' | 'POSITIVE';
  link?: string;
  relatedSymbol?: string;
}

export type NewsMarketFilter = 'ALL' | 'SAUDI' | 'GLOBAL_US';

const DEFAULT_NEWS: MarketNewsItem[] = [
  {
    id: '1',
    title: 'عاجل: تداول السعودية تسجل تدفقات سيولة أجنبية بقيمة 1.8 مليار ريال خلال التداولات المبكرة اليوم',
    source: 'تداول السعودية / أرقام',
    time: 'منذ 4 دقائق',
    category: 'SAUDI',
    impact: 'HIGH',
    link: 'https://www.argaam.com/ar',
    relatedSymbol: '8030.SR'
  },
  {
    id: '2',
    title: 'سهم كابيتال (Sahm Capital): ارتفاع أرباح قطاع التأمين السعودي بنسبة 22% بفضل عقود التأمين الطبي ورؤية 2030',
    source: 'سهم كابيتال',
    time: 'منذ 12 دقيقة',
    category: 'SAUDI',
    impact: 'POSITIVE',
    link: 'https://app.sahmcapital.com/market',
    relatedSymbol: '8030.SR'
  },
  {
    id: '3',
    title: 'الفيدرالي الأمريكي يثبت سعر الفائدة عند المستوى الميسر 3.50% لتعزيز استثمارات قطاع التكنولوجيا والتوسع الاقتصادي',
    source: 'Bloomberg / CNBC',
    time: 'منذ 18 دقيقة',
    category: 'US',
    impact: 'HIGH',
    link: 'https://finviz.com/news.ashx'
  },
  {
    id: '4',
    title: 'ميدغلف للتأمين (8030) تسجل أداءً استثنائياً وتخترق مقاومة 17.35 ريال وسط تحليلات مؤسسية إيجابية',
    source: 'تداول / أرقام',
    time: 'منذ 25 دقيقة',
    category: 'SAUDI',
    impact: 'HIGH',
    link: 'https://app.sahmcapital.com/stock/detail?code=8030.SA',
    relatedSymbol: '8030.SR'
  },
  {
    id: '5',
    title: 'أسهم أبل ونفيديا تتصدر التداولات اللحظية في وول ستريت مع ارتفاع الطلب على شرائح الذكاء الاصطناعي',
    source: 'Yahoo Finance',
    time: 'منذ 32 دقيقة',
    category: 'US',
    impact: 'POSITIVE',
    link: 'https://finance.yahoo.com',
    relatedSymbol: 'NVDA'
  },
  {
    id: '6',
    title: 'ارتفاع أسعار النفط الخام (برنت) إلى 84 دولاراً للبرميل يدعم مؤشر السوق السعودي تاسي',
    source: 'رويترز / أرقام',
    time: 'منذ 45 دقيقة',
    category: 'GLOBAL',
    impact: 'MEDIUM',
    link: 'https://www.argaam.com/ar'
  }
];

interface NewsTickerProps {
  onSelectSymbol?: (symbol: string) => void;
}

export const NewsTicker: React.FC<NewsTickerProps> = ({ onSelectSymbol }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [selectedFilter, setSelectedFilter] = useState<NewsMarketFilter>('ALL');

  // Filter news items based on selected category filter
  const filteredNews = useMemo(() => {
    if (selectedFilter === 'SAUDI') {
      return DEFAULT_NEWS.filter((item) => item.category === 'SAUDI');
    }
    if (selectedFilter === 'GLOBAL_US') {
      return DEFAULT_NEWS.filter((item) => item.category === 'US' || item.category === 'GLOBAL');
    }
    return DEFAULT_NEWS;
  }, [selectedFilter]);

  // Reset active index when filter changes
  useEffect(() => {
    setActiveIndex(0);
  }, [selectedFilter]);

  // Autoplay ticker timer
  useEffect(() => {
    if (!isPlaying || filteredNews.length === 0) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % filteredNews.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPlaying, filteredNews.length]);

  const currentItem = filteredNews[activeIndex % (filteredNews.length || 1)] || filteredNews[0];

  return (
    <div className="bg-slate-900/95 border-b border-slate-800/80 backdrop-blur-md py-1.5 px-2 sm:px-4 text-xs text-slate-300 flex items-center justify-between gap-2 sm:gap-3 overflow-hidden select-none">
      
      {/* Live Indicator Badge & Play/Pause */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <div className="flex items-center gap-1.5 bg-rose-950/80 border border-rose-700/60 text-rose-300 px-2 py-0.5 rounded-md font-bold text-[11px] animate-pulse">
          <Radio className="w-3 h-3 text-rose-400" />
          <span className="hidden xs:inline">أخبار عاجلة</span>
        </div>

        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="text-slate-400 hover:text-slate-200 p-1 rounded hover:bg-slate-800 transition-colors"
          title={isPlaying ? 'إيقاف مؤقت' : 'تشغيل الشريط'}
        >
          {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 text-emerald-400" />}
        </button>
      </div>

      {/* Market News Filter Selector Buttons */}
      <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800 flex-shrink-0">
        <button
          onClick={() => setSelectedFilter('ALL')}
          className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all ${
            selectedFilter === 'ALL'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          الكل
        </button>

        <button
          onClick={() => setSelectedFilter('SAUDI')}
          className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all flex items-center gap-1 ${
            selectedFilter === 'SAUDI'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <span>🇸🇦</span>
          <span className="hidden md:inline">السعودية</span>
        </button>

        <button
          onClick={() => setSelectedFilter('GLOBAL_US')}
          className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all flex items-center gap-1 ${
            selectedFilter === 'GLOBAL_US'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Globe className="w-2.5 h-2.5" />
          <span className="hidden md:inline">عالمي / أمريكي</span>
        </button>
      </div>

      {/* Main News Content Item */}
      {currentItem ? (
        <div className="flex-1 min-w-0 flex items-center gap-2 justify-start overflow-hidden">
          <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-amber-950/80 border border-amber-700/60 text-amber-300 flex-shrink-0 hidden lg:inline-block">
            {currentItem.category === 'SAUDI' ? 'السوق السعودي' : currentItem.category === 'US' ? 'السوق الأمريكي' : 'أسواق عالمية'}
          </span>

          <p 
            className="truncate text-slate-200 font-medium text-xs sm:text-[13px] hover:text-amber-300 transition-colors cursor-pointer"
            onClick={() => currentItem.link && window.open(currentItem.link, '_blank')}
            title={currentItem.title}
          >
            {currentItem.title}
          </p>

          <span className="text-[10px] text-slate-500 flex items-center gap-1 flex-shrink-0 hidden xl:flex">
            <Clock className="w-3 h-3 text-slate-500" />
            {currentItem.time}
          </span>

          {currentItem.relatedSymbol && onSelectSymbol && (
            <button
              onClick={() => onSelectSymbol(currentItem.relatedSymbol!)}
              className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-700 text-emerald-300 hover:bg-emerald-900 transition-colors flex-shrink-0 hidden xl:inline-block"
            >
              تحليل {currentItem.relatedSymbol} ↗
            </button>
          )}
        </div>
      ) : (
        <div className="flex-1 text-slate-400 text-xs text-center">لا توجد أخبار متاحة لهذا الفلتر</div>
      )}

      {/* Navigation & Controls */}
      {filteredNews.length > 0 && (
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
            <span className="text-amber-400 font-bold">{activeIndex + 1}</span>
            <span>/</span>
            <span>{filteredNews.length}</span>
          </div>

          <button
            onClick={() => setActiveIndex((prev) => (prev - 1 + filteredNews.length) % filteredNews.length)}
            className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors text-[10px] font-bold"
            title="السابق"
          >
            ‹
          </button>
          <button
            onClick={() => setActiveIndex((prev) => (prev + 1) % filteredNews.length)}
            className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors text-[10px] font-bold"
            title="التالي"
          >
            ›
          </button>

          {currentItem?.link && (
            <a
              href={currentItem.link}
              target="_blank"
              rel="noreferrer"
              className="text-[10px] text-slate-400 hover:text-amber-300 flex items-center gap-0.5 border border-slate-700/60 rounded px-1.5 py-0.5 bg-slate-950/60 transition-colors hidden sm:flex"
            >
              <span>المصدر</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          )}
        </div>
      )}
    </div>
  );
};
