import React, { useState } from 'react';
import { INSTITUTIONS } from '../data/mockMarketData';
import { InstitutionProfile } from '../types';
import { ShieldCheck, Info, ChevronRight, Sparkles } from 'lucide-react';

interface InstitutionsBarProps {
  onSelectInstitutionFilter?: (institutionId: string | null) => void;
  selectedInstitutionId?: string | null;
}

export const InstitutionsBar: React.FC<InstitutionsBarProps> = ({
  onSelectInstitutionFilter,
  selectedInstitutionId,
}) => {
  const [activeProfile, setActiveProfile] = useState<InstitutionProfile | null>(INSTITUTIONS[0]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg space-y-4">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-amber-400" />
          <h2 className="text-sm sm:text-base font-bold text-white">
            رادار المؤسسات المالية العشر الكبرى (Global Institutional Council)
          </h2>
        </div>
        <span className="text-xs text-slate-400">
          محاكاة حية لمنهجية {INSTITUTIONS.length} صانع سوق ومؤسسة استثمارية عالمية
        </span>
      </div>

      {/* Grid of 10 Institutions */}
      <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
        {INSTITUTIONS.map((inst) => {
          const isSelected = selectedInstitutionId === inst.id || activeProfile?.id === inst.id;
          return (
            <button
              key={inst.id}
              onClick={() => {
                setActiveProfile(inst);
                if (onSelectInstitutionFilter) {
                  onSelectInstitutionFilter(selectedInstitutionId === inst.id ? null : inst.id);
                }
              }}
              className={`p-2.5 rounded-xl text-center border transition-all flex flex-col items-center justify-center gap-1 group relative overflow-hidden ${
                isSelected
                  ? 'bg-slate-800 border-amber-500 shadow-md shadow-amber-500/10'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
              }`}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center font-bold font-mono text-xs text-white shadow"
                style={{ backgroundColor: inst.primaryColor }}
              >
                {inst.logoText}
              </div>
              <span className="text-[11px] font-semibold text-slate-200 truncate w-full group-hover:text-amber-400 transition-colors">
                {inst.nameAr}
              </span>
              <span className="text-[9px] text-slate-400 font-mono">وزن: {inst.weightInConsensus}%</span>
              
              {selectedInstitutionId === inst.id && (
                <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Profile Methodology Detail Drawer */}
      {activeProfile && (
        <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3.5 text-xs text-slate-300 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
            <div className="flex items-center gap-2">
              <span
                className="px-2 py-0.5 rounded font-mono font-bold text-white text-[11px]"
                style={{ backgroundColor: activeProfile.primaryColor }}
              >
                {activeProfile.name}
              </span>
              <span className="font-bold text-white">{activeProfile.nameAr}</span>
              <span className="text-slate-500">•</span>
              <span className="text-amber-400 font-medium">{activeProfile.specialtyAr}</span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              ثقل التوصية في المؤشر العام: {activeProfile.weightInConsensus}%
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-300">
            <div>
              <span className="text-slate-400 block mb-0.5 font-medium text-[11px]">المنهجية ومحرك التحليل:</span>
              <p className="leading-relaxed text-slate-200">{activeProfile.descriptionAr}</p>
            </div>
            <div>
              <span className="text-amber-400/90 block mb-0.5 font-medium text-[11px]">الاستراتيجية التداولية المحاكية:</span>
              <p className="leading-relaxed text-slate-200">{activeProfile.coreStrategyAr}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
