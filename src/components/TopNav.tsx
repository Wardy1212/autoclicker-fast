import React from 'react';
import { Play, Square, Languages } from 'lucide-react';
import { Language, translations } from '../translations/i18n';

interface TopNavProps {
  lang: Language;
  onToggleLang: () => void;
  isActive: boolean;
  onToggleClicker: () => void;
  activeTab: 'config' | 'arena' | 'export' | 'presets';
  setActiveTab: (tab: 'config' | 'arena' | 'export' | 'presets') => void;
  triggerName: string;
}

export const TopNav: React.FC<TopNavProps> = ({
  lang,
  onToggleLang,
  isActive,
  onToggleClicker,
  activeTab,
  setActiveTab,
  triggerName,
}) => {
  const t = translations[lang];

  return (
    <header className="sticky top-0 z-40 w-full bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('config');
            }}
            className="text-lg font-bold tracking-tight text-white flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 ring-4 ring-amber-400/20 animate-pulse"></span>
            HyperClick
          </a>
          <span className="text-xs text-neutral-500 hidden sm:inline-block">
            v2.4
          </span>
        </div>

        {/* Zone 2: Clean text navigation links */}
        <nav className="flex items-center gap-1 sm:gap-4 text-xs sm:text-sm font-medium">
          <button
            onClick={() => setActiveTab('config')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'config'
                ? 'text-amber-400 bg-neutral-900 border border-neutral-800'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            {t.navConfig}
          </button>
          <button
            onClick={() => setActiveTab('arena')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'arena'
                ? 'text-amber-400 bg-neutral-900 border border-neutral-800'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            {t.navArena}
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'export'
                ? 'text-amber-400 bg-neutral-900 border border-neutral-800'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            {t.navExport}
          </button>
          <button
            onClick={() => setActiveTab('presets')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'presets'
                ? 'text-amber-400 bg-neutral-900 border border-neutral-800'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            {t.navPresets}
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onToggleLang}
            title={lang === 'ru' ? 'Switch to English' : 'Переключить на русский'}
            className="p-1.5 text-xs text-neutral-400 hover:text-neutral-200 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-lg transition-colors flex items-center gap-1"
          >
            <Languages className="w-3.5 h-3.5" />
            <span className="font-mono uppercase">{lang}</span>
          </button>

          <button
            onClick={onToggleClicker}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 whitespace-nowrap shadow-sm ${
              isActive
                ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20 ring-2 ring-rose-400/40 animate-pulse'
                : 'bg-amber-400 hover:bg-amber-300 text-neutral-950 shadow-amber-500/20'
            }`}
          >
            {isActive ? (
              <>
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>{t.stopClicker}</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{t.startClicker}</span>
              </>
            )}
            <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-black/20 rounded">
              {triggerName}
            </kbd>
          </button>
        </div>
      </div>
    </header>
  );
};
