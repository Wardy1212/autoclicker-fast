import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ClickerConfig, TargetInput, TriggerKey, ClickStats } from './types/clicker';
import { Language, translations } from './translations/i18n';
import { TopNav } from './components/TopNav';
import { ClickerControls } from './components/ClickerControls';
import { LiveSandbox } from './components/LiveSandbox';
import { ScriptExporter } from './components/ScriptExporter';
import { PresetsView } from './components/PresetsView';
import { KeyRecordModal } from './components/KeyRecordModal';
import { PreciseClickTimer } from './utils/workerTimer';
import { playClickSound } from './utils/audio';

const INITIAL_CONFIG: ClickerConfig = {
  target: {
    category: 'mouse',
    mouseButton: 'left',
    key: '',
    code: 'Mouse_left',
    displayName: 'Левая кнопка (ЛКМ)',
  },
  trigger: {
    key: 'F6',
    code: 'F6',
    displayName: 'F6',
  },
  triggerMode: 'toggle',
  intervalMs: 10, // 100 CPS default
  jitterMs: 0,
  clickType: 'single',
  holdDurationMs: 0,
  repeatLimit: 0,
  soundEffect: 'mouse_switch',
};

export default function App() {
  const [lang, setLang] = useState<Language>('ru');
  const [config, setConfig] = useState<ClickerConfig>(INITIAL_CONFIG);
  const [isActive, setIsActive] = useState(false);
  const [activeTab, setActiveTab] = useState<'config' | 'arena' | 'export' | 'presets'>('config');
  const [modalMode, setModalMode] = useState<'trigger' | 'target' | null>(null);

  const [stats, setStats] = useState<ClickStats>({
    totalClicks: 0,
    currentCps: 0,
    peakCps: 0,
    activeSeconds: 0,
    targetHitCount: 0,
  });

  const [recentClicks, setRecentClicks] = useState<{ id: number; time: string; target: string }[]>([]);

  // Sliding window timestamps for accurate CPS computation
  const clickTimestampsRef = useRef<number[]>([]);
  const timerRef = useRef<PreciseClickTimer | null>(null);
  const totalClicksCountRef = useRef(0);
  const isActiveRef = useRef(false);
  const configRef = useRef(config);

  isActiveRef.current = isActive;
  configRef.current = config;

  // Single click action executor
  const executeTick = useCallback(() => {
    const now = performance.now();
    const cfg = configRef.current;

    totalClicksCountRef.current += 1;
    clickTimestampsRef.current.push(now);

    // Audio cue
    playClickSound(cfg.soundEffect);

    // Event stream update
    const targetLabel = cfg.target.category === 'mouse' 
      ? cfg.target.displayName 
      : `Key [${cfg.target.displayName}]`;

    setRecentClicks((prev) => [
      {
        id: totalClicksCountRef.current,
        time: new Date().toLocaleTimeString('ru-RU', { hour12: false, minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 } as Intl.DateTimeFormatOptions),
        target: targetLabel,
      },
      ...prev.slice(0, 19),
    ]);

    // Check repeat limit
    if (cfg.repeatLimit > 0 && totalClicksCountRef.current >= cfg.repeatLimit) {
      setIsActive(false);
      timerRef.current?.stop();
    }
  }, []);

  // Initialize background high-precision timer
  useEffect(() => {
    const timer = new PreciseClickTimer(() => {
      executeTick();
    });
    timerRef.current = timer;

    return () => {
      timer.destroy();
    };
  }, [executeTick]);

  // Handle active state changes
  useEffect(() => {
    if (isActive) {
      timerRef.current?.start(config.intervalMs, config.jitterMs);
    } else {
      timerRef.current?.stop();
    }
  }, [isActive, config.intervalMs, config.jitterMs]);

  // CPS Calculation and Active Duration Timer (runs every 100ms)
  useEffect(() => {
    const interval = window.setInterval(() => {
      const now = performance.now();
      
      // Filter out clicks older than 1000ms
      const recent = clickTimestampsRef.current.filter((t) => now - t <= 1000);
      clickTimestampsRef.current = recent;
      const calculatedCps = recent.length;

      setStats((prev) => {
        const peak = Math.max(prev.peakCps, calculatedCps);
        return {
          ...prev,
          totalClicks: totalClicksCountRef.current,
          currentCps: calculatedCps,
          peakCps: peak,
          activeSeconds: isActiveRef.current ? prev.activeSeconds + 0.1 : prev.activeSeconds,
        };
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Global Keydown & Keyup Hotkey Handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is actively typing in an input
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
        return;
      }

      // Check if modal is open
      if (modalMode !== null) return;

      const trigger = config.trigger;
      const isMatch = 
        e.code.toLowerCase() === trigger.code.toLowerCase() ||
        e.key.toLowerCase() === trigger.key.toLowerCase();

      if (isMatch) {
        e.preventDefault();
        if (config.triggerMode === 'toggle') {
          setIsActive((prev) => !prev);
        } else if (config.triggerMode === 'hold') {
          setIsActive(true);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (modalMode !== null) return;
      if (config.triggerMode === 'hold') {
        const trigger = config.trigger;
        const isMatch = 
          e.code.toLowerCase() === trigger.code.toLowerCase() ||
          e.key.toLowerCase() === trigger.key.toLowerCase();
        
        if (isMatch) {
          e.preventDefault();
          setIsActive(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [config.trigger, config.triggerMode, modalMode]);

  const handleManualClick = () => {
    executeTick();
  };

  const handleResetStats = () => {
    totalClicksCountRef.current = 0;
    clickTimestampsRef.current = [];
    setStats({
      totalClicks: 0,
      currentCps: 0,
      peakCps: 0,
      activeSeconds: 0,
      targetHitCount: 0,
    });
    setRecentClicks([]);
  };

  const handleApplyPreset = (partial: Partial<ClickerConfig>) => {
    setConfig((prev) => ({
      ...prev,
      ...partial,
      target: partial.target ? { ...prev.target, ...partial.target } : prev.target,
      trigger: partial.trigger ? { ...prev.trigger, ...partial.trigger } : prev.trigger,
    }));
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col antialiased">
      {/* Top Bar (Adhering to Top Bar Contract) */}
      <TopNav
        lang={lang}
        onToggleLang={() => setLang((prev) => (prev === 'ru' ? 'en' : 'ru'))}
        isActive={isActive}
        onToggleClicker={() => setIsActive((prev) => !prev)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        triggerName={config.trigger.displayName}
      />

      {/* Main Viewport Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        
        {/* Content Tabs */}
        {activeTab === 'config' && (
          <ClickerControls
            config={config}
            onChangeConfig={setConfig}
            lang={lang}
            onOpenTriggerModal={() => setModalMode('trigger')}
            onOpenTargetModal={() => setModalMode('target')}
            isActive={isActive}
            onToggleActive={() => setIsActive((prev) => !prev)}
          />
        )}

        {activeTab === 'arena' && (
          <LiveSandbox
            stats={stats}
            onResetStats={handleResetStats}
            lang={lang}
            isActive={isActive}
            onToggleActive={() => setIsActive((prev) => !prev)}
            config={config}
            onManualClick={handleManualClick}
            recentClicks={recentClicks}
          />
        )}

        {activeTab === 'export' && (
          <ScriptExporter
            config={config}
            lang={lang}
          />
        )}

        {activeTab === 'presets' && (
          <PresetsView
            currentConfig={config}
            onApplyConfig={handleApplyPreset}
            lang={lang}
          />
        )}
      </main>

      {/* Key / Mouse Button Capture Modal */}
      <KeyRecordModal
        isOpen={modalMode !== null}
        onClose={() => setModalMode(null)}
        lang={lang}
        mode={modalMode || 'trigger'}
        onSaveTrigger={(trig: TriggerKey) => setConfig((c) => ({ ...c, trigger: trig }))}
        onSaveTarget={(tgt: TargetInput) => setConfig((c) => ({ ...c, target: tgt }))}
      />

      {/* Quiet Footer adhering to anti-slop guidelines */}
      <footer className="w-full border-t border-neutral-900 py-4 text-center text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>HyperClick · {translations[lang].appSubtitle}</span>
          <span className="font-mono text-[11px] text-neutral-600">
            {lang === 'ru' ? 'Высокоточный таймер Web Worker (1мс / 1000 CPS)' : 'High-precision Web Worker Engine'}
          </span>
        </div>
      </footer>
    </div>
  );
}
