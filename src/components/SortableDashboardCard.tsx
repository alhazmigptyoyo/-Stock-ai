import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Eye, EyeOff } from 'lucide-react';

interface SortableDashboardCardProps {
  id: string;
  isCustomizing: boolean;
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  isVisible?: boolean;
  onToggleVisibility?: (id: string) => void;
}

export const SortableDashboardCard: React.FC<SortableDashboardCardProps> = ({
  id,
  isCustomizing,
  title,
  icon,
  children,
  isVisible = true,
  onToggleVisibility,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (!isVisible && !isCustomizing) {
    return null;
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative transition-all duration-200 ${
        !isVisible ? 'opacity-40 grayscale blur-[0.5px]' : ''
      } ${
        isDragging
          ? 'z-50 opacity-80 scale-[0.99] shadow-2xl ring-2 ring-amber-500 rounded-2xl bg-slate-900'
          : ''
      } ${
        isCustomizing
          ? 'ring-2 ring-amber-500/30 ring-dashed rounded-2xl p-2 sm:p-3 bg-slate-900/30 hover:ring-amber-500/60'
          : ''
      }`}
    >
      {isCustomizing && (
        <div className="flex items-center justify-between bg-slate-900 border border-slate-700/80 px-3.5 py-2 rounded-xl mb-3 text-xs text-amber-300 font-bold shadow-md select-none">
          <div className="flex items-center gap-2.5">
            <button
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing p-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 rounded-lg transition-colors flex items-center justify-center touch-none"
              title="سحب لإعادة الترتيب (Drag to reorder)"
            >
              <GripVertical className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              {icon && <span className="text-amber-400">{icon}</span>}
              <span className="text-slate-100">{title}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] text-slate-400 font-normal hidden sm:inline">
              اسحب من المقبض لإعادة الترتيب
            </span>
            {onToggleVisibility && (
              <button
                onClick={() => onToggleVisibility(id)}
                className={`p-1.5 rounded-lg border transition-colors flex items-center gap-1 text-[11px] ${
                  isVisible
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20'
                }`}
                title={isVisible ? 'إخفاء هذه البطاقة' : 'إظهار هذه البطاقة'}
              >
                {isVisible ? (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">ظاهرة</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">مخفية</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}
      {children}
    </div>
  );
};
