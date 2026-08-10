import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { NewsTicker } from './components/NewsTicker';
import { InstitutionsBar } from './components/InstitutionsBar';
import { MacroWeatherCard } from './components/MacroWeatherCard';
import { DailyRecommendations } from './components/DailyRecommendations';
import RecommendationsTable from './components/RecommendationsTable';
import { StockDetailModal } from './components/StockDetailModal';
import { AiAnalystModal } from './components/AiAnalystModal';
import { AiChatDrawer } from './components/AiChatDrawer';
import { PortfolioSimulator } from './components/PortfolioSimulator';
import { AdvancedScreenerModal } from './components/AdvancedScreenerModal';
import { SortableDashboardCard } from './components/SortableDashboardCard';
import { DashboardSettingsModal, CardSectionConfig } from './components/DashboardSettingsModal';
import { TradingViewAdvancedChart, TradingViewTechnicalGauge, TradingViewMiniChartCard, TradingViewTickerTape } from './components/TradingViewWidget';
import { StockData, MarketType, PortfolioPosition, AiAnalysisResponse, MacroIndicator } from './types';
import { useLiveMarketData } from './hooks/useLiveMarketData';
import { MarketDataProvider } from './context/MarketDataContext';
import { ShieldCheck, Sparkles, TrendingUp, RefreshCw, AlertCircle, Award, Clock, LineChart, Table, GripVertical, RotateCcw, Check, Globe } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

const DASHBOARD_STORAGE_KEY = 'dashboard_cards_layout_v1';

const DEFAULT_CARDS_CONFIG: CardSectionConfig[] = [
  { id: 'hero', titleAr: 'البانر الرئيسي والمستشار المؤسسي', descriptionAr: 'العنوان الترحيبي ورابط استشارة الذكاء الاصطناعي', isVisible: true },
  { id: 'mini_charts', titleAr: 'بطاقات الأسهم الأكثر مراقبة (TradingView Mini)', descriptionAr: 'رسوم بيانية مصغرة مباشرة لأهم الأسهم القيادية', isVisible: true },
  { id: 'institutions', titleAr: 'مجلس الـ 10 مؤسسات مالية العالمية', descriptionAr: 'شريط تصفية الفرص حسب تقييمات أكبر المؤسسات', isVisible: true },
  { id: 'macro_weather', titleAr: 'مؤشرات الطقس الاقتصادي الكلي (Ray Dalio)', descriptionAr: 'تحليل أسعار الفائدة، التضخم، النفط والسيولة', isVisible: true },
  { id: 'main_content', titleAr: 'جدول الفرص اليومية والتحليل الفني', descriptionAr: 'التوصيات اليومية والشرط التفاعلي المباشر', isVisible: true },
];

export default function App() {
  const [selectedMarket, setSelectedMarket] = useState<MarketType | 'ALL'>('ALL');
  const [selectedInstitutionFilter, setSelectedInstitutionFilter] = useState<string | null>(null);
  const [activeTabSection, setActiveTabSection] = useState<'RECOMMENDATIONS' | 'TRADINGVIEW'>('RECOMMENDATIONS');
  const [tvSelectedSymbol, setTvSelectedSymbol] = useState<string>('8030.SR');

  // Recommendations data states
  const [rawDayTradingPicks, setRawDayTradingPicks] = useState<StockData[]>([]);
  const [rawSwingTradingPicks, setRawSwingTradingPicks] = useState<StockData[]>([]);
  const [rawLongInvestmentPicks, setRawLongInvestmentPicks] = useState<StockData[]>([]);
  const [macroIndicators, setMacroIndicators] = useState<MacroIndicator[]>([]);
  const [loadingPicks, setLoadingPicks] = useState<boolean>(true);

  // Live Market Data Hook
  const {
    dayTrading: dayTradingPicks,
    swingTrading: swingTradingPicks,
    longInvestment: longInvestmentPicks,
    indices: liveIndices,
    lastUpdatedSymbol,
    lastTickDirection
  } = useLiveMarketData({
    dayTrading: rawDayTradingPicks,
    swingTrading: rawSwingTradingPicks,
    longInvestment: rawLongInvestmentPicks
  });

  // Active Stock Modal
  const [activeStock, setActiveStock] = useState<StockData | null>(null);

  // AI Analysis Modal
  const [aiReport, setAiReport] = useState<AiAnalysisResponse | null>(null);
  const [aiReportLoading, setAiReportLoading] = useState<boolean>(false);
  const [showAiModal, setShowAiModal] = useState<boolean>(false);

  // AI Chat Drawer
  const [showAiChat, setShowAiChat] = useState<boolean>(false);

  // Portfolio
  const [portfolio, setPortfolio] = useState<PortfolioPosition[]>([]);
  const [showPortfolio, setShowPortfolio] = useState<boolean>(false);

  // Advanced Screener Modal
  const [showScreenerModal, setShowScreenerModal] = useState<boolean>(false);

  // Dashboard Cards Reorder & Visibility State
  const [cardsConfig, setCardsConfig] = useState<CardSectionConfig[]>(() => {
    try {
      const saved = localStorage.getItem(DASHBOARD_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === DEFAULT_CARDS_CONFIG.length) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load card layout config:', e);
    }
    return DEFAULT_CARDS_CONFIG;
  });

  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [isCustomizingOnPage, setIsCustomizingOnPage] = useState<boolean>(false);

  const dndSensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleUpdateCardsConfig = (newConfig: CardSectionConfig[]) => {
    setCardsConfig(newConfig);
    try {
      localStorage.setItem(DASHBOARD_STORAGE_KEY, JSON.stringify(newConfig));
    } catch (e) {
      console.error('Failed to save card layout config:', e);
    }
  };

  const handleResetLayout = () => {
    setCardsConfig(DEFAULT_CARDS_CONFIG);
    try {
      localStorage.removeItem(DASHBOARD_STORAGE_KEY);
    } catch (e) {}
  };

  const handleToggleCardVisibility = (id: string) => {
    const updated = cardsConfig.map((item) =>
      item.id === id ? { ...item, isVisible: !item.isVisible } : item
    );
    handleUpdateCardsConfig(updated);
  };

  const handleDragEndDashboard = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = cardsConfig.findIndex((item) => item.id === active.id);
      const newIndex = cardsConfig.findIndex((item) => item.id === over.id);
      const newOrder = arrayMove(cardsConfig, oldIndex, newIndex);
      handleUpdateCardsConfig(newOrder);
    }
  };

  // High Contrast Mode for Night Trading Sessions
  const [isHighContrast, setIsHighContrast] = useState<boolean>(() => {
    try {
      return localStorage.getItem('highContrastMode') === 'true';
    } catch {
      return false;
    }
  });

  const handleToggleHighContrast = () => {
    setIsHighContrast((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('highContrastMode', String(next));
      } catch (err) {
        console.error('Failed to save high contrast setting', err);
      }
      return next;
    });
  };

  // Fetch Daily Recommendations
  useEffect(() => {
    const fetchDailyData = async () => {
      setLoadingPicks(true);
      try {
        const [recsRes, macroRes] = await Promise.all([
          fetch(`/api/recommendations/daily?market=${selectedMarket}`),
          fetch(`/api/market/overview`)
        ]);

        const recsData = await recsRes.json();
        const macroData = await macroRes.json();

        setRawDayTradingPicks(recsData.dayTrading || []);
        setRawSwingTradingPicks(recsData.swingTrading || []);
        setRawLongInvestmentPicks(recsData.longInvestment || []);
        setMacroIndicators(macroData.macro || []);
      } catch (err) {
        console.error('Error fetching market data', err);
      } finally {
        setLoadingPicks(false);
      }
    };

    fetchDailyData();
  }, [selectedMarket]);

  // Request Gemini AI Deep Institutional Analysis Report
  const handleRequestAiReport = async (stock: StockData) => {
    setShowAiModal(true);
    setAiReportLoading(true);
    setAiReport(null);

    try {
      const res = await fetch('/api/ai/institutional-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol: stock.symbol,
          market: stock.market,
          queryType: 'FULL_REPORT'
        })
      });

      const data = await res.json();
      setAiReport(data);
    } catch (err) {
      console.error('Error generating AI report', err);
    } finally {
      setAiReportLoading(false);
    }
  };

  // Portfolio Management
  const handleAddToPortfolio = (stock: StockData) => {
    if (portfolio.some((p) => p.stock.symbol === stock.symbol)) return;

    const newPosition: PortfolioPosition = {
      stock: stock,
      shares: stock.market === 'SAUDI' ? 100 : 10,
      avgBuyPrice: stock.currentPrice,
      addedDate: new Date().toLocaleDateString('ar-SA')
    };

    setPortfolio([...portfolio, newPosition]);
  };

  const handleRemoveFromPortfolio = (symbol: string) => {
    setPortfolio(portfolio.filter((p) => p.stock.symbol !== symbol));
  };

  const handleUpdateShares = (symbol: string, shares: number) => {
    setPortfolio(
      portfolio.map((p) => (p.stock.symbol === symbol ? { ...p, shares } : p))
    );
  };

  const portfolioSymbolList = portfolio.map((p) => p.stock.symbol);

  // Apply optional institution filtering to recommendations
  const filterByInst = (list: StockData[]) => {
    if (!selectedInstitutionFilter) return list;
    return list.filter((s) =>
      s.institutionalRatings.some((r) => r.institutionId === selectedInstitutionFilter)
    );
  };

  return (
    <MarketDataProvider>
      <div
        className={`min-h-screen font-sans dir-rtl flex flex-col selection:bg-amber-500 selection:text-slate-950 transition-colors duration-300 ${
          isHighContrast
            ? 'bg-black text-white contrast-125 brightness-110 [&_*]:border-slate-700'
            : 'bg-slate-950 text-slate-100'
        }`}
      >
      {/* Top Main Navbar */}
      <Navbar
        selectedMarket={selectedMarket}
        onSelectMarket={setSelectedMarket}
        onSelectStock={(stock) => setActiveStock(stock)}
        onOpenAiTerminal={() => setShowAiChat(true)}
        onOpenPortfolio={() => setShowPortfolio(true)}
        onOpenScreener={() => setShowScreenerModal(true)}
        onOpenSettings={() => setShowSettingsModal(true)}
        portfolioCount={portfolio.length}
        liveIndices={liveIndices}
        isHighContrast={isHighContrast}
        onToggleHighContrast={handleToggleHighContrast}
      />

      {/* Breaking News Ticker */}
      <NewsTicker
        onSelectSymbol={(symbol) => {
          const match = [...rawDayTradingPicks, ...rawSwingTradingPicks, ...rawLongInvestmentPicks].find(
            (s) => s.symbol === symbol || s.code === symbol.replace('.SR', '')
          );
          if (match) {
            setActiveStock(match);
          }
        }}
      />

      {/* Real-time TradingView Ticker Tape */}
      <TradingViewTickerTape />

      {/* Main Body Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 space-y-6 w-full">
        
        {/* On-page custom layout mode active banner */}
        {isCustomizingOnPage && (
          <div className="bg-amber-500/10 border-2 border-dashed border-amber-500/60 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs text-amber-300 shadow-xl animate-fade-in">
            <div className="flex items-center gap-2.5">
              <GripVertical className="w-5 h-5 text-amber-400 animate-pulse" />
              <div>
                <span className="font-bold text-sm text-amber-300 block">نمط تخصيص وترتيب بطاقات لوحة التحكم نشط 🎯</span>
                <span className="text-slate-300 text-[11px]">يمكنك الآن سحب أي بطاقة من المقبض العلوي وإعادة ترتيبها أو إخفائها مباشرة.</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleResetLayout}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-xl transition-colors flex items-center gap-1 font-semibold"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>إعادة الضبط</span>
              </button>
              <button
                onClick={() => setIsCustomizingOnPage(false)}
                className="px-4 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl transition-colors shadow-md flex items-center gap-1"
              >
                <Check className="w-4 h-4" />
                <span>تم وتطبيق الترتيب</span>
              </button>
            </div>
          </div>
        )}

        <DndContext
          sensors={dndSensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEndDashboard}
        >
          <SortableContext
            items={cardsConfig.map((c) => c.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-6">
              {cardsConfig.map((card) => {
                if (!card.isVisible && !isCustomizingOnPage) return null;

                if (card.id === 'hero') {
                  return (
                    <SortableDashboardCard
                      key="hero"
                      id="hero"
                      isCustomizing={isCustomizingOnPage}
                      title="البانر الرئيسي والمستشار المؤسسي"
                      icon={<Award className="w-4 h-4" />}
                      isVisible={card.isVisible}
                      onToggleVisibility={handleToggleCardVisibility}
                    >
                      <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-900 border border-amber-500/20 rounded-2xl p-5 sm:p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                        <div className="space-y-2 max-w-2xl relative z-10">
                          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full text-amber-400 text-xs font-bold">
                            <Award className="w-4 h-4" />
                            المنصة المتقدمة لتحليل الأسهم وتوليد التوصيات اليومية
                          </div>
                          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white leading-tight">
                            توصيات وتحليلات بطريقة أكبر 10 مؤسسات مالية عالمية
                          </h1>
                          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                            تتبع دقيق وتوصيات يومية للمضاربة السريعة، التداول المتوسط الاستراتيجي، والاستثمار الأجل للسوقين 
                            <span className="text-amber-400 font-bold"> السعودي (TASI) </span>
                            و <span className="text-amber-400 font-bold">الأمريكي (NYSE/NASDAQ)</span>.
                          </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto relative z-10">
                          <button
                            onClick={() => setShowAiChat(true)}
                            className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-xs py-3 px-5 rounded-xl shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition-all"
                          >
                            <Sparkles className="w-4 h-4 fill-slate-950" />
                            استشارة المستشار المؤسسي الذكي
                          </button>
                        </div>
                      </div>
                    </SortableDashboardCard>
                  );
                }

                if (card.id === 'mini_charts') {
                  return (
                    <SortableDashboardCard
                      key="mini_charts"
                      id="mini_charts"
                      isCustomizing={isCustomizingOnPage}
                      title="بطاقات الأسهم الأكثر مراقبة (TradingView Mini)"
                      icon={<TrendingUp className="w-4 h-4" />}
                      isVisible={card.isVisible}
                      onToggleVisibility={handleToggleCardVisibility}
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <TradingViewMiniChartCard symbol="2082" titleAr="أكوا باور (2082)" market="SAUDI" />
                        <TradingViewMiniChartCard symbol="NVDA" titleAr="إنفيديا (NVDA)" market="US" />
                        <TradingViewMiniChartCard symbol="1120" titleAr="مصرف الراجحي (1120)" market="SAUDI" />
                        <TradingViewMiniChartCard symbol="2222" titleAr="أرامكو السعودية (2222)" market="SAUDI" />
                      </div>
                    </SortableDashboardCard>
                  );
                }

                if (card.id === 'institutions') {
                  return (
                    <SortableDashboardCard
                      key="institutions"
                      id="institutions"
                      isCustomizing={isCustomizingOnPage}
                      title="مجلس الـ 10 مؤسسات مالية العالمية"
                      icon={<ShieldCheck className="w-4 h-4" />}
                      isVisible={card.isVisible}
                      onToggleVisibility={handleToggleCardVisibility}
                    >
                      <InstitutionsBar
                        onSelectInstitutionFilter={setSelectedInstitutionFilter}
                        selectedInstitutionId={selectedInstitutionFilter}
                      />
                    </SortableDashboardCard>
                  );
                }

                if (card.id === 'macro_weather') {
                  return (
                    <SortableDashboardCard
                      key="macro_weather"
                      id="macro_weather"
                      isCustomizing={isCustomizingOnPage}
                      title="مؤشرات الطقس الاقتصادي الكلي (Ray Dalio)"
                      icon={<Globe className="w-4 h-4" />}
                      isVisible={card.isVisible}
                      onToggleVisibility={handleToggleCardVisibility}
                    >
                      {macroIndicators.length > 0 && <MacroWeatherCard indicators={macroIndicators} />}
                    </SortableDashboardCard>
                  );
                }

                if (card.id === 'main_content') {
                  return (
                    <SortableDashboardCard
                      key="main_content"
                      id="main_content"
                      isCustomizing={isCustomizingOnPage}
                      title="جدول الفرص اليومية والتحليل الفني"
                      icon={<Table className="w-4 h-4" />}
                      isVisible={card.isVisible}
                      onToggleVisibility={handleToggleCardVisibility}
                    >
                      <div className="space-y-6">
                        {/* Main Section Navigation Switcher */}
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3 gap-3 flex-wrap">
                          <div className="flex items-center gap-2 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
                            <button
                              onClick={() => setActiveTabSection('RECOMMENDATIONS')}
                              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                                activeTabSection === 'RECOMMENDATIONS'
                                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                                  : 'text-slate-400 hover:text-white'
                              }`}
                            >
                              <Table className="w-4 h-4" />
                              <span>جدول الفرص اليومية والتوصيات</span>
                            </button>
                            <button
                              onClick={() => setActiveTabSection('TRADINGVIEW')}
                              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                                activeTabSection === 'TRADINGVIEW'
                                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                                  : 'text-slate-400 hover:text-white'
                              }`}
                            >
                              <LineChart className="w-4 h-4" />
                              <span>قسم التحليل الفني المباشر (TradingView)</span>
                            </button>
                          </div>

                          {activeTabSection === 'TRADINGVIEW' && (
                            <div className="flex items-center gap-2 overflow-x-auto text-xs">
                              <span className="text-slate-400 font-bold hidden sm:inline">اختر السهم للتحليل:</span>
                              {[
                                { symbol: '8030.SR', name: 'ميدغلف (8030)' },
                                { symbol: '1120.SR', name: 'الراجحي (1120)' },
                                { symbol: '2222.SR', name: 'أرامكو (2222)' },
                                { symbol: 'NVDA', name: 'نفيديا (NVDA)' },
                                { symbol: 'AAPL', name: 'أبل (AAPL)' },
                                { symbol: 'PLTR', name: 'بالانتير (PLTR)' }
                              ].map((item) => (
                                <button
                                  key={item.symbol}
                                  onClick={() => setTvSelectedSymbol(item.symbol)}
                                  className={`px-3 py-1.5 rounded-lg border font-mono text-xs transition-colors whitespace-nowrap ${
                                    tvSelectedSymbol === item.symbol
                                      ? 'bg-emerald-950 border-emerald-500 text-emerald-300 font-bold'
                                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                                  }`}
                                >
                                  {item.name}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Main Section Content */}
                        {activeTabSection === 'TRADINGVIEW' ? (
                          <div className="space-y-6">
                            <TradingViewAdvancedChart
                              symbol={tvSelectedSymbol}
                              market={tvSelectedSymbol.endsWith('.SR') ? 'SAUDI' : 'US'}
                              height={520}
                            />
                            <TradingViewTechnicalGauge
                              symbol={tvSelectedSymbol}
                              market={tvSelectedSymbol.endsWith('.SR') ? 'SAUDI' : 'US'}
                            />
                          </div>
                        ) : loadingPicks ? (
                          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
                            <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
                            <p className="text-slate-300 font-semibold text-sm">جاري جلب وقراءة بيانات التوصيات اليومية المباشرة...</p>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            <DailyRecommendations
                              dayTradingPicks={filterByInst(dayTradingPicks)}
                              swingTradingPicks={filterByInst(swingTradingPicks)}
                              longInvestmentPicks={filterByInst(longInvestmentPicks)}
                              selectedMarket={selectedMarket}
                              onSelectStock={(stock) => setActiveStock(stock)}
                              onAddToPortfolio={handleAddToPortfolio}
                              portfolioSymbolList={portfolioSymbolList}
                              lastUpdatedSymbol={lastUpdatedSymbol}
                              lastTickDirection={lastTickDirection}
                              onOpenScreener={() => setShowScreenerModal(true)}
                            />
                            <RecommendationsTable />
                          </div>
                        )}
                      </div>
                    </SortableDashboardCard>
                  );
                }

                return null;
              })}
            </div>
          </SortableContext>
        </DndContext>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-6 px-4 text-center text-xs text-slate-500 space-y-2 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400">
          <p className="font-medium">
            فرص تداول © 2026 • منصة التحليل المالي والكمي المتقدم ومحاكاة المؤسسات المالية العالمية.
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Goldman Sachs</span> • <span>Citadel</span> • <span>Bridgewater</span> • <span>JPMorgan</span> • <span>RenTech</span>
          </div>
        </div>
      </footer>

      {/* Stock Detailed Inspector Modal */}
      {activeStock && (
        <StockDetailModal
          stock={activeStock}
          onClose={() => setActiveStock(null)}
          onRequestAiReport={(stock) => handleRequestAiReport(stock)}
          onAddToPortfolio={(stock) => handleAddToPortfolio(stock)}
          isAddedToPortfolio={portfolioSymbolList.includes(activeStock.symbol)}
        />
      )}

      {/* Gemini AI Report Modal */}
      {showAiModal && (
        <AiAnalystModal
          report={aiReport}
          loading={aiReportLoading}
          stock={activeStock}
          onClose={() => {
            setShowAiModal(false);
            setAiReport(null);
          }}
        />
      )}

      {/* Gemini Live AI Chat Drawer */}
      <AiChatDrawer
        isOpen={showAiChat}
        onClose={() => setShowAiChat(false)}
        currentStock={activeStock}
      />

      {/* Portfolio Tracker Modal */}
      <PortfolioSimulator
        isOpen={showPortfolio}
        onClose={() => setShowPortfolio(false)}
        portfolio={portfolio}
        onRemoveFromPortfolio={handleRemoveFromPortfolio}
        onUpdateShares={handleUpdateShares}
      />

      {/* Advanced TradingView Stock Screener Modal */}
      <AdvancedScreenerModal
        isOpen={showScreenerModal}
        onClose={() => setShowScreenerModal(false)}
      />

      {/* Dashboard Card Reordering & Layout Customization Settings Modal */}
      <DashboardSettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        cardsConfig={cardsConfig}
        onUpdateCardsConfig={handleUpdateCardsConfig}
        onResetLayout={handleResetLayout}
        isCustomizingOnPage={isCustomizingOnPage}
        onToggleCustomizingOnPage={setIsCustomizingOnPage}
        isHighContrast={isHighContrast}
        onToggleHighContrast={handleToggleHighContrast}
      />
    </div>
    </MarketDataProvider>
  );
}
