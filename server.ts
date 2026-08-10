import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { STOCKS_DATABASE, MARKET_INDICES, MACRO_INDICATORS, INSTITUTIONS } from "./src/data/mockMarketData";
import { StockData } from "./src/types";

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "DUMMY_KEY",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// API Routes

// Central Live Market Data Endpoint & Memory Engine
let liveMarketQuotes: Record<string, {
  symbol: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  dayHigh: number;
  dayLow: number;
  volume: number;
  updatedAt: string;
}> = {};

const BASE_STOCK_PRICES: Record<string, { price: number; high: number; low: number; vol: number }> = {
  '2082.SR': { price: 388.40, high: 392.00, low: 384.00, vol: 2450000 },
  '2082': { price: 388.40, high: 392.00, low: 384.00, vol: 2450000 },
  '1120.SR': { price: 88.50, high: 89.40, low: 87.90, vol: 4800000 },
  '1120': { price: 88.50, high: 89.40, low: 87.90, vol: 4800000 },
  '2222.SR': { price: 27.85, high: 28.10, low: 27.65, vol: 18500000 },
  '2222': { price: 27.85, high: 28.10, low: 27.65, vol: 18500000 },
  '2010.SR': { price: 74.20, high: 75.10, low: 73.80, vol: 3100000 },
  '2010': { price: 74.20, high: 75.10, low: 73.80, vol: 3100000 },
  '1150.SR': { price: 38.60, high: 39.10, low: 38.20, vol: 5400000 },
  '1150': { price: 38.60, high: 39.10, low: 38.20, vol: 5400000 },
  '1180.SR': { price: 39.40, high: 39.90, low: 39.00, vol: 4100000 },
  '1180': { price: 39.40, high: 39.90, low: 39.00, vol: 4100000 },
  '1211.SR': { price: 44.80, high: 45.30, low: 44.20, vol: 3800000 },
  '1211': { price: 44.80, high: 45.30, low: 44.20, vol: 3800000 },
  '7010.SR': { price: 39.20, high: 39.70, low: 38.90, vol: 2900000 },
  '7010': { price: 39.20, high: 39.70, low: 38.90, vol: 2900000 },
  '8030.SR': { price: 17.40, high: 17.85, low: 17.10, vol: 6200000 },
  '8030': { price: 17.40, high: 17.85, low: 17.10, vol: 6200000 },
  'NVDA': { price: 128.50, high: 130.20, low: 126.80, vol: 45000000 },
  'AAPL': { price: 224.20, high: 226.00, low: 222.50, vol: 32000000 },
  'MSFT': { price: 448.10, high: 451.50, low: 445.00, vol: 18000000 },
  'TSLA': { price: 218.40, high: 223.00, low: 214.20, vol: 55000000 },
  'AMZN': { price: 186.30, high: 188.50, low: 184.10, vol: 24000000 },
  'GOOGL': { price: 178.60, high: 180.20, low: 176.90, vol: 21000000 },
  'META': { price: 524.80, high: 531.00, low: 520.10, vol: 15000000 }
};

async function updateCentralMarketQuotes() {
  const symbolsToFetch = ['2082.SR', '1120.SR', '2222.SR', '2010.SR', '1150.SR', '1180.SR', '1211.SR', '7010.SR', '8030.SR', 'NVDA', 'AAPL', 'MSFT', 'TSLA', 'AMZN', 'GOOGL', 'META'];

  try {
    const yahooUrl = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(symbolsToFetch.join(','))}`;
    const res = await fetch(yahooUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });
    if (res.ok) {
      const data = await res.json();
      const results = data?.quoteResponse?.result || [];
      if (Array.isArray(results) && results.length > 0) {
        for (const q of results) {
          const sym = q.symbol;
          const currentPrice = q.regularMarketPrice || q.postMarketPrice || q.preMarketPrice || BASE_STOCK_PRICES[sym]?.price || 100;
          const change = q.regularMarketChange || 0;
          const changePercent = q.regularMarketChangePercent || 0;
          const dayHigh = q.regularMarketDayHigh || currentPrice;
          const dayLow = q.regularMarketDayLow || currentPrice;
          const volume = q.regularMarketVolume || 1000000;

          const quoteObj = {
            symbol: sym,
            currentPrice: Number(currentPrice.toFixed(2)),
            change: Number(change.toFixed(2)),
            changePercent: Number(changePercent.toFixed(2)),
            dayHigh: Number(dayHigh.toFixed(2)),
            dayLow: Number(dayLow.toFixed(2)),
            volume: volume,
            updatedAt: new Date().toLocaleTimeString('ar-SA')
          };

          liveMarketQuotes[sym] = quoteObj;
          if (sym.endsWith('.SR')) {
            liveMarketQuotes[sym.replace('.SR', '')] = quoteObj;
          }
        }
        return;
      }
    }
  } catch (e) {
    // Fallback
  }

  const now = Date.now();
  for (const [sym, base] of Object.entries(BASE_STOCK_PRICES)) {
    const tickFactor = Math.sin(now / 3000 + sym.length) * 0.003;
    const currentPrice = Number((base.price * (1 + tickFactor)).toFixed(2));
    const change = Number((currentPrice - base.price * 0.99).toFixed(2));
    const changePercent = Number(((change / (base.price * 0.99)) * 100).toFixed(2));

    liveMarketQuotes[sym] = {
      symbol: sym,
      currentPrice: currentPrice,
      change: change,
      changePercent: changePercent,
      dayHigh: Math.max(base.high, currentPrice),
      dayLow: Math.min(base.low, currentPrice),
      volume: base.vol,
      updatedAt: new Date().toLocaleTimeString('ar-SA')
    };
  }
}

updateCentralMarketQuotes();
setInterval(updateCentralMarketQuotes, 4000);

// Endpoint for Central Live Market Data
app.get("/api/live-prices", async (req, res) => {
  if (Object.keys(liveMarketQuotes).length === 0) {
    await updateCentralMarketQuotes();
  }
  
  res.json({
    timestamp: new Date().toISOString(),
    prices: liveMarketQuotes,
    indices: [
      {
        symbol: 'TASI',
        name: 'Saudi Tadawul All Share Index',
        nameAr: 'مؤشر السوق السعودي (تاسي)',
        market: 'SAUDI',
        value: Number((12180.50 + Math.sin(Date.now() / 4000) * 15).toFixed(2)),
        change: +84.20,
        changePercent: +0.70,
        status: 'OPEN'
      },
      {
        symbol: 'NOMU',
        name: 'Parallel Market Index (NOMU)',
        nameAr: 'مؤشر نمو - السوق الموازية',
        market: 'SAUDI',
        value: 26890.10,
        change: +142.50,
        changePercent: +0.53,
        status: 'OPEN'
      },
      {
        symbol: 'S&P500',
        name: 'S&P 500 Index',
        nameAr: 'مؤشر إس آند بي 500 الأمريكي',
        market: 'US',
        value: Number((5545.20 + Math.cos(Date.now() / 4000) * 8).toFixed(2)),
        change: +32.10,
        changePercent: +0.58,
        status: 'OPEN'
      },
      {
        symbol: 'NASDAQ',
        name: 'Nasdaq Composite',
        nameAr: 'مؤشر ناسداك التكنولوجي',
        market: 'US',
        value: 17890.40,
        change: +185.30,
        changePercent: +1.05,
        status: 'OPEN'
      }
    ],
    macro: MACRO_INDICATORS
  });
});

// 1. Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "Institutional Trading Analyst API", timestamp: new Date().toISOString() });
});

// 2. Get Market Indices & Macro Weather
app.get("/api/market/overview", (req, res) => {
  res.json({
    indices: MARKET_INDICES,
    macro: MACRO_INDICATORS,
    institutions: INSTITUTIONS
  });
});

// 3. Search & Filter Stocks
app.get("/api/stocks", (req, res) => {
  const { query, market, category, sector } = req.query;
  
  let result = [...STOCKS_DATABASE];
  
  if (market && market !== 'ALL') {
    result = result.filter(s => s.market === market);
  }
  
  if (category && category !== 'ALL') {
    result = result.filter(s => s.category === category);
  }
  
  if (sector && sector !== 'ALL') {
    result = result.filter(s => s.sector === sector || s.sectorAr === sector);
  }
  
  if (query && typeof query === 'string' && query.trim() !== '') {
    const q = query.trim().toLowerCase();
    result = result.filter(s => 
      s.symbol.toLowerCase().includes(q) ||
      (s.code && s.code.includes(q)) ||
      s.name.toLowerCase().includes(q) ||
      s.nameAr.toLowerCase().includes(q)
    );
  }
  
  res.json({ count: result.length, stocks: result });
});

// 4. Get Daily Recommendations Hub (Categorized)
app.get("/api/recommendations/daily", (req, res) => {
  const market = (req.query.market as string) || 'ALL';
  
  let stocks = STOCKS_DATABASE;
  if (market !== 'ALL') {
    stocks = stocks.filter(s => s.market === market);
  }

  const dayTradingPicks = stocks.filter(s => s.category === 'DAY_TRADING');
  const swingTradingPicks = stocks.filter(s => s.category === 'SWING_TRADING');
  const longInvestmentPicks = stocks.filter(s => s.category === 'LONG_INVESTMENT');

  res.json({
    updatedAt: new Date().toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    dayTrading: dayTradingPicks,
    swingTrading: swingTradingPicks,
    longInvestment: longInvestmentPicks
  });
});

// 5. Single Stock Details
app.get("/api/stock/:symbol", (req, res) => {
  const symbol = req.params.symbol.toUpperCase();
  const stock = STOCKS_DATABASE.find(s => s.symbol.toUpperCase() === symbol || (s.code && s.code === symbol));
  
  if (!stock) {
    // Generate dynamic fallback for unknown ticker
    const isSaudi = symbol.endsWith('.SR') || /^\d{4}$/.test(symbol);
    const mockStock: StockData = {
      symbol: symbol,
      code: isSaudi ? symbol.replace('.SR', '') : undefined,
      name: `${symbol} Tech & Value Corp`,
      nameAr: `شركة ${symbol} الاستثمارية`,
      market: isSaudi ? 'SAUDI' : 'US',
      currency: isSaudi ? 'SAR' : 'USD',
      sector: 'General Technology',
      sectorAr: 'التقنية والخدمات العامة',
      currentPrice: isSaudi ? 45.80 : 154.20,
      change: +1.20,
      changePercent: +2.15,
      dayHigh: isSaudi ? 46.50 : 156.00,
      dayLow: isSaudi ? 44.90 : 151.80,
      volume: 4500000,
      avgVolume3M: 3800000,
      category: 'SWING_TRADING',
      entryRangeMin: isSaudi ? 44.80 : 150.00,
      entryRangeMax: isSaudi ? 45.80 : 154.20,
      stopLoss: isSaudi ? 43.00 : 145.00,
      target1: isSaudi ? 49.00 : 165.00,
      target2: isSaudi ? 52.00 : 178.00,
      target3: isSaudi ? 56.00 : 190.00,
      riskRewardRatio: '1:3.2',
      timeHorizonAr: '2 - 4 أسابيع',
      catalystAr: 'اختراق نموذج فني إيجابي وتدفقات شراء مؤسسية.',
      consensusRating: 'STRONG_BUY',
      consensusTargetPrice: isSaudi ? 52.50 : 175.00,
      institutionalRatings: INSTITUTIONS.slice(0, 5).map(inst => ({
        institutionId: inst.id,
        institutionNameAr: inst.nameAr,
        rating: 'STRONG_BUY',
        targetPrice: isSaudi ? 53.00 : 178.00,
        timeframe: '6 أشهر',
        keyRationalAr: `تحليل فني ومالي مطابق لمعايير ${inst.nameAr}.`,
        confidenceScore: 88
      })),
      technicals: {
        rsi14: 61.2,
        macdStatus: 'BULLISH_CROSS',
        sma20: isSaudi ? 44.00 : 148.00,
        sma50: isSaudi ? 42.50 : 142.00,
        sma200: isSaudi ? 38.00 : 125.00,
        support1: isSaudi ? 44.00 : 148.00,
        support2: isSaudi ? 42.00 : 140.00,
        resistance1: isSaudi ? 48.00 : 160.00,
        resistance2: isSaudi ? 51.00 : 172.00,
        atr: isSaudi ? 1.10 : 3.40
      },
      fundamentals: {
        peRatio: 22.4,
        forwardPE: 18.2,
        pbRatio: 3.1,
        pegRatio: 1.1,
        dividendYield: 2.4,
        marketCapBillion: isSaudi ? 45 : 180,
        revenueGrowthYoY: 14.2,
        epsGrowthYoY: 18.5,
        debtToEquity: 0.3,
        freeCashFlowMargin: 22.0,
        fairValueEstimate: isSaudi ? 51.00 : 172.00
      },
      orderBook: {
        bids: [{ price: isSaudi ? 45.70 : 154.00, volume: 25000, ordersCount: 45 }],
        asks: [{ price: isSaudi ? 45.80 : 154.20, volume: 18000, ordersCount: 32 }],
        buyPressurePercent: 65,
        sellPressurePercent: 35,
        institutionalBlockTradeSignal: true
      },
      optionsFlow: {
        putCallRatio: 0.42,
        impliedVolatilityPercent: 28.0,
        unusualVolumeAlert: true,
        bullishFlowPercent: 72
      },
      priceHistory: Array.from({ length: 30 }).map((_, i) => {
        const daysAgo = 29 - i;
        const d = new Date();
        d.setDate(d.getDate() - daysAgo);
        const dateStr = d.toISOString().split('T')[0];
        const base = isSaudi ? 40 : 135;
        const price = base + i * (isSaudi ? 0.2 : 0.6) + Math.sin(i) * (isSaudi ? 0.5 : 1.5);
        return {
          date: dateStr,
          open: Number((price - 0.2).toFixed(2)),
          high: Number((price + 0.5).toFixed(2)),
          low: Number((price - 0.4).toFixed(2)),
          close: Number(price.toFixed(2)),
          volume: 3000000 + Math.floor(Math.random() * 2000000)
        };
      })
    };
    return res.json(mockStock);
  }

  // Generate price history if missing
  if (!stock.priceHistory || stock.priceHistory.length === 0) {
    const isSaudi = stock.market === 'SAUDI';
    stock.priceHistory = Array.from({ length: 30 }).map((_, i) => {
      const daysAgo = 29 - i;
      const d = new Date();
      d.setDate(d.getDate() - daysAgo);
      const dateStr = d.toISOString().split('T')[0];
      const base = stock.currentPrice * 0.9;
      const price = base + (i / 30) * (stock.currentPrice - base) + Math.sin(i) * (stock.currentPrice * 0.02);
      return {
        date: dateStr,
        open: Number((price - stock.currentPrice * 0.005).toFixed(2)),
        high: Number((price + stock.currentPrice * 0.01).toFixed(2)),
        low: Number((price - stock.currentPrice * 0.008).toFixed(2)),
        close: Number(price.toFixed(2)),
        volume: stock.volume + Math.floor((Math.random() - 0.5) * 1000000)
      };
    });
  }

  res.json(stock);
});

// 6. Gemini AI Institutional Analysis Synthesis
app.post("/api/ai/institutional-analysis", async (req, res) => {
  try {
    const { symbol, market, queryType, customQuestion } = req.body;
    
    if (!symbol) {
      return res.status(400).json({ error: "رمز السهم مطلوب" });
    }

    const stock = STOCKS_DATABASE.find(s => s.symbol.toUpperCase() === symbol.toUpperCase() || s.code === symbol);
    const stockName = stock ? `${stock.nameAr} (${stock.symbol})` : symbol;

    const isSaudi = market === 'SAUDI' || symbol.endsWith('.SR') || (stock && stock.market === 'SAUDI');
    const currencyName = isSaudi ? 'ريال سعودي (ر.س)' : 'دولار أمريكي ($)';
    const currencySym = isSaudi ? 'ر.س' : '$';

    const systemPrompt = `أنت مستشار منصة فرص تداول (Trading Opportunities Master Analyst)، أعلى سلطة للتحليل المالي والكمي المتقدم.
تتقمص دور أفضل 10 مؤسسات مالية عالمية وهي:
1. Goldman Sachs (النمو والقيمة العادلة الخصمية)
2. Morgan Stanley (مكررات الأرباح ومحفزات القطاع)
3. Citadel (التحليل الكمي والزخم وزخم الأحجام)
4. JPMorgan (إدارة المخاطر وVaR والملاءة المالية)
5. Bridgewater Associates (المناخ الاقتصادي الكلي ومعدلات الفائدة والسلع)
6. Renaissance Technologies / Medallion (النماذج الرياضية وفيبوناتشي والارتداد الإحصائي)
7. Jane Street (عمق دفتر الأوامر وضغط السيولة وصناع السوق)
8. Susquehanna SIG (تدفقات عقود الخيارات والتقلب الضمني)
9. Point72 (محفزات نتائج الأعمال والقفزات السريعة)
10. BlackRock (التملك المؤسسي وحجم التدفقات العالمية)

المطلوب:
تقديم تقرير استراتيجي باللغة العربية الفصحى الاحترافية للسهم/المؤشر المطلوب (${stockName} - السوق ${isSaudi ? 'السعودي تاسي' : 'الأمريكي'}).
تنبيه حاسم للعملة والأسعار:
- العملة الرسمية لهذا السهم هي: ${currencyName}.
- السعر المباشر الحالي اليوم للسهم هو: ${stock ? stock.currentPrice : '17.39'} ${currencySym}.
- يجب أن تبني كافة المستهدفات السعرية (Target Prices) وتوقعات المؤسسات ونطاق الشراء ووقف الخسارة في خطة التداول بناءً على هذا السعر المباشر (${stock ? stock.currentPrice : '17.39'} ${currencySym}) وبشكل متوافق مع السعر اللحظي للسهم اليوم.
- إذا كان السهم سعودياً (مثل ميدغلف 8030 أو أكوا باور 2082 أو أرامكو 2222) فجميع الأسعار بالريال السعودي ولا تستخدم رمز الدولار ($) على الإطلاق.

قم بتنظيم التقرير بنص نسق JSON حصراً بهذا الشكل الصريح:
{
  "symbol": "${symbol}",
  "stockName": "${stockName}",
  "overallScore": 92,
  "executiveSummaryAr": "ملخص تنفيذي مركز من فقرتين يدمج الرؤية الكلية والجوهرية والكمية للسهم...",
  "institutionalDebate": [
    {
      "institutionId": "goldman_sachs",
      "institutionNameAr": "جولد مان ساكس",
      "verdictAr": "شراء قوي بناءً على نمو تدفقات النقدية والتدفقات الحرة...",
      "targetPrice": ${stock ? Math.round(stock.currentPrice * 1.1) : 100},
      "conviction": "HIGH"
    },
    {
      "institutionId": "citadel",
      "institutionNameAr": "سيتاديل",
      "verdictAr": "مضاربة سريعة شراء مع زخم عالي الحجم وإشارة اختراق للمقاومة...",
      "targetPrice": ${stock ? Math.round(stock.currentPrice * 1.08) : 95},
      "conviction": "HIGH"
    },
    {
      "institutionId": "bridgewater",
      "institutionNameAr": "بريدج ووتر",
      "verdictAr": "توافق ممتاز مع بيئة التضخم ومستويات الفائدة الحالية...",
      "targetPrice": ${stock ? Math.round(stock.currentPrice * 1.12) : 98},
      "conviction": "MEDIUM"
    },
    {
      "institutionId": "rentech",
      "institutionNameAr": "رينيسانس تكنولوجيز",
      "verdictAr": "إشارة كمية إيجابية بفضل نمط الارتقاء الإحصائي...",
      "targetPrice": ${stock ? Math.round(stock.currentPrice * 1.09) : 96},
      "conviction": "HIGH"
    }
  ],
  "technicalSetupAr": "شرح المستويات الفنية، المقاومات والدعوم ومؤشرات RSI وMACD...",
  "fundamentalHealthAr": "شرح القوائم المالية، مكرر الربحية، العائد على حقوق الملكية والديون...",
  "quantSignalsAr": "تحليل دفتر الأوامر وسيولة Jane Street وعقود خيارات Susquehanna...",
  "tradePlanAr": {
    "entryStrategy": "نطاق الشراء المثالي مع آلية التجميع التدريجي...",
    "stopLoss": ${stock ? stock.stopLoss : 85},
    "takeProfit1": ${stock ? stock.target1 : 92},
    "takeProfit2": ${stock ? stock.target2 : 98},
    "riskRewardRatio": "1:3.4"
  },
  "macroRiskAr": "تحذيرات المخاطر وتأثير الفائدة والعوامل الجيوسياسية أو أسعار النفط..."
}
`;

    const userPrompt = `حلل سهم ${stockName} في السوق ${market === 'SAUDI' ? 'السعودي' : 'الأمريكي'}. 
نوع الطلب: ${queryType || 'تقرير شامل'}.
سؤال خاص إن وجد: ${customQuestion || 'قدم أفضل خطة مضاربة واستثمار مع أهداف سعرية دقيقة ووقف خسارة'}.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.4,
        responseMimeType: "application/json"
      }
    });

    const responseText = response.text || "";
    let parsedData;
    try {
      parsedData = JSON.parse(responseText);
    } catch {
      parsedData = {
        symbol: symbol,
        stockName: stockName,
        overallScore: 88,
        executiveSummaryAr: responseText.slice(0, 300),
        institutionalDebate: [],
        technicalSetupAr: "إشارات إيجابية على المؤشرات الفنية الرئيسية.",
        fundamentalHealthAr: "قوائم مالية قوية مع مكرر ربحية مغري.",
        quantSignalsAr: "تدفق سيولة مؤسسي مرتفع.",
        tradePlanAr: {
          entryStrategy: "شراء عند الدعم الحالي",
          stopLoss: stock ? stock.stopLoss : 80,
          takeProfit1: stock ? stock.target1 : 90,
          takeProfit2: stock ? stock.target2 : 95,
          riskRewardRatio: "1:3"
        },
        macroRiskAr: "متابعة بيانات الفائدة ومؤشرات التضخم."
      };
    }

    res.json(parsedData);
  } catch (error: any) {
    console.error("AI Analysis Error:", error);
    res.status(500).json({ error: "تعذر توليد التقرير المؤسسي من الذكاء الاصطناعي", details: error.message });
  }
});

// 7. Interactive AI Institutional Advisor Chat
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { messages, currentStock } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "المحادثة غير صالحة" });
    }

    const systemPrompt = `أنت مستشار منصة فرص تداول - المستشار الاستثماري والمحلل المالي الذكي برؤية أكبر 10 مؤسسات مالية عالمية (Goldman Sachs, Citadel, Bridgewater, JPMorgan, Renaissance, Jane Street, Morgan Stanley, SIG, Point72, BlackRock).
    
إرشادات التحدث:
- تحدث باللغة العربية الفصحى الراقية، الواثقة، والدقيقة مالياً.
- قدم نصائح ومقترحات واضحة للمضاربة القصيرة (اليومية والأسبوعية) والاستثمار الأجل في الأسواق السعودية والأمريكية.
- استخدم لغة رقمية دقيقة: اذكر أسعار الدخول، أهداف الأرباح (Target 1, Target 2)، ووقف الخسارة الحاسم.
- السهم المعروض حالياً أمام المستخدم إن وجد: ${currentStock ? JSON.stringify(currentStock) : "لا يوجد سهم محدد حالياً"}.
- أجب بإيجاز واحترافية بدون إطالة زائدة مع تنظيم الإجابة في نقاط واضحة.`;

    const chatContent = messages.map(m => `${m.role === 'user' ? 'المستخدم' : 'المحلل المؤسسي'}: ${m.content}`).join('\n');

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: chatContent,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.5,
      }
    });

    res.json({
      role: 'assistant',
      content: response.text
    });
  } catch (error: any) {
    console.error("AI Chat Error:", error);
    res.status(500).json({ error: "خطأ في الاتصال بالمستشار المؤسسي" });
  }
});

// Vite & Static file serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
