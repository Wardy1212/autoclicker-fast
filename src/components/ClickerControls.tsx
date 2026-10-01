import React from 'react';
import { 
  Sliders, 
  Mouse, 
  Keyboard, 
  Zap, 
  Volume2, 
  RefreshCw, 
  ShieldCheck, 
  Clock, 
  Flame,
  CheckCircle2
} from 'lucide-react';
import { ClickerConfig, MouseButtonType, TriggerMode, ClickType } from '../types/clicker';
import { Language, translations } from '../translations/i18n';

interface ClickerControlsProps {
  config: ClickerConfig;
  onChangeConfig: (newConfig: ClickerConfig) => void;
  lang: Language;
  onOpenTriggerModal: () => void;
  onOpenTargetModal: () => void;
  isActive: boolean;
  onToggleActive: () => void;
}

export const ClickerControls: React.FC<ClickerControlsProps> = ({
  config,
  onChangeConfig,
  lang,
  onOpenTriggerModal,
  onOpenTargetModal,
  isActive,
  onToggleActive,
}) => {
  const t = translations[lang];

  const updateField = <K extends keyof ClickerConfig>(field: K, val: ClickerConfig[K]) => {
    onChangeConfig({
      ...config,
      [field]: val,
    });
  };

  const handleIntervalChange = (val: number) => {
    const validVal = Math.max(1, Math.min(10000, val || 1));
    updateField('intervalMs', validVal);
  };

  const calculatedCps = Math.round((1000 / Math.max(1, config.intervalMs)) * 10) / 10;

  const handleCpsSlider = (cps: number) => {
    const clampedCps = Math.max(1, Math.min(1000, cps));
    const newInterval = Math.max(1, Math.round(1000 / clampedCps));
    updateField('intervalMs', newInterval);
  };

  const mouseButtons: { type: MouseButtonType; label: string }[] = [
    { type: 'left', label: t.mouseLeft },
    { type: 'right', label: t.mouseRight },
    { type: 'middle', label: t.mouseMiddle },
    { type: 'mouse4', label: t.mouse4 },
    { type: 'mouse5', label: t.mouse5 },
  ];

  const quickSpeeds = [
    { label: '1000 CPS (1ms)', ms: 1, extreme: true },
    { label: '200 CPS (5ms)', ms: 5, extreme: false },
    { label: '100 CPS (10ms)', ms: 10, extreme: false },
    { label: '50 CPS (20ms)', ms: 20, extreme: false },
    { label: '16 CPS (PvP)', ms: 62, extreme: false },
    { label: '10 CPS (Farm)', ms: 100, extreme: false },
  ];

  return (
    <div className="space-y-6">
      {/* Active Status Hero Card */}
      <div className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 ${
        isActive 
          ? 'bg-rose-950/20 border-rose-500/40 shadow-lg shadow-rose-950/30' 
          : 'bg-neutral-900/90 border-neutral-800'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-sm ${
              isActive 
                ? 'bg-rose-500 text-white animate-pulse' 
                : 'bg-neutral-800 text-neutral-300 border border-neutral-700'
            }`}>
              {config.trigger.displayName || 'F6'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold uppercase tracking-wider ${
                  isActive ? 'text-rose-400' : 'text-neutral-400'
                }`}>
                  {isActive ? t.statusActive : t.statusIdle}
                </span>
                <span className="text-neutral-600">·</span>
                <span className="text-xs text-neutral-400">
                  {config.triggerMode === 'toggle' ? t.modeToggle : t.modeHold}
                </span>
              </div>
              <p className="text-sm font-semibold text-neutral-200 mt-0.5">
                {lang === 'ru' 
                  ? `Цель: ${config.target.category === 'mouse' ? config.target.displayName : `Клавиша [${config.target.displayName}]`} · ${config.intervalMs} мс (${calculatedCps} CPS)`
                  : `Target: ${config.target.category === 'mouse' ? config.target.displayName : `Key [${config.target.displayName}]`} · ${config.intervalMs}ms (${calculatedCps} CPS)`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenTriggerModal}
              className="px-3.5 py-2 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-750 border border-neutral-750 rounded-xl transition-colors"
            >
              {t.changeKey}
            </button>
            <button
              onClick={onToggleActive}
              className={`px-5 py-2 text-xs font-semibold rounded-xl transition-all shadow-md ${
                isActive
                  ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20'
                  : 'bg-amber-400 hover:bg-amber-300 text-neutral-950 shadow-amber-500/10'
              }`}
            >
              {isActive ? t.stopClicker : t.startClicker}
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Settings Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Module 1: Trigger & Target Configuration (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Target Button Selector */}
          <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-800/80">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-semibold text-neutral-100">{t.targetSection}</h3>
              </div>
              <span className="text-xs text-neutral-500">{t.targetDesc}</span>
            </div>

            {/* Target Category Tabs (Mouse vs Keyboard) */}
            <div className="flex items-center gap-2 p-1 bg-neutral-950 rounded-xl border border-neutral-800 mb-4">
              <button
                type="button"
                onClick={() => updateField('target', {
                  ...config.target,
                  category: 'mouse',
                  mouseButton: 'left',
                  displayName: t.mouseLeft,
                })}
                className={`flex-1 py-2 px-3 text-xs font-medium rounded-lg flex items-center justify-center gap-2 transition-all ${
                  config.target.category === 'mouse'
                    ? 'bg-neutral-800 text-amber-300 shadow-sm border border-neutral-750'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Mouse className="w-3.5 h-3.5" />
                <span>{t.targetCategoryMouse}</span>
              </button>
              <button
                type="button"
                onClick={() => updateField('target', {
                  ...config.target,
                  category: 'keyboard',
                  key: 'e',
                  code: 'KeyE',
                  displayName: 'E',
                })}
                className={`flex-1 py-2 px-3 text-xs font-medium rounded-lg flex items-center justify-center gap-2 transition-all ${
                  config.target.category === 'keyboard'
                    ? 'bg-neutral-800 text-amber-300 shadow-sm border border-neutral-750'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Keyboard className="w-3.5 h-3.5" />
                <span>{t.targetCategoryKeyboard}</span>
              </button>
            </div>

            {/* If Mouse Category */}
            {config.target.category === 'mouse' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {mouseButtons.map((btn) => (
                    <button
                      key={btn.type}
                      type="button"
                      onClick={() => updateField('target', {
                        ...config.target,
                        mouseButton: btn.type,
                        displayName: btn.label,
                      })}
                      className={`p-3 text-left rounded-xl border transition-all ${
                        config.target.mouseButton === btn.type
                          ? 'bg-amber-500/10 border-amber-500/50 text-neutral-100 shadow-sm'
                          : 'bg-neutral-950/40 border-neutral-800/80 text-neutral-400 hover:text-neutral-200 hover:border-neutral-750'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <Mouse className={`w-3.5 h-3.5 ${config.target.mouseButton === btn.type ? 'text-amber-400' : 'text-neutral-500'}`} />
                        {config.target.mouseButton === btn.type && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                        )}
                      </div>
                      <span className="text-xs font-medium block truncate">{btn.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* If Keyboard Category */}
            {config.target.category === 'keyboard' && (
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-neutral-800 border border-neutral-700 flex flex-col items-center justify-center font-mono font-bold text-amber-400 text-lg shadow-inner">
                      {config.target.displayName || 'E'}
                    </div>
                    <div>
                      <span className="text-xs text-neutral-400 block">
                        {lang === 'ru' ? 'Нажимаемая клавиша клавиатуры' : 'Target Keyboard Key'}
                      </span>
                      <span className="text-sm font-semibold text-neutral-200 font-mono">
                        {config.target.code || 'KeyE'}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={onOpenTargetModal}
                    className="px-4 py-2 text-xs font-medium text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
                  >
                    <Keyboard className="w-3.5 h-3.5" />
                    <span>{t.recordAnyKey}</span>
                  </button>
                </div>

                {/* Quick key chips */}
                <div className="pt-2">
                  <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-2">
                    {t.quickKeys}:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { key: ' ', code: 'Space', name: 'Space' },
                      { key: 'e', code: 'KeyE', name: 'E' },
                      { key: 'f', code: 'KeyF', name: 'F' },
                      { key: 'q', code: 'KeyQ', name: 'Q' },
                      { key: 'r', code: 'KeyR', name: 'R' },
                      { key: 'Shift', code: 'ShiftLeft', name: 'Shift' },
                      { key: 'Enter', code: 'Enter', name: 'Enter' },
                      { key: '1', code: 'Digit1', name: '1' },
                    ].map((k) => (
                      <button
                        key={k.code}
                        type="button"
                        onClick={() => updateField('target', {
                          category: 'keyboard',
                          mouseButton: 'left',
                          key: k.key,
                          code: k.code,
                          displayName: k.name,
                        })}
                        className={`px-3 py-1.5 text-xs font-mono rounded-lg border transition-all ${
                          config.target.code === k.code
                            ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                            : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                        }`}
                      >
                        {k.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Click Type Options (Single, Double, Triple) */}
            <div className="mt-5 pt-4 border-t border-neutral-800/80">
              <label className="text-xs font-semibold text-neutral-400 block mb-2">
                {t.clickType}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['single', 'double', 'triple'] as ClickType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => updateField('clickType', type)}
                    className={`py-2 px-3 text-xs font-medium rounded-lg border text-center transition-all ${
                      config.clickType === type
                        ? 'bg-neutral-800 text-amber-300 border-amber-500/40'
                        : 'bg-neutral-950 border-neutral-800/80 text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    {type === 'single' ? t.clickSingle : type === 'double' ? t.clickDouble : t.clickTriple}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Trigger Activation Hotkey & Mode */}
          <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-800/80">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-semibold text-neutral-100">{t.activationSection}</h3>
              </div>
              <span className="text-xs text-neutral-500">{t.activationDesc}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Hotkey binder card */}
              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center font-mono font-bold text-amber-400 text-sm">
                    {config.trigger.displayName || 'F6'}
                  </div>
                  <div>
                    <span className="text-xs text-neutral-400 block">
                      {lang === 'ru' ? 'Текущий хоткей' : 'Current Hotkey'}
                    </span>
                    <span className="text-xs font-medium text-neutral-200">
                      {config.trigger.displayName}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onOpenTriggerModal}
                  className="px-3 py-1.5 text-xs font-medium text-neutral-200 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors border border-neutral-700"
                >
                  {t.changeKey}
                </button>
              </div>

              {/* Trigger Mode (Toggle vs Hold) */}
              <div className="grid grid-cols-2 gap-2">
                {(['toggle', 'hold'] as TriggerMode[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => updateField('triggerMode', m)}
                    className={`p-3 text-left rounded-xl border transition-all ${
                      config.triggerMode === m
                        ? 'bg-amber-500/10 border-amber-500/50 text-neutral-100'
                        : 'bg-neutral-950 border-neutral-800/80 text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    <span className="text-xs font-semibold block text-neutral-200">
                      {m === 'toggle' ? t.modeToggle : t.modeHold}
                    </span>
                    <span className="text-[11px] text-neutral-500 block mt-1 leading-snug">
                      {m === 'toggle' ? t.modeToggleDesc : t.modeHoldDesc}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Module 2: Speed, Precision, Jitter & Audio (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Speed & Intervals */}
          <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-800/80">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-semibold text-neutral-100">{t.speedSection}</h3>
              </div>
              <div className="flex items-center gap-1.5 text-amber-400 text-xs font-mono font-bold">
                <Flame className="w-3.5 h-3.5" />
                <span>{calculatedCps} CPS</span>
              </div>
            </div>

            {/* Milliseconds Input & CPS Display */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="interval-input" className="text-xs font-medium text-neutral-300">
                    {t.intervalMs}
                  </label>
                  <span className="text-xs text-neutral-500">{t.intervalHint}</span>
                </div>
                <div className="relative">
                  <input
                    id="interval-input"
                    type="number"
                    min="1"
                    max="10000"
                    step="1"
                    value={config.intervalMs}
                    onChange={(e) => handleIntervalChange(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl text-neutral-100 font-mono text-sm tracking-wider outline-none transition-colors"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-neutral-500">
                    ms
                  </div>
                </div>
              </div>

              {/* CPS Interactive Slider */}
              <div>
                <div className="flex items-center justify-between text-xs text-neutral-400 mb-1.5">
                  <span>{t.cpsLabel}</span>
                  <span className="font-mono font-bold text-amber-400">{calculatedCps} / sec</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="500"
                  step="1"
                  value={Math.min(500, Math.round(1000 / Math.max(1, config.intervalMs)))}
                  onChange={(e) => handleCpsSlider(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer h-1.5 bg-neutral-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] font-mono text-neutral-600 mt-1">
                  <span>1 CPS</span>
                  <span>50 CPS</span>
                  <span>200 CPS</span>
                  <span>500+ CPS</span>
                </div>
              </div>

              {/* Quick Speeds */}
              <div>
                <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-2">
                  {lang === 'ru' ? 'Быстрые скорости:' : 'Speed Presets:'}
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {quickSpeeds.map((s) => (
                    <button
                      key={s.ms}
                      type="button"
                      onClick={() => updateField('intervalMs', s.ms)}
                      className={`px-2.5 py-1.5 text-xs font-mono rounded-lg border text-left flex items-center justify-between transition-all ${
                        config.intervalMs === s.ms
                          ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                          : 'bg-neutral-950 border-neutral-800/80 text-neutral-400 hover:text-neutral-200'
                      }`}
                    >
                      <span className="truncate">{s.label}</span>
                      {s.extreme && (
                        <span className="text-[9px] px-1 bg-amber-500/30 text-amber-200 rounded">MAX</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Jitter / Randomization (Anti-Detection) */}
            <div className="mt-5 pt-4 border-t border-neutral-800/80">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <label htmlFor="jitter-slider" className="text-xs font-medium text-neutral-300">
                    {t.jitterLabel}
                  </label>
                </div>
                <span className="text-xs font-mono font-semibold text-neutral-300">
                  ± {config.jitterMs} ms
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 mb-2">
                {t.jitterDesc}
              </p>
              <input
                id="jitter-slider"
                type="range"
                min="0"
                max="30"
                step="1"
                value={config.jitterMs}
                onChange={(e) => updateField('jitterMs', Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-neutral-800 rounded-lg"
              />
              <div className="flex items-center justify-between text-[11px] text-neutral-500 font-mono mt-1">
                <span>{config.jitterMs === 0 ? (lang === 'ru' ? 'Отключено (Точный тайминг)' : 'Disabled') : `[${Math.max(1, config.intervalMs - config.jitterMs)}ms — ${config.intervalMs + config.jitterMs}ms]`}</span>
                <span>Max ±30ms</span>
              </div>
            </div>

            {/* Repeat Limit */}
            <div className="mt-4 pt-4 border-t border-neutral-800/80">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 text-neutral-400" />
                  <span className="text-xs font-medium text-neutral-300">{t.repeatLimit}</span>
                </div>
                <span className="text-xs text-neutral-500">
                  {config.repeatLimit === 0 ? t.repeatInfinite : `${config.repeatLimit} ${t.clicksUnit}`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateField('repeatLimit', 0)}
                  className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-lg border transition-all ${
                    config.repeatLimit === 0
                      ? 'bg-neutral-800 text-amber-300 border-amber-500/40'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                  }`}
                >
                  {t.repeatInfinite}
                </button>
                <button
                  type="button"
                  onClick={() => updateField('repeatLimit', config.repeatLimit === 0 ? 100 : config.repeatLimit)}
                  className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-lg border transition-all ${
                    config.repeatLimit > 0
                      ? 'bg-neutral-800 text-amber-300 border-amber-500/40'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                  }`}
                >
                  {t.repeatExact}...
                </button>
              </div>
              {config.repeatLimit > 0 && (
                <div className="mt-2">
                  <input
                    type="number"
                    min="1"
                    max="100000"
                    step="10"
                    value={config.repeatLimit}
                    onChange={(e) => updateField('repeatLimit', Math.max(1, Number(e.target.value)))}
                    className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs font-mono text-neutral-200"
                    placeholder="100"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Audio Feedback Switcher */}
          <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-800/80">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-semibold text-neutral-100">{t.soundSection}</h3>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { id: 'none', label: t.soundNone },
                { id: 'mouse_switch', label: t.soundMicroswitch },
                { id: 'mechanical_blue', label: t.soundBlue },
                { id: 'mechanical_red', label: t.soundRed },
                { id: 'blaster', label: t.soundBlaster },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => updateField('soundEffect', s.id as ClickerConfig['soundEffect'])}
                  className={`p-2.5 text-xs font-medium rounded-xl border text-left transition-all ${
                    config.soundEffect === s.id
                      ? 'bg-amber-500/10 border-amber-500/50 text-amber-300'
                      : 'bg-neutral-950 border-neutral-800/80 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
