import React, { useEffect, useState } from 'react';
import { Mouse, Keyboard, X, Check, AlertCircle } from 'lucide-react';
import { TargetInput, TriggerKey, MouseButtonType } from '../types/clicker';
import { Language, translations } from '../translations/i18n';

interface KeyRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  mode: 'trigger' | 'target';
  onSaveTrigger?: (trigger: TriggerKey) => void;
  onSaveTarget?: (target: TargetInput) => void;
}

export const KeyRecordModal: React.FC<KeyRecordModalProps> = ({
  isOpen,
  onClose,
  lang,
  mode,
  onSaveTrigger,
  onSaveTarget,
}) => {
  const [capturedKey, setCapturedKey] = useState<string | null>(null);
  const [capturedCode, setCapturedCode] = useState<string | null>(null);
  const [capturedMouseButton, setCapturedMouseButton] = useState<MouseButtonType | null>(null);
  const [isMouse, setIsMouse] = useState(false);

  const t = translations[lang];

  useEffect(() => {
    if (!isOpen) {
      setCapturedKey(null);
      setCapturedCode(null);
      setCapturedMouseButton(null);
      setIsMouse(false);
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();

      // Don't capture escape if nothing recorded yet — user might want to close
      if (e.key === 'Escape' && !capturedKey) {
        onClose();
        return;
      }

      let display = e.key;
      if (e.code.startsWith('Key')) display = e.code.slice(3);
      else if (e.code.startsWith('Digit')) display = e.code.slice(5);
      else if (e.code === 'Space') display = 'Space';
      else if (e.code.startsWith('F') && !isNaN(Number(e.code.slice(1)))) display = e.code;

      setCapturedKey(e.key);
      setCapturedCode(e.code);
      setIsMouse(false);
      setCapturedMouseButton(null);
    };

    const handleMouseDown = (e: MouseEvent) => {
      // Don't intercept clicks inside the action buttons
      const target = e.target as HTMLElement;
      if (target.closest('button[data-modal-action="true"]')) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      let mb: MouseButtonType = 'left';
      let name = t.mouseLeft;

      if (e.button === 0) {
        mb = 'left';
        name = t.mouseLeft;
      } else if (e.button === 1) {
        mb = 'middle';
        name = t.mouseMiddle;
      } else if (e.button === 2) {
        mb = 'right';
        name = t.mouseRight;
      } else if (e.button === 3) {
        mb = 'mouse4';
        name = t.mouse4;
      } else if (e.button === 4) {
        mb = 'mouse5';
        name = t.mouse5;
      }

      setIsMouse(true);
      setCapturedMouseButton(mb);
      setCapturedKey(name);
      setCapturedCode(`Mouse_${mb}`);
    };

    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('mousedown', handleMouseDown, true);

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('mousedown', handleMouseDown, true);
    };
  }, [isOpen, capturedKey, onClose, t]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!capturedKey && !capturedMouseButton) return;

    if (mode === 'trigger' && onSaveTrigger) {
      onSaveTrigger({
        key: capturedKey || 'F6',
        code: capturedCode || 'F6',
        displayName: capturedKey || 'F6',
        mouseButton: isMouse && capturedMouseButton ? capturedMouseButton : undefined,
      });
    } else if (mode === 'target' && onSaveTarget) {
      if (isMouse && capturedMouseButton) {
        onSaveTarget({
          category: 'mouse',
          mouseButton: capturedMouseButton,
          key: '',
          code: `Mouse_${capturedMouseButton}`,
          displayName: capturedKey || capturedMouseButton,
        });
      } else {
        onSaveTarget({
          category: 'keyboard',
          mouseButton: 'left',
          key: capturedKey || 'e',
          code: capturedCode || 'KeyE',
          displayName: capturedKey?.toUpperCase() || 'E',
        });
      }
    }
    onClose();
  };

  const quickCommonKeys = [
    { label: 'F6', code: 'F6', key: 'F6' },
    { label: 'F7', code: 'F7', key: 'F7' },
    { label: 'F8', code: 'F8', key: 'F8' },
    { label: 'Space', code: 'Space', key: ' ' },
    { label: 'E', code: 'KeyE', key: 'e' },
    { label: 'X', code: 'KeyX', key: 'x' },
    { label: 'Shift', code: 'ShiftLeft', key: 'Shift' },
    { label: 'Enter', code: 'Enter', key: 'Enter' },
  ];

  const quickMouseButtons = [
    { label: t.mouseLeft, mb: 'left' as MouseButtonType },
    { label: t.mouseRight, mb: 'right' as MouseButtonType },
    { label: t.mouseMiddle, mb: 'middle' as MouseButtonType },
    { label: t.mouse4, mb: 'mouse4' as MouseButtonType },
    { label: t.mouse5, mb: 'mouse5' as MouseButtonType },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-neutral-900 border border-neutral-700/80 rounded-xl shadow-2xl overflow-hidden p-6 relative"
        onContextMenu={(e) => e.preventDefault()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              {isMouse ? <Mouse className="w-4 h-4" /> : <Keyboard className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-base font-semibold text-neutral-100">
                {mode === 'trigger' 
                  ? (lang === 'ru' ? 'Назначение кнопки активации' : 'Bind Trigger Hotkey')
                  : (lang === 'ru' ? 'Выбор целевой кнопки' : 'Select Target Key / Button')}
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                {t.pressAnyKeyToBind}
              </p>
            </div>
          </div>
          <button 
            data-modal-action="true"
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-200 p-1.5 rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Big Key Capture Visualizer */}
        <div className="my-6 flex flex-col items-center justify-center py-8 px-4 rounded-xl bg-neutral-950/60 border border-dashed border-neutral-700/60">
          <div className="w-24 h-24 rounded-2xl bg-neutral-800/80 border-2 border-amber-500/50 flex flex-col items-center justify-center shadow-lg shadow-amber-500/5 mb-3 transition-transform active:scale-95">
            <span className="text-2xl font-bold font-mono text-amber-400">
              {capturedKey ? (capturedKey === ' ' ? 'Space' : capturedKey.slice(0, 10)) : '...'}
            </span>
            <span className="text-[10px] text-neutral-400 mt-1 uppercase tracking-wider font-mono">
              {isMouse ? 'Mouse' : (capturedCode ? capturedCode : 'Waiting')}
            </span>
          </div>
          <p className="text-sm font-medium text-neutral-200 text-center">
            {capturedKey 
              ? (lang === 'ru' ? `Зафиксировано: ${capturedKey}` : `Captured: ${capturedKey}`)
              : (lang === 'ru' ? 'Нажмите нужную клавишу на клавиатуре или кнопку мыши' : 'Press desired key on keyboard or mouse button')}
          </p>
          <span className="text-xs text-neutral-500 mt-1">
            {lang === 'ru' ? '(Слушатель перехватывает клики и клавиши без задержки)' : '(Direct event listener active)'}
          </span>
        </div>

        {/* Quick select presets */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              {t.quickKeys} (Клавиатура):
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {quickCommonKeys.map((item) => (
              <button
                key={item.code}
                data-modal-action="true"
                type="button"
                onClick={() => {
                  setCapturedKey(item.label);
                  setCapturedCode(item.code);
                  setIsMouse(false);
                  setCapturedMouseButton(null);
                }}
                className={`px-3 py-1.5 text-xs font-mono font-medium rounded-lg border transition-all ${
                  capturedCode === item.code
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                    : 'bg-neutral-800/80 text-neutral-300 border-neutral-700 hover:bg-neutral-800 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              {t.quickKeys} (Мышь):
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {quickMouseButtons.map((btn) => (
              <button
                key={btn.mb}
                data-modal-action="true"
                type="button"
                onClick={() => {
                  setIsMouse(true);
                  setCapturedMouseButton(btn.mb);
                  setCapturedKey(btn.label);
                  setCapturedCode(`Mouse_${btn.mb}`);
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                  capturedMouseButton === btn.mb
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                    : 'bg-neutral-800/80 text-neutral-300 border-neutral-700 hover:bg-neutral-800 hover:text-white'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
          <div className="flex items-center gap-1.5 text-xs text-neutral-500">
            <AlertCircle className="w-3.5 h-3.5 text-neutral-400" />
            <span>Esc для отмены</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              data-modal-action="true"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-neutral-400 hover:text-neutral-200 bg-neutral-800/60 hover:bg-neutral-800 rounded-lg transition-colors"
            >
              {t.cancelBtn}
            </button>
            <button
              data-modal-action="true"
              disabled={!capturedKey && !capturedMouseButton}
              onClick={handleConfirm}
              className="px-5 py-2 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg shadow-md shadow-amber-500/10 transition-colors flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{lang === 'ru' ? 'Применить кнопку' : 'Apply Key'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
