import React from 'react';
import {
  X,
  Settings,
  GripVertical,
  RotateCcw,
  Check,
  Eye,
  EyeOff,
  Sliders,
  Sparkles,
  Contrast,
  LayoutGrid
} from 'lucide-react';
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
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export interface CardSectionConfig {
  id: string;
  titleAr: string;
  descriptionAr: string;
  isVisible: boolean;
}

interface DashboardSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  cardsConfig: CardSectionConfig[];
  onUpdateCardsConfig: (newConfig: CardSectionConfig[]) => void;
  onResetLayout: () => void;
  isCustomizingOnPage: boolean;
  onToggleCustomizingOnPage: (active: boolean) => void;
  isHighContrast?: boolean;
  onToggleHighContrast?: () => void;
}

const SortableConfigItem: React.FC<{
  item: CardSectionConfig;
  onToggleVisibility: (id: string) => void;
}> = ({ item, onToggleVisibility }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between p-3.5 bg-slate-900 border rounded-xl transition-all ${
        isDragging
          ? 'z-50 border-amber-500 shadow-xl opacity-90 scale-[1.01]'
          : 'border-slate-800 hover:border-slate-700'
      } ${!item.isVisible ? 'opacity-50' : ''}`}
    >
      <div className="flex items-center gap-3">
        <button
          {...attributes}
          {...listeners}
          className="p-2 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg cursor-grab active:cursor-grabbing touch-none transition-colors"
          title="سحب للتعديل"
        >
          <GripVertical className="w-4 h-4" />
        </button>
        <div>
          <h4 className="font-bold text-slate-100 text-xs sm:text-sm">{item.titleAr}</h4>
          <p className="text-[11px] text-slate-400 mt-0.5">{item.descriptionAr}</p>
        </div>
      </div>

      <button
        onClick={() => onToggleVisibility(item.id)}
        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center gap-1.5 ${
          item.isVisible
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
            : 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20'
        }`}
      >
        {item.isVisible ? (
          <>
            <Eye className="w-3.5 h-3.5" />
            <span>ظاهرة</span>
          </>
        ) : (
          <>
            <EyeOff className="w-3.5 h-3.5" />
            <span>مخفية</span>
          </>
        )}
      </button>
    </div>
  );
};

export const DashboardSettingsModal: React.FC<DashboardSettingsModalProps> = ({
  isOpen,
  onClose,
  cardsConfig,
  onUpdateCardsConfig,
  onResetLayout,
  isCustomizingOnPage,
  onToggleCustomizingOnPage,
  isHighContrast = false,
  onToggleHighContrast,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  if (!isOpen) return null;

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = cardsConfig.findIndex((item) => item.id === active.id);
      const newIndex = cardsConfig.findIndex((item) => item.id === over.id);
      const newOrder = arrayMove(cardsConfig, oldIndex, newIndex);
      onUpdateCardsConfig(newOrder);
    }
  };

  const handleToggleVisibility = (id: string) => {
    const updated = cardsConfig.map((item) =>
      item.id === id ? { ...item, isVisible: !item.isVisible } : item
    );
    onUpdateCardsConfig(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in dir-rtl">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">إعدادات وتخصيص لوحة التحكم</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                قم بإعادة ترتيب أقسام البطاقات بالسحب والإفلات وتخصيص تجربة التداول
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

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* Quick Toggle On-Page Customization Mode */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                <LayoutGrid className="w-4 h-4 text-amber-400" />
                <span>نمط السحب والإفلات المباشر (Drag & Drop Mode)</span>
              </div>
              <p className="text-slate-300 text-xs">
                قم بتفعيل هذا النمط لسحب وإعادة ترتيب البطاقات مباشرة على الصفحة الرئيسية بكل حرية.
              </p>
            </div>

            <button
              onClick={() => onToggleCustomizingOnPage(!isCustomizingOnPage)}
              className={`px-4 py-2.5 rounded-xl font-bold transition-all shrink-0 flex items-center gap-2 ${
                isCustomizingOnPage
                  ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20'
                  : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
              }`}
            >
              {isCustomizingOnPage ? (
                <>
                  <Check className="w-4 h-4 text-slate-950 font-bold" />
                  <span>النمط المباشر: مفعل</span>
                </>
              ) : (
                <>
                  <Sliders className="w-4 h-4 text-amber-400" />
                  <span>تفعيل السحب المباشر</span>
                </>
              )}
            </button>
          </div>

          {/* High Contrast Theme Option */}
          {onToggleHighContrast && (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-slate-200 font-bold text-xs sm:text-sm">
                  <Contrast className="w-4 h-4 text-amber-400" />
                  <span>نمط التباين العالي (High Contrast Night Mode)</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  وضوح أقصى للتباين وراحة العين أثناء جلسات التداول الليلية الممتدة.
                </p>
              </div>

              <button
                onClick={onToggleHighContrast}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 ${
                  isHighContrast
                    ? 'bg-amber-400 text-slate-950 border-amber-300'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                {isHighContrast ? 'نشط 🟢' : 'غير نشط'}
              </button>
            </div>
          )}

          {/* Reorder List Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                <GripVertical className="w-4 h-4 text-amber-400" />
                <span>ترتيب وإظهار بطاقات الصفحة الرئيسية:</span>
              </h3>
              <button
                onClick={onResetLayout}
                className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold text-xs transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>إعادة الضبط التلقائي</span>
              </button>
            </div>

            <p className="text-slate-400 text-xs">
              اسحب من مقبض السحب على اليمين لتغيير ترتيب ظهور البطاقات، أو انقر على الزر لإخفاء/إظهار أي قسم.
            </p>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={cardsConfig.map((c) => c.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2.5">
                  {cardsConfig.map((item) => (
                    <SortableConfigItem
                      key={item.id}
                      item={item}
                      onToggleVisibility={handleToggleVisibility}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs shrink-0">
          <span className="text-slate-400">يتم حفظ التغييرات والترتيب تلقائياً متوافقاً مع متصفحك.</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition-colors shadow-md"
          >
            حفظ وإغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
