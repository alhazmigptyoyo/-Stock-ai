'use client';

import React, { useState } from 'react';
import { Target, Layers, Radio } from 'lucide-react';
import { TradingViewScreener, TradingViewMarketOverview } from './TradingViewWidget';

export default function RecommendationsTable() {
  const [activeTab, setActiveTab] = useState<'SAUDI' | 'US' | 'OVERVIEW'>('SAUDI');

  return (
    <div className="w-full bg-slate-900 rounded-2xl shadow-xl border border-slate-800 p-4 sm:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shrink-0">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              جدول الأسعار والأسهم المباشر (TradingView Live Floor)
            </h2>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              تحديث فوري مباشر من خوادم TradingView للأسهم السعودية (TADAWUL) والأسهم الأمريكية
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-medium self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('SAUDI')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'SAUDI'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="text-sm">🇸🇦</span>
            السوق السعودي (Tadawul)
          </button>

          <button
            onClick={() => setActiveTab('US')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'US'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="text-sm">🇺🇸</span>
            الأسهم الأمريكية (US)
          </button>

          <button
            onClick={() => setActiveTab('OVERVIEW')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'OVERVIEW'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            نظرة عامة شاملة
          </button>
        </div>
      </div>

      {/* Real-time TradingView Widget Content */}
      <div className="space-y-4">
        {activeTab === 'SAUDI' && <TradingViewScreener market="saudi" />}
        {activeTab === 'US' && <TradingViewScreener market="america" />}
        {activeTab === 'OVERVIEW' && <TradingViewMarketOverview />}
      </div>
    </div>
  );
}
