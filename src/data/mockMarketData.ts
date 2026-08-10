import { InstitutionProfile, StockData, MarketIndex, MacroIndicator } from '../types';

export const INSTITUTIONS: InstitutionProfile[] = [
  {
    id: 'goldman_sachs',
    name: 'Goldman Sachs',
    nameAr: 'جولد مان ساكس',
    logoText: 'GS',
    primaryColor: '#1d4ed8', // blue-700
    specialty: 'Investment Banking & Macro Research',
    specialtyAr: 'التقييم الجوهري والأبحاث الاقتصادية الكلية',
    descriptionAr: 'تركز على النمو المستدام، القيمة العادلة المحسوبة بخصم التدفقات النقدية، وعوامل القوة المالية المستدامة.',
    coreStrategyAr: 'استثمار نمو وقيمة طويلة الأجل بناءً على التدفقات النقدية والهوامش.',
    weightInConsensus: 12
  },
  {
    id: 'morgan_stanley',
    name: 'Morgan Stanley',
    nameAr: 'مورجان ستانلي',
    logoText: 'MS',
    primaryColor: '#0284c7', // sky-600
    specialty: 'Equity Research & Valuation',
    specialtyAr: 'أبحاث الأسهم والدورات القطاعية',
    descriptionAr: 'متخصصة في نمو ربحية السهم (EPS) ومكررات الربحية والتقييمات المقارنة بين القطاعات.',
    coreStrategyAr: 'متابعة المحفزات القطاعية وتعديلات التقييم العادل المستهدف.',
    weightInConsensus: 11
  },
  {
    id: 'citadel',
    name: 'Citadel',
    nameAr: 'سيتاديل',
    logoText: 'CIT',
    primaryColor: '#7c3aed', // violet-600
    specialty: 'Quant Multi-Strategy & High-Frequency Alpha',
    specialtyAr: 'التحليل الكمي متعدد الاستراتيجيات والألفا عالية التردد',
    descriptionAr: 'تستخدم خوارزميات التعلم الآلي وتتبع دقيق للزخم وزخم الأحجام والتحركات السريعة.',
    coreStrategyAr: 'مضاربة سريعة واستغلال الفروقات السعرية الفورية والزخم الحجمي.',
    weightInConsensus: 11
  },
  {
    id: 'jpmorgan',
    name: 'JPMorgan Chase',
    nameAr: 'جي بي مورجان',
    logoText: 'JPM',
    primaryColor: '#0f766e', // teal-700
    specialty: 'Enterprise Risk & Portfolio Construction',
    specialtyAr: 'إدارة المخاطر وبناء المحافظ الاستثمارية المتوازنة',
    descriptionAr: 'تحليل القيمة تحت المخاطرة (VaR)، ونسب الدين، والملاءة المالية واحتياطيات النقد.',
    coreStrategyAr: 'تحقيق عوائد عالية مع الحفاظ على الحدود القصوى للمخاطر وتحديد وقف الخسارة.',
    weightInConsensus: 10
  },
  {
    id: 'bridgewater',
    name: 'Bridgewater Associates',
    nameAr: 'بريدج ووتر (راي داليو)',
    logoText: 'BW',
    primaryColor: '#b45309', // amber-700
    specialty: 'Pure Alpha & Macro Economic Weather',
    specialtyAr: 'استراتيجيات تكافؤ المخاطر والمناخ الاقتصادي الكلي',
    descriptionAr: 'تحليل دقيق للدورات الاقتصادية، معدلات الفائدة، التضخم ومؤشرات أسعار النفط والسلع.',
    coreStrategyAr: 'التكيف مع مناخ السوق المالي والاستفادة من الاتجاهات الاقتصادية العريضة.',
    weightInConsensus: 10
  },
  {
    id: 'rentech',
    name: 'Renaissance Technologies',
    nameAr: 'رينيسانس (ميداليون)',
    logoText: 'REN',
    primaryColor: '#059669', // emerald-600
    specialty: 'Mathematical Models & Quantitative Arbitrage',
    specialtyAr: 'النماذج الرياضية والتحليل الإحصائي الرقمي',
    descriptionAr: 'تركز حصرياً على الأنماط الإحصائية، ارتدادات المتوسطات، ونسب فيبوناتشي الرقمية.',
    coreStrategyAr: 'اقتناص التفرقات الإحصائية القصيرة جداً مع دقة عالية بالدخول والخروج.',
    weightInConsensus: 11
  },
  {
    id: 'jane_street',
    name: 'Jane Street',
    nameAr: 'جين ستريت',
    logoText: 'JS',
    primaryColor: '#dc2626', // red-600
    specialty: 'Market Liquidity & Order Flow Intelligence',
    specialtyAr: 'تدفقات السيولة وصانع السوق وعمق دفتر الأوامر',
    descriptionAr: 'تتبع أحجام التداول الكبيرة (Block Trades) وضغط الشراء مقابل البيع الفوري.',
    coreStrategyAr: 'المضاربة مع اتجاه سيولة المؤسسات وصناع السوق الكبار.',
    weightInConsensus: 9
  },
  {
    id: 'susquehanna',
    name: 'Susquehanna (SIG)',
    nameAr: 'سوسكوهانا - SIG',
    logoText: 'SIG',
    primaryColor: '#4f46e5', // indigo-600
    specialty: 'Options Flow & Implied Volatility Derivatives',
    specialtyAr: 'تدفقات الخيارات والتقلبات الضمنية مشتقات الأسهم',
    descriptionAr: 'تراقب عقود الخيارات الضخمة (Options Flow)، ومعاملات اليونانيات (Greeks) والتقلب.',
    coreStrategyAr: 'اكتشاف التحركات المتوقعة قبل حدوثها بناءً على المراهنات الكبيرة في الخيارات.',
    weightInConsensus: 8
  },
  {
    id: 'point72',
    name: 'Point72',
    nameAr: 'بوينت 72 (ستيف كوهين)',
    logoText: 'P72',
    primaryColor: '#9333ea', // purple-600
    specialty: 'Fundamental Long/Short & Catalyst Trading',
    specialtyAr: 'التداول حول محفزات نتائج الأعمال والأخبار الجوهرية',
    descriptionAr: 'تتخصص في التنبؤ بمفاجآت أرباح الشركات ومحفزات النمو الوشيكة.',
    coreStrategyAr: 'استغلال محفزات المدى القصير والمتوسط لتحقيق قفزات سعرية سريعة.',
    weightInConsensus: 9
  },
  {
    id: 'blackrock',
    name: 'BlackRock (Aladdin)',
    nameAr: 'بلاك روك (علاء الدين)',
    logoText: 'BLK',
    primaryColor: '#18181b', // zinc-900
    specialty: 'Global Asset Allocation & Aladdin Analytics',
    specialtyAr: 'إدارة الأصول العالمية وتملك المؤسسات الكبرى',
    descriptionAr: 'تراقب نسبة تملك الصناديق السيادية والاستثمارية وتوزع السيولة العالمية.',
    coreStrategyAr: 'الاستثمار في الأسهم القيادية ذات التملك المؤسسي العالي والاستقرار الأجل.',
    weightInConsensus: 8
  }
];

export const MARKET_INDICES: MarketIndex[] = [
  {
    symbol: 'TASI',
    name: 'Saudi Tadawul All Share Index',
    nameAr: 'مؤشر السوق السعودي (تاسي)',
    market: 'SAUDI',
    value: 12145.80,
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
    value: 5540.25,
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
];

export const MACRO_INDICATORS: MacroIndicator[] = [
  {
    nameAr: 'معدل الفائدة الفيدرالي',
    value: '3.50%',
    statusAr: 'معدل ميسر (3.5%)',
    impactAr: 'سياسة تيسيرية داعمة لنمو الأسهم والقطاع البنكي والتكنولوجي',
    trend: 'DOWN'
  },
  {
    nameAr: 'أسعار برنت (النفط الخام)',
    value: '$82.40 / برميل',
    statusAr: 'استقرار فوق الدعم',
    impactAr: 'داعم قوي لأرباح أرامكو وقطاع البتروكيماويات السعودي',
    trend: 'UP'
  },
  {
    nameAr: 'التضخم الأمريكي (CPI)',
    value: '2.9%',
    statusAr: 'ضمن النطاق المستهدف',
    impactAr: 'محفز شهية المخاطرة للمؤسسات الكبرى',
    trend: 'STABLE'
  },
  {
    nameAr: 'مؤشر الخوف والتقلب (VIX)',
    value: '14.80',
    statusAr: 'هدوء وضغط بيعي منخفض',
    impactAr: 'بيئة مثالية للمضاربات اليومية والصفقات السريعة',
    trend: 'DOWN'
  }
];

export const STOCKS_DATABASE: StockData[] = [
  // --- SAUDI STOCKS (المملكة العربية السعودية) ---
  {
    symbol: '1120.SR',
    code: '1120',
    name: 'Al Rajhi Bank',
    nameAr: 'مصرف الراجحي',
    market: 'SAUDI',
    currency: 'SAR',
    sector: 'Banking',
    sectorAr: 'الخدمات المالية والبنوك',
    currentPrice: 88.50,
    change: +1.40,
    changePercent: +1.61,
    dayHigh: 89.10,
    dayLow: 87.20,
    volume: 8450000,
    avgVolume3M: 7200000,
    category: 'SWING_TRADING',
    entryRangeMin: 87.50,
    entryRangeMax: 88.50,
    stopLoss: 85.00,
    target1: 91.50,
    target2: 94.00,
    target3: 98.00,
    riskRewardRatio: '1:3.2',
    timeHorizonAr: '1 - 3 أسابيع',
    catalystAr: 'اختراق مقاومة 88.00 ريال مع تدفقات شراء مؤسسية ضخمة وإعلان نتائج الربع المتوقعة بتفوق.',
    consensusRating: 'STRONG_BUY',
    consensusTargetPrice: 96.50,
    institutionalRatings: [
      {
        institutionId: 'goldman_sachs',
        institutionNameAr: 'جولد مان ساكس',
        rating: 'BUY',
        targetPrice: 98.00,
        timeframe: '12 شهر',
        keyRationalAr: 'العائد على حقوق الملكية يتجاوز 20% مع محفظة تمويل عقاري قيادية.',
        confidenceScore: 92
      },
      {
        institutionId: 'citadel',
        institutionNameAr: 'سيتاديل',
        rating: 'STRONG_BUY',
        targetPrice: 93.00,
        timeframe: 'أسبوعين',
        keyRationalAr: 'إشارات زخم عالية وزيادة في متوسط أحجام التداول اليومية بـ 25%.',
        confidenceScore: 89
      },
      {
        institutionId: 'rentech',
        institutionNameAr: 'رينيسانس',
        rating: 'STRONG_BUY',
        targetPrice: 91.50,
        timeframe: 'أيام',
        keyRationalAr: 'نموذج فيبوناتشي مؤكد واختراق مؤشر RSI لمستوى 60 بنجاح.',
        confidenceScore: 94
      },
      {
        institutionId: 'jpmorgan',
        institutionNameAr: 'جي بي مورجان',
        rating: 'BUY',
        targetPrice: 95.00,
        timeframe: '6 أشهر',
        keyRationalAr: 'مستويات دين فائقة الجودة واحتياطي سيولة قوي يحمي من تقلبات الفائدة.',
        confidenceScore: 88
      }
    ],
    technicals: {
      rsi14: 64.2,
      macdStatus: 'BULLISH_CROSS',
      sma20: 86.20,
      sma50: 84.10,
      sma200: 79.50,
      support1: 87.00,
      support2: 85.00,
      resistance1: 89.50,
      resistance2: 92.00,
      atr: 1.25
    },
    fundamentals: {
      peRatio: 18.2,
      forwardPE: 16.1,
      pbRatio: 3.4,
      pegRatio: 1.1,
      dividendYield: 3.8,
      marketCapBillion: 354, // SAR Billion
      revenueGrowthYoY: 12.4,
      epsGrowthYoY: 14.8,
      debtToEquity: 0.25,
      freeCashFlowMargin: 42.0,
      fairValueEstimate: 97.00
    },
    orderBook: {
      bids: [
        { price: 88.40, volume: 125000, ordersCount: 84 },
        { price: 88.30, volume: 210000, ordersCount: 112 },
        { price: 88.20, volume: 340000, ordersCount: 195 }
      ],
      asks: [
        { price: 88.50, volume: 95000, ordersCount: 52 },
        { price: 88.60, volume: 110000, ordersCount: 68 },
        { price: 88.70, volume: 180000, ordersCount: 94 }
      ],
      buyPressurePercent: 68,
      sellPressurePercent: 32,
      institutionalBlockTradeSignal: true
    },
    optionsFlow: {
      putCallRatio: 0.45,
      impliedVolatilityPercent: 18.5,
      unusualVolumeAlert: true,
      bullishFlowPercent: 74
    }
  },
  {
    symbol: '2222.SR',
    code: '2222',
    name: 'Saudi Aramco',
    nameAr: 'أرامكو السعودية',
    market: 'SAUDI',
    currency: 'SAR',
    sector: 'Energy',
    sectorAr: 'الطاقة والبترول',
    currentPrice: 27.80,
    change: +0.25,
    changePercent: +0.91,
    dayHigh: 27.95,
    dayLow: 27.55,
    volume: 18200000,
    avgVolume3M: 15400000,
    category: 'LONG_INVESTMENT',
    entryRangeMin: 27.40,
    entryRangeMax: 27.80,
    stopLoss: 26.20,
    target1: 29.50,
    target2: 31.00,
    target3: 34.00,
    riskRewardRatio: '1:3.8',
    timeHorizonAr: '6 - 12 شهر',
    catalystAr: 'عائد توزيعات أرباح استثنائي وتوسع خطة الغاز والمكثفات مع تدفقات الصناديق العالمية.',
    consensusRating: 'STRONG_BUY',
    consensusTargetPrice: 32.00,
    institutionalRatings: [
      {
        institutionId: 'blackrock',
        institutionNameAr: 'بلاك روك',
        rating: 'STRONG_BUY',
        targetPrice: 33.50,
        timeframe: '12 شهر',
        keyRationalAr: 'أكبر توزيعات أرباح مغطاة بالكامل وتدفقات نقدية حرة الأعلى عالمياً.',
        confidenceScore: 96
      },
      {
        institutionId: 'bridgewater',
        institutionNameAr: 'بريدج ووتر',
        rating: 'BUY',
        targetPrice: 31.00,
        timeframe: '6 أشهر',
        keyRationalAr: 'استقرار أسعار النفط فوق 80 دولاراً يضمن أرباحاً تشغيلية قياسية.',
        confidenceScore: 90
      }
    ],
    technicals: {
      rsi14: 55.4,
      macdStatus: 'BULLISH_CROSS',
      sma20: 27.20,
      sma50: 27.10,
      sma200: 28.30,
      support1: 27.30,
      support2: 26.80,
      resistance1: 28.20,
      resistance2: 29.50,
      atr: 0.35
    },
    fundamentals: {
      peRatio: 14.8,
      forwardPE: 13.9,
      pbRatio: 2.1,
      pegRatio: 1.2,
      dividendYield: 6.8, // Exceptional yield
      marketCapBillion: 6720, // SAR Billion
      revenueGrowthYoY: 8.1,
      epsGrowthYoY: 9.5,
      debtToEquity: 0.12,
      freeCashFlowMargin: 38.5,
      fairValueEstimate: 32.50
    },
    orderBook: {
      bids: [
        { price: 27.75, volume: 540000, ordersCount: 310 },
        { price: 27.70, volume: 890000, ordersCount: 450 }
      ],
      asks: [
        { price: 27.80, volume: 420000, ordersCount: 210 },
        { price: 27.85, volume: 610000, ordersCount: 380 }
      ],
      buyPressurePercent: 62,
      sellPressurePercent: 38,
      institutionalBlockTradeSignal: true
    },
    optionsFlow: {
      putCallRatio: 0.52,
      impliedVolatilityPercent: 14.2,
      unusualVolumeAlert: false,
      bullishFlowPercent: 66
    }
  },
  {
    symbol: '2082.SR',
    code: '2082',
    name: 'ACWA Power',
    nameAr: 'أكوا باور',
    market: 'SAUDI',
    currency: 'SAR',
    sector: 'Utilities & Clean Energy',
    sectorAr: 'المرافق العامة والطاقة النظيفة',
    currentPrice: 412.00,
    change: +14.00,
    changePercent: +3.52,
    dayHigh: 418.00,
    dayLow: 398.00,
    volume: 1450000,
    avgVolume3M: 1100000,
    category: 'DAY_TRADING',
    entryRangeMin: 405.00,
    entryRangeMax: 412.00,
    stopLoss: 395.00,
    target1: 428.00,
    target2: 445.00,
    target3: 470.00,
    riskRewardRatio: '1:3.1',
    timeHorizonAr: 'يومي إلى 5 أيام (مضاربة سريعة)',
    catalystAr: 'اختراق فني قوي لقمة تاريخية مدعوم بإعلان مشاريع الهيدروجين الأخضر وتحالفات عالمية.',
    consensusRating: 'STRONG_BUY',
    consensusTargetPrice: 460.00,
    institutionalRatings: [
      {
        institutionId: 'citadel',
        institutionNameAr: 'سيتاديل',
        rating: 'STRONG_BUY',
        targetPrice: 450.00,
        timeframe: 'أسبوع',
        keyRationalAr: 'سيولة تداول انفجارية وانفراج إيجابي حاد في زخم الأسعار.',
        confidenceScore: 95
      },
      {
        institutionId: 'point72',
        institutionNameAr: 'بوينت 72',
        rating: 'STRONG_BUY',
        targetPrice: 465.00,
        timeframe: 'شهر',
        keyRationalAr: 'توسع عقود الطاقة المتجددة في الشرق الأوسط وآسيا برافعة نمو مضاعفة.',
        confidenceScore: 91
      }
    ],
    technicals: {
      rsi14: 72.8,
      macdStatus: 'BULLISH_CROSS',
      sma20: 388.00,
      sma50: 362.00,
      sma200: 295.00,
      support1: 400.00,
      support2: 385.00,
      resistance1: 425.00,
      resistance2: 450.00,
      atr: 8.50
    },
    fundamentals: {
      peRatio: 72.5,
      forwardPE: 48.0,
      pbRatio: 12.1,
      pegRatio: 1.8,
      dividendYield: 0.8,
      marketCapBillion: 301,
      revenueGrowthYoY: 28.4,
      epsGrowthYoY: 34.2,
      debtToEquity: 1.4,
      freeCashFlowMargin: 22.0,
      fairValueEstimate: 430.00
    },
    orderBook: {
      bids: [
        { price: 411.00, volume: 18000, ordersCount: 45 },
        { price: 410.00, volume: 32000, ordersCount: 88 }
      ],
      asks: [
        { price: 412.00, volume: 12000, ordersCount: 22 },
        { price: 413.00, volume: 24000, ordersCount: 54 }
      ],
      buyPressurePercent: 75,
      sellPressurePercent: 25,
      institutionalBlockTradeSignal: true
    },
    optionsFlow: {
      putCallRatio: 0.32,
      impliedVolatilityPercent: 32.0,
      unusualVolumeAlert: true,
      bullishFlowPercent: 82
    }
  },
  {
    symbol: '7010.SR',
    code: '7010',
    name: 'STC (Saudi Telecom)',
    nameAr: 'اس تي سي (stc)',
    market: 'SAUDI',
    currency: 'SAR',
    sector: 'Telecommunication',
    sectorAr: 'الاتصالات والتقنية',
    currentPrice: 39.20,
    change: +0.45,
    changePercent: +1.16,
    dayHigh: 39.45,
    dayLow: 38.80,
    volume: 5200000,
    avgVolume3M: 4800000,
    category: 'LONG_INVESTMENT',
    entryRangeMin: 38.60,
    entryRangeMax: 39.20,
    stopLoss: 37.20,
    target1: 42.00,
    target2: 45.00,
    target3: 49.00,
    riskRewardRatio: '1:3.5',
    timeHorizonAr: '3 - 6 أشهر',
    catalystAr: 'توزيعات أرباح مستقرة مدعومة بالتوسع في مراكز البيانات والحوسبة السحابية وطرح Tawal.',
    consensusRating: 'BUY',
    consensusTargetPrice: 44.50,
    institutionalRatings: [
      {
        institutionId: 'goldman_sachs',
        institutionNameAr: 'جولد مان ساكس',
        rating: 'BUY',
        targetPrice: 45.00,
        timeframe: '12 شهر',
        keyRationalAr: 'نمو عالي لخدمات stc bank ومكاسب القطاع الرقمي.',
        confidenceScore: 88
      },
      {
        institutionId: 'morgan_stanley',
        institutionNameAr: 'مورجان ستانلي',
        rating: 'BUY',
        targetPrice: 44.00,
        timeframe: '6 أشهر',
        keyRationalAr: 'تدفقات نقدية ممتازة وعائد ربحي ثابت يحمي المستثمر.',
        confidenceScore: 86
      }
    ],
    technicals: {
      rsi14: 58.0,
      macdStatus: 'BULLISH_CROSS',
      sma20: 38.50,
      sma50: 38.10,
      sma200: 39.00,
      support1: 38.50,
      support2: 37.80,
      resistance1: 40.00,
      resistance2: 42.00,
      atr: 0.60
    },
    fundamentals: {
      peRatio: 15.1,
      forwardPE: 13.8,
      pbRatio: 2.3,
      pegRatio: 1.3,
      dividendYield: 5.1,
      marketCapBillion: 196,
      revenueGrowthYoY: 7.2,
      epsGrowthYoY: 8.9,
      debtToEquity: 0.35,
      freeCashFlowMargin: 26.5,
      fairValueEstimate: 46.00
    },
    orderBook: {
      bids: [{ price: 39.15, volume: 140000, ordersCount: 95 }],
      asks: [{ price: 39.20, volume: 85000, ordersCount: 42 }],
      buyPressurePercent: 61,
      sellPressurePercent: 39,
      institutionalBlockTradeSignal: false
    },
    optionsFlow: {
      putCallRatio: 0.48,
      impliedVolatilityPercent: 16.0,
      unusualVolumeAlert: false,
      bullishFlowPercent: 65
    }
  },
  {
    symbol: '2010.SR',
    code: '2010',
    name: 'SABIC',
    nameAr: 'سابك',
    market: 'SAUDI',
    currency: 'SAR',
    sector: 'Petrochemicals',
    sectorAr: 'المواد الأساسية والبتروكيماويات',
    currentPrice: 76.80,
    change: +1.20,
    changePercent: +1.59,
    dayHigh: 77.20,
    dayLow: 75.50,
    volume: 3800000,
    avgVolume3M: 3200000,
    category: 'SWING_TRADING',
    entryRangeMin: 75.80,
    entryRangeMax: 76.80,
    stopLoss: 73.50,
    target1: 81.00,
    target2: 86.00,
    target3: 92.00,
    riskRewardRatio: '1:3.2',
    timeHorizonAr: '2 - 6 أسابيع',
    catalystAr: 'تحسن أسعار البتروكيماويات عالمياً وتعافي الطلب الآسيوي من القاع الدوري.',
    consensusRating: 'BUY',
    consensusTargetPrice: 88.00,
    institutionalRatings: [
      {
        institutionId: 'goldman_sachs',
        institutionNameAr: 'جولد مان ساكس',
        rating: 'BUY',
        targetPrice: 90.00,
        timeframe: '12 شهر',
        keyRationalAr: 'الوصول إلى قاع الدورة الاقتصادية والبدء في توسع الهوامش التشغيلية.',
        confidenceScore: 87
      }
    ],
    technicals: {
      rsi14: 52.3,
      macdStatus: 'BULLISH_CROSS',
      sma20: 75.20,
      sma50: 74.80,
      sma200: 78.50,
      support1: 75.00,
      support2: 73.00,
      resistance1: 78.50,
      resistance2: 82.00,
      atr: 1.10
    },
    fundamentals: {
      peRatio: 22.4,
      forwardPE: 17.1,
      pbRatio: 1.3,
      pegRatio: 1.0,
      dividendYield: 4.2,
      marketCapBillion: 230,
      revenueGrowthYoY: 5.4,
      epsGrowthYoY: 18.2,
      debtToEquity: 0.22,
      freeCashFlowMargin: 15.2,
      fairValueEstimate: 89.00
    },
    orderBook: {
      bids: [{ price: 76.70, volume: 82000, ordersCount: 61 }],
      asks: [{ price: 76.80, volume: 45000, ordersCount: 38 }],
      buyPressurePercent: 64,
      sellPressurePercent: 36,
      institutionalBlockTradeSignal: true
    },
    optionsFlow: {
      putCallRatio: 0.55,
      impliedVolatilityPercent: 21.0,
      unusualVolumeAlert: false,
      bullishFlowPercent: 61
    }
  },
  {
    symbol: '8030.SR',
    code: '8030',
    name: 'Medgulf Insurance',
    nameAr: 'ميدغلف للتأمين (8030)',
    market: 'SAUDI',
    currency: 'SAR',
    sector: 'Insurance',
    sectorAr: 'قطاع التأمين وإعادة التأمين',
    currentPrice: 17.39,
    change: +0.33,
    changePercent: +1.93,
    dayHigh: 17.80,
    dayLow: 17.00,
    volume: 4120000,
    avgVolume3M: 3500000,
    category: 'SWING_TRADING',
    entryRangeMin: 17.00,
    entryRangeMax: 17.39,
    stopLoss: 16.20,
    target1: 18.80,
    target2: 20.20,
    target3: 22.50,
    riskRewardRatio: '1:3.2',
    timeHorizonAr: '1 - 3 أسابيع',
    catalystAr: 'ارتفاع نتائج قطاع التأمين ومكاسب تحول الأرباح التشغيلية والعقود الحكومية الجديدة.',
    consensusRating: 'STRONG_BUY',
    consensusTargetPrice: 20.80,
    institutionalRatings: [
      {
        institutionId: 'citadel',
        institutionNameAr: 'سيتاديل',
        rating: 'STRONG_BUY',
        targetPrice: 20.20,
        timeframe: 'أسبوعين',
        keyRationalAr: 'زخم تداول عالي مع دخول سيولة مؤسسية في قطاع التأمين السعودي.',
        confidenceScore: 91
      },
      {
        institutionId: 'rentech',
        institutionNameAr: 'رينيسانس',
        rating: 'BUY',
        targetPrice: 20.80,
        timeframe: 'شهر',
        keyRationalAr: 'نموذج ارتداد إيجابي فوق متوسط 50 يوماً.',
        confidenceScore: 89
      }
    ],
    technicals: {
      rsi14: 64.2,
      macdStatus: 'BULLISH_CROSS',
      sma20: 16.80,
      sma50: 16.10,
      sma200: 15.40,
      support1: 17.00,
      support2: 16.20,
      resistance1: 18.20,
      resistance2: 19.50,
      atr: 0.55
    },
    fundamentals: {
      peRatio: 15.8,
      forwardPE: 12.4,
      pbRatio: 1.6,
      pegRatio: 0.88,
      dividendYield: 2.1,
      marketCapBillion: 1.82,
      revenueGrowthYoY: 18.5,
      epsGrowthYoY: 24.1,
      debtToEquity: 0.18,
      freeCashFlowMargin: 19.5,
      fairValueEstimate: 20.80
    },
    orderBook: {
      bids: [{ price: 13.10, volume: 140000, ordersCount: 78 }],
      asks: [{ price: 13.15, volume: 85000, ordersCount: 42 }],
      buyPressurePercent: 72,
      sellPressurePercent: 28,
      institutionalBlockTradeSignal: true
    },
    optionsFlow: {
      putCallRatio: 0.38,
      impliedVolatilityPercent: 28.0,
      unusualVolumeAlert: true,
      bullishFlowPercent: 78
    }
  },

  // --- US STOCKS (السوق الأمريكي) ---
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    nameAr: 'إنفيديا (NVIDIA)',
    market: 'US',
    currency: 'USD',
    sector: 'Semiconductors / AI',
    sectorAr: 'أشباه الموصلات والذكاء الاصطناعي',
    currentPrice: 128.50,
    change: +4.80,
    changePercent: +3.88,
    dayHigh: 129.80,
    dayLow: 124.10,
    volume: 68500000,
    avgVolume3M: 55000000,
    category: 'DAY_TRADING',
    entryRangeMin: 125.00,
    entryRangeMax: 128.50,
    stopLoss: 121.50,
    target1: 135.00,
    target2: 142.00,
    target3: 155.00,
    riskRewardRatio: '1:3.8',
    timeHorizonAr: 'يومي إلى 3 أيام (مضاربة سريعة جداً)',
    catalystAr: 'طلب خيالي غير مسبوق على معالجات Blackwell وHopper من عمالقة التقنية (Hyperscalers).',
    consensusRating: 'STRONG_BUY',
    consensusTargetPrice: 150.00,
    institutionalRatings: [
      {
        institutionId: 'citadel',
        institutionNameAr: 'سيتاديل',
        rating: 'STRONG_BUY',
        targetPrice: 148.00,
        timeframe: 'أسبوع',
        keyRationalAr: 'أعلى زخم حجمي في السوق الأمريكي مع اختراق المقاومة الفنية برهان كول قوي.',
        confidenceScore: 97
      },
      {
        institutionId: 'goldman_sachs',
        institutionNameAr: 'جولد مان ساكس',
        rating: 'STRONG_BUY',
        targetPrice: 155.00,
        timeframe: '12 شهر',
        keyRationalAr: 'احترافية كاملة في خط إنتاج الذكاء الاصطناعي وهامش إجمالي يفوق 75%.',
        confidenceScore: 95
      },
      {
        institutionId: 'susquehanna',
        institutionNameAr: 'سوسكوهانا SIG',
        rating: 'STRONG_BUY',
        targetPrice: 150.00,
        timeframe: 'شهر',
        keyRationalAr: 'عقود خيارات Call بقيمة مليارات الدولارات عند منفذ 135$ و 140$.',
        confidenceScore: 93
      },
      {
        institutionId: 'rentech',
        institutionNameAr: 'رينيسانس',
        rating: 'STRONG_BUY',
        targetPrice: 142.00,
        timeframe: 'أيام',
        keyRationalAr: 'إشارات خوارزمية مؤكدة بالكامل وتجاوز متكرر لمتوسط التجميع الكمي.',
        confidenceScore: 96
      }
    ],
    technicals: {
      rsi14: 68.5,
      macdStatus: 'BULLISH_CROSS',
      sma20: 121.00,
      sma50: 115.50,
      sma200: 98.20,
      support1: 124.00,
      support2: 120.00,
      resistance1: 130.00,
      resistance2: 138.00,
      atr: 3.80
    },
    fundamentals: {
      peRatio: 45.2,
      forwardPE: 32.1,
      pbRatio: 28.5,
      pegRatio: 0.95, // Cheaper relative to EPS growth!
      dividendYield: 0.03,
      marketCapBillion: 3150, // USD Billion
      revenueGrowthYoY: 122.0,
      epsGrowthYoY: 145.0,
      debtToEquity: 0.15,
      freeCashFlowMargin: 48.0,
      fairValueEstimate: 148.00
    },
    orderBook: {
      bids: [
        { price: 128.40, volume: 42000, ordersCount: 150 },
        { price: 128.30, volume: 88000, ordersCount: 320 }
      ],
      asks: [
        { price: 128.50, volume: 31000, ordersCount: 95 },
        { price: 128.60, volume: 54000, ordersCount: 180 }
      ],
      buyPressurePercent: 78,
      sellPressurePercent: 22,
      institutionalBlockTradeSignal: true
    },
    optionsFlow: {
      putCallRatio: 0.28,
      impliedVolatilityPercent: 44.5,
      unusualVolumeAlert: true,
      bullishFlowPercent: 88
    }
  },
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    nameAr: 'أبل (Apple)',
    market: 'US',
    currency: 'USD',
    sector: 'Consumer Electronics',
    sectorAr: 'التقنية والأجهزة الذكية',
    currentPrice: 224.20,
    change: +2.10,
    changePercent: +0.95,
    dayHigh: 225.50,
    dayLow: 222.10,
    volume: 42000000,
    avgVolume3M: 48000000,
    category: 'LONG_INVESTMENT',
    entryRangeMin: 220.00,
    entryRangeMax: 224.50,
    stopLoss: 212.00,
    target1: 240.00,
    target2: 255.00,
    target3: 275.00,
    riskRewardRatio: '1:3.2',
    timeHorizonAr: '6 - 12 شهر',
    catalystAr: 'دورة استبدال الهواتف الذكية مع إطلاق الميزات الجديدة المعتمدة على Apple Intelligence.',
    consensusRating: 'BUY',
    consensusTargetPrice: 250.00,
    institutionalRatings: [
      {
        institutionId: 'morgan_stanley',
        institutionNameAr: 'مورجان ستانلي',
        rating: 'STRONG_BUY',
        targetPrice: 255.00,
        timeframe: '12 شهر',
        keyRationalAr: 'أكبر قاعدة أجهزة نشطة بالعالم تفوق 2.2 مليار جهاز تحفز إيرادات الخدمات.',
        confidenceScore: 92
      },
      {
        institutionId: 'blackrock',
        institutionNameAr: 'بلاك روك',
        rating: 'BUY',
        targetPrice: 248.00,
        timeframe: '6 أشهر',
        keyRationalAr: 'برنامج إعادة شراء الأسهم الضخم بـ 110 مليار دولار يدعم سعر السهم.',
        confidenceScore: 94
      }
    ],
    technicals: {
      rsi14: 59.2,
      macdStatus: 'BULLISH_CROSS',
      sma20: 220.50,
      sma50: 216.00,
      sma200: 195.00,
      support1: 220.00,
      support2: 214.00,
      resistance1: 228.00,
      resistance2: 235.00,
      atr: 3.20
    },
    fundamentals: {
      peRatio: 33.4,
      forwardPE: 28.5,
      pbRatio: 48.0,
      pegRatio: 2.1,
      dividendYield: 0.45,
      marketCapBillion: 3420,
      revenueGrowthYoY: 6.2,
      epsGrowthYoY: 11.4,
      debtToEquity: 1.2,
      freeCashFlowMargin: 27.5,
      fairValueEstimate: 245.00
    },
    orderBook: {
      bids: [{ price: 224.10, volume: 18000, ordersCount: 82 }],
      asks: [{ price: 224.20, volume: 12000, ordersCount: 45 }],
      buyPressurePercent: 63,
      sellPressurePercent: 37,
      institutionalBlockTradeSignal: false
    },
    optionsFlow: {
      putCallRatio: 0.42,
      impliedVolatilityPercent: 22.0,
      unusualVolumeAlert: false,
      bullishFlowPercent: 70
    }
  },
  {
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    nameAr: 'تسلا (Tesla)',
    market: 'US',
    currency: 'USD',
    sector: 'Automotive / Robotics',
    sectorAr: 'السيارات الكهربائية والروبوتات',
    currentPrice: 218.40,
    change: +8.60,
    changePercent: +4.10,
    dayHigh: 221.00,
    dayLow: 210.50,
    volume: 82000000,
    avgVolume3M: 70000000,
    category: 'SWING_TRADING',
    entryRangeMin: 210.00,
    entryRangeMax: 218.50,
    stopLoss: 202.00,
    target1: 235.00,
    target2: 255.00,
    target3: 280.00,
    riskRewardRatio: '1:3.6',
    timeHorizonAr: '2 - 4 أسابيع',
    catalystAr: 'مؤتمر الـ Cybercab وترخيص الفول سيلف درايفينج (FSD) في الصين وأوروبا.',
    consensusRating: 'BUY',
    consensusTargetPrice: 260.00,
    institutionalRatings: [
      {
        institutionId: 'citadel',
        institutionNameAr: 'سيتاديل',
        rating: 'STRONG_BUY',
        targetPrice: 250.00,
        timeframe: 'أسبوعين',
        keyRationalAr: 'شورت كوفيرينج (Short Squeeze) ملحوظ مع ارتفاع التغطية والتقلبات.',
        confidenceScore: 90
      },
      {
        institutionId: 'point72',
        institutionNameAr: 'بوينت 72',
        rating: 'BUY',
        targetPrice: 265.00,
        timeframe: 'شهر',
        keyRationalAr: 'إعادة تقييم الشركة كشركة ذكاء اصطناعي وروبوتات وليس مجرد صانع سيارات.',
        confidenceScore: 87
      }
    ],
    technicals: {
      rsi14: 61.5,
      macdStatus: 'BULLISH_CROSS',
      sma20: 208.00,
      sma50: 198.00,
      sma200: 210.00,
      support1: 210.00,
      support2: 198.00,
      resistance1: 228.00,
      resistance2: 245.00,
      atr: 7.20
    },
    fundamentals: {
      peRatio: 58.0,
      forwardPE: 42.0,
      pbRatio: 10.2,
      pegRatio: 2.4,
      dividendYield: 0.0,
      marketCapBillion: 695,
      revenueGrowthYoY: 2.3,
      epsGrowthYoY: -8.0,
      debtToEquity: 0.08,
      freeCashFlowMargin: 9.8,
      fairValueEstimate: 240.00
    },
    orderBook: {
      bids: [{ price: 218.30, volume: 25000, ordersCount: 110 }],
      asks: [{ price: 218.40, volume: 18000, ordersCount: 74 }],
      buyPressurePercent: 71,
      sellPressurePercent: 29,
      institutionalBlockTradeSignal: true
    },
    optionsFlow: {
      putCallRatio: 0.35,
      impliedVolatilityPercent: 58.0,
      unusualVolumeAlert: true,
      bullishFlowPercent: 81
    }
  },
  {
    symbol: 'PLTR',
    name: 'Palantir Technologies',
    nameAr: 'بالانتير (Palantir)',
    market: 'US',
    currency: 'USD',
    sector: 'Enterprise AI & Analytics',
    sectorAr: 'الذكاء الاصطناعي المؤسسي والدفاعي',
    currentPrice: 31.80,
    change: +1.65,
    changePercent: +5.47,
    dayHigh: 32.20,
    dayLow: 30.10,
    volume: 54000000,
    avgVolume3M: 41000000,
    category: 'DAY_TRADING',
    entryRangeMin: 30.80,
    entryRangeMax: 31.80,
    stopLoss: 29.50,
    target1: 34.50,
    target2: 38.00,
    target3: 42.00,
    riskRewardRatio: '1:3.7',
    timeHorizonAr: 'يومي إلى 5 أيام',
    catalystAr: 'انضمام لمؤشر S&P 500 وتوسع منصة AIP الخيالي في العقود التجارية الأمريكية.',
    consensusRating: 'STRONG_BUY',
    consensusTargetPrice: 38.00,
    institutionalRatings: [
      {
        institutionId: 'citadel',
        institutionNameAr: 'سيتاديل',
        rating: 'STRONG_BUY',
        targetPrice: 36.00,
        timeframe: 'أسبوع',
        keyRationalAr: 'شراء مكثف من الصناديق المتتبعة للمؤشر الرئيسي مع أحجام قياسية.',
        confidenceScore: 94
      },
      {
        institutionId: 'rentech',
        institutionNameAr: 'رينيسانس',
        rating: 'STRONG_BUY',
        targetPrice: 37.50,
        timeframe: 'أيام',
        keyRationalAr: 'إشارة اندفاع فنية غير مسبوقة وتخطي أعلى المرتفعات السابقة.',
        confidenceScore: 95
      }
    ],
    technicals: {
      rsi14: 74.2,
      macdStatus: 'BULLISH_CROSS',
      sma20: 28.50,
      sma50: 26.10,
      sma200: 21.80,
      support1: 30.00,
      support2: 28.50,
      resistance1: 33.00,
      resistance2: 36.00,
      atr: 1.45
    },
    fundamentals: {
      peRatio: 85.0,
      forwardPE: 58.0,
      pbRatio: 18.2,
      pegRatio: 1.7,
      dividendYield: 0.0,
      marketCapBillion: 71,
      revenueGrowthYoY: 27.2,
      epsGrowthYoY: 60.0,
      debtToEquity: 0.0,
      freeCashFlowMargin: 32.5,
      fairValueEstimate: 35.00
    },
    orderBook: {
      bids: [{ price: 31.75, volume: 38000, ordersCount: 140 }],
      asks: [{ price: 31.80, volume: 19000, ordersCount: 62 }],
      buyPressurePercent: 82,
      sellPressurePercent: 18,
      institutionalBlockTradeSignal: true
    },
    optionsFlow: {
      putCallRatio: 0.22,
      impliedVolatilityPercent: 52.0,
      unusualVolumeAlert: true,
      bullishFlowPercent: 91
    }
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    nameAr: 'مايكروسوفت (Microsoft)',
    market: 'US',
    currency: 'USD',
    sector: 'Cloud & AI Infrastructure',
    sectorAr: 'الحوسبة السحابية والذكاء الاصطناعي',
    currentPrice: 448.50,
    change: +5.20,
    changePercent: +1.17,
    dayHigh: 451.00,
    dayLow: 444.20,
    volume: 22000000,
    avgVolume3M: 20000000,
    category: 'LONG_INVESTMENT',
    entryRangeMin: 442.00,
    entryRangeMax: 448.50,
    stopLoss: 430.00,
    target1: 480.00,
    target2: 510.00,
    target3: 550.00,
    riskRewardRatio: '1:3.3',
    timeHorizonAr: '6 - 12 شهر',
    catalystAr: 'نمو منصة Azure المتسارع وتبني Copilot 365 الشامل لدى كبرى الشركات.',
    consensusRating: 'STRONG_BUY',
    consensusTargetPrice: 500.00,
    institutionalRatings: [
      {
        institutionId: 'goldman_sachs',
        institutionNameAr: 'جولد مان ساكس',
        rating: 'STRONG_BUY',
        targetPrice: 515.00,
        timeframe: '12 شهر',
        keyRationalAr: 'الهيمنة على السحابة المؤسسية واستعادة الاستثمارات الذكية بأعلى عائد.',
        confidenceScore: 96
      },
      {
        institutionId: 'jpmorgan',
        institutionNameAr: 'جي بي مورجان',
        rating: 'STRONG_BUY',
        targetPrice: 495.00,
        timeframe: '6 أشهر',
        keyRationalAr: 'تدفقات مالية فائقة ونسبة ملاءة صلبة تجعل السهم صخرة المحافظ.',
        confidenceScore: 95
      }
    ],
    technicals: {
      rsi14: 58.4,
      macdStatus: 'BULLISH_CROSS',
      sma20: 441.00,
      sma50: 435.00,
      sma200: 405.00,
      support1: 440.00,
      support2: 432.00,
      resistance1: 455.00,
      resistance2: 470.00,
      atr: 5.80
    },
    fundamentals: {
      peRatio: 36.1,
      forwardPE: 30.2,
      pbRatio: 12.8,
      pegRatio: 1.8,
      dividendYield: 0.72,
      marketCapBillion: 3330,
      revenueGrowthYoY: 15.2,
      epsGrowthYoY: 18.5,
      debtToEquity: 0.28,
      freeCashFlowMargin: 31.0,
      fairValueEstimate: 495.00
    },
    orderBook: {
      bids: [{ price: 448.40, volume: 8500, ordersCount: 42 }],
      asks: [{ price: 448.50, volume: 5100, ordersCount: 28 }],
      buyPressurePercent: 66,
      sellPressurePercent: 34,
      institutionalBlockTradeSignal: true
    },
    optionsFlow: {
      putCallRatio: 0.38,
      impliedVolatilityPercent: 20.5,
      unusualVolumeAlert: false,
      bullishFlowPercent: 76
    }
  }
];
