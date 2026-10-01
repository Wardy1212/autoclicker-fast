import React, { useState, useEffect } from 'react';
import { 
  Target, 
  RotateCcw, 
  Flame, 
  Trophy, 
  Activity, 
  CheckCircle,
  Play,
  Square
} from 'lucide-react';
import { ClickStats, ClickerConfig } from '../types/clicker';
import { Language, translations } from '../translations/i18n';

interface LiveSandboxProps {
  stats: ClickStats;
  onResetStats: () => void;
  lang: Language;
  isActive: boolean;
  onToggleActive: () => void;
  config: ClickerConfig;
  onManualClick: () => void;
  recentClicks: { id: number; time: string; target: string }[];
}

export const LiveSandbox: React.FC<LiveSandboxProps> = ({
  stats,
  onResetStats,
  lang,
  isActive,
  onToggleActive,
  config,
  onManualClick,
  recentClicks,
}) => {
  const t = translations[lang];

  // Target Dummy Game (HP bar that takes damage from clicks)
  const [targetHp, setTargetHp] = useState(100);
  const [destroyedCount, setDestroyedCount] = useState(0);
  const [isHitAnim, setIsHitAnim] = useState(false);

  // Speed Benchmark
  const [benchmarkActive, setBenchmarkActive] = useState(false);
  const [benchmarkCountdown, setBenchmarkCountdown] = useState(5);
  const [benchmarkResult, setBenchmarkResult] = useState<{ cps: number; total: number } | null>(null);

  // Sync HP damage with stats clicks
  useEffect(() => {
    if (stats.totalClicks > 0) {
      setIsHitAnim(true);
      const timer = setTimeout(() => setIsHitAnim(false), 50);

      setTargetHp((prev) => {
        const next = prev - 2;
        if (next <= 0) {
          setDestroyedCount((d) => d + 1);
          return 100;
        }
        return next;
      });

      return () => clearTimeout(timer);
    }
  }, [stats.totalClicks]);

  // Benchmark loop
  useEffect(() => {
    let interval: number | null = null;
    if (benchmarkActive) {
      const startClicks = stats.totalClicks;
      let secondsLeft = 5;
      setBenchmarkCountdown(5);

      interval = window.setInterval(() => {
        secondsLeft -= 1;
        setBenchmarkCountdown(secondsLeft);

        if (secondsLeft <= 0) {
          if (interval) clearInterval(interval);
          setBenchmarkActive(false);
          const totalInPeriod = stats.totalClicks - startClicks;
          const measuredCps = Math.round((totalInPeriod / 5) * 10) / 10;
          setBenchmarkResult({
            cps: measuredCps,
            total: totalInPeriod,
          });
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [benchmarkActive, stats.totalClicks]);

  const handleStartBenchmark = () => {
    setBenchmarkResult(null);
    if (!isActive) {
      onToggleActive();
    }
    setBenchmarkActive(true);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Metrics Row (Single elevation cards, tabular numerals) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        {/* Total Clicks */}
        <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
            <span>{t.totalClicks}</span>
            <Target className="w-3.5 h-3.5 text-neutral-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-neutral-100 tabular-nums">
            {stats.totalClicks.toLocaleString()}
          </div>
          <span className="text-[11px] text-neutral-500 mt-1 block">
            {destroyedCount > 0 ? `${destroyedCount} ${lang === 'ru' ? 'целей уничтожено' : 'targets destroyed'}` : `${config.intervalMs}ms interval`}
          </span>
        </div>

        {/* Current CPS */}
        <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
            <span>{t.currentCps}</span>
            <Activity className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-amber-400 tabular-nums">
            {stats.currentCps}
          </div>
          <span className="text-[11px] text-neutral-500 mt-1 block">
            {isActive ? (lang === 'ru' ? 'В реальном времени' : 'Live stream') : (lang === 'ru' ? 'В покое' : 'Idle')}
          </span>
        </div>

        {/* Peak CPS */}
        <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
            <span>{t.peakCps}</span>
            <Flame className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-rose-400 tabular-nums">
            {stats.peakCps}
          </div>
          <span className="text-[11px] text-neutral-500 mt-1 block">
            {lang === 'ru' ? 'Рекорд текущей сессии' : 'Session best'}
          </span>
        </div>

        {/* Active Session Time */}
        <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
            <span>{t.sessionTime}</span>
            <button
              type="button"
              onClick={onResetStats}
              title={t.resetStats}
              className="text-neutral-500 hover:text-neutral-200 transition-colors p-0.5 rounded"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-neutral-100 tabular-nums">
            {formatTime(stats.activeSeconds)}
          </div>
          <button 
            type="button"
            onClick={onResetStats}
            className="text-[11px] text-neutral-400 hover:text-amber-400 mt-1 transition-colors text-left"
          >
            {t.resetStats}
          </button>
        </div>
      </div>

      {/* Main Interactive Target & Benchmark Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Interactive Target Zone (8 cols) */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-800">
              <div>
                <h3 className="text-sm font-semibold text-neutral-100">{t.arenaTitle}</h3>
                <p className="text-xs text-neutral-400 mt-0.5">{t.arenaDesc}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onToggleActive}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-rose-500 text-white'
                      : 'bg-neutral-800 text-neutral-200 hover:bg-neutral-750 border border-neutral-700'
                  }`}
                >
                  {isActive ? <Square className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
                  <span>{isActive ? t.stopClicker : t.startClicker}</span>
                  <span className="font-mono text-[10px] opacity-75">[{config.trigger.displayName}]</span>
                </button>
              </div>
            </div>

            {/* Target Health Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-neutral-400 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t.targetHealth}</span>
                </span>
                <span className="font-mono text-neutral-300 font-medium">{targetHp}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-neutral-950 overflow-hidden border border-neutral-800">
                <div 
                  className={`h-full transition-all duration-75 ${
                    targetHp > 50 ? 'bg-amber-400' : targetHp > 20 ? 'bg-orange-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${targetHp}%` }}
                />
              </div>
            </div>
          </div>

          {/* Interactive Center Click Target Pad */}
          <div className="my-6 flex flex-col items-center justify-center">
            <button
              type="button"
              onClick={onManualClick}
              className={`group relative w-48 h-48 sm:w-56 sm:h-56 rounded-3xl flex flex-col items-center justify-center transition-all select-none focus:outline-none ${
                isHitAnim || isActive
                  ? 'scale-[0.98] ring-4 ring-amber-400/40 bg-neutral-800/90 shadow-2xl shadow-amber-500/10'
                  : 'hover:scale-[1.01] bg-neutral-950 border-2 border-neutral-750 hover:border-amber-500/40'
              }`}
            >
              {/* Outer pulsing ring when active */}
              {isActive && (
                <div className="absolute inset-0 rounded-3xl border-2 border-amber-400/50 animate-ping opacity-30 pointer-events-none" />
              )}

              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-3 transition-colors ${
                isActive 
                  ? 'bg-amber-400 text-neutral-950 shadow-lg shadow-amber-400/20' 
                  : 'bg-neutral-800 text-neutral-300 group-hover:text-amber-400'
              }`}>
                <Target className="w-10 h-10" />
              </div>

              <span className="text-sm font-bold text-neutral-100 font-mono tracking-wide">
                {isActive ? (lang === 'ru' ? 'ПРИЁМ КЛИКОВ...' : 'RECEIVING CLICKS...') : (lang === 'ru' ? 'НАЖМИ ИЛИ НАВЕДИ' : 'CLICK OR PRESS HOTKEY')}
              </span>
              
              <span className="text-xs text-neutral-400 mt-1 font-mono">
                {config.target.category === 'mouse' 
                  ? config.target.displayName 
                  : `Key [${config.target.displayName}]`}
              </span>
            </button>
            <p className="text-xs text-neutral-500 mt-3 text-center">
              {lang === 'ru' 
                ? 'Нажмите кнопку мыши прямо по мишени для ручного клика или активируйте авто-кликер хоткеем' 
                : 'Click target manually or press activation hotkey to stream ultra-fast clicks'}
            </p>
          </div>

          {/* Benchmark Banner & Trigger */}
          <div className="pt-4 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-neutral-300">
                {benchmarkResult 
                  ? `${t.benchmarkResult} ${benchmarkResult.cps} CPS (${benchmarkResult.total} clicks in 5s)`
                  : (lang === 'ru' ? 'Проверьте точную производительность браузера' : 'Measure exact real browser CPS')}
              </span>
            </div>

            <button
              type="button"
              disabled={benchmarkActive}
              onClick={handleStartBenchmark}
              className="px-4 py-2 text-xs font-semibold text-neutral-200 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 rounded-xl transition-colors border border-neutral-700 whitespace-nowrap"
            >
              {benchmarkActive ? `${t.benchmarkRunning} (${benchmarkCountdown}s)` : t.benchmarkBtn}
            </button>
          </div>
        </div>

        {/* Live Stream / Event Log (4 cols) */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  {lang === 'ru' ? 'Поток событий' : 'Live Event Stream'}
                </h4>
              </div>
              <span className="text-[10px] font-mono text-neutral-500">
                {recentClicks.length} events
              </span>
            </div>

            <p className="text-[11px] text-neutral-500 mb-3">
              {lang === 'ru' ? 'Фиксация каждого зарегистрированного тапа в реальном времени:' : 'High-resolution registered input ticks:'}
            </p>

            <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
              {recentClicks.length === 0 ? (
                <div className="py-12 text-center text-xs text-neutral-600">
                  {lang === 'ru' ? 'События пока отсутствуют. Запустите кликер!' : 'No events yet. Start the clicker!'}
                </div>
              ) : (
                recentClicks.slice(0, 10).map((ev) => (
                  <div 
                    key={ev.id}
                    className="p-2 rounded-lg bg-neutral-950/70 border border-neutral-800/80 flex items-center justify-between text-xs font-mono"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <span className="text-neutral-300 font-medium">{ev.target}</span>
                    </div>
                    <span className="text-neutral-500 text-[10px]">{ev.time}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-800/80 mt-4 text-[11px] text-neutral-500 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>
              {lang === 'ru' 
                ? 'Web Worker таймер изолирован от основного потока' 
                : 'Web Worker thread active for drift-free timing'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
