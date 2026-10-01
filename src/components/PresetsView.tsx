import React, { useState, useEffect } from 'react';
import { 
  Bookmark, 
  Trash2, 
  Plus, 
  Check, 
  Flame, 
  Gamepad2, 
  Zap, 
  Clock,
  Sparkles
} from 'lucide-react';
import { ClickerConfig, PresetProfile } from '../types/clicker';
import { Language, translations } from '../translations/i18n';
import { DEFAULT_PRESETS } from '../utils/presets';

interface PresetsViewProps {
  currentConfig: ClickerConfig;
  onApplyConfig: (cfg: Partial<ClickerConfig>) => void;
  lang: Language;
}

export const PresetsView: React.FC<PresetsViewProps> = ({
  currentConfig,
  onApplyConfig,
  lang,
}) => {
  const t = translations[lang];
  const [customPresets, setCustomPresets] = useState<PresetProfile[]>([]);
  const [newPresetName, setNewPresetName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [appliedId, setAppliedId] = useState<string | null>(null);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('hyperclick_custom_presets');
      if (saved) {
        setCustomPresets(JSON.parse(saved));
      }
    } catch {
      // Local storage disabled or error
    }
  }, []);

  const handleSaveCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPresetName.trim()) return;

    const newProfile: PresetProfile = {
      id: `custom_${Date.now()}`,
      name: newPresetName.trim(),
      nameRu: newPresetName.trim(),
      description: `Custom profile (${currentConfig.intervalMs}ms interval, target: ${currentConfig.target.displayName})`,
      descriptionRu: `Пользовательский профиль (${currentConfig.intervalMs} мс, цель: ${currentConfig.target.displayName})`,
      tag: 'Custom',
      config: { ...currentConfig },
    };

    const updated = [newProfile, ...customPresets];
    setCustomPresets(updated);
    try {
      localStorage.setItem('hyperclick_custom_presets', JSON.stringify(updated));
    } catch {
      // Ignore
    }
    setNewPresetName('');
    setIsSaving(false);
  };

  const handleDeleteCustom = (id: string) => {
    const updated = customPresets.filter((p) => p.id !== id);
    setCustomPresets(updated);
    try {
      localStorage.setItem('hyperclick_custom_presets', JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const handleApply = (preset: PresetProfile) => {
    onApplyConfig(preset.config);
    setAppliedId(preset.id);
    setTimeout(() => setAppliedId(null), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header bar with save button */}
      <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-neutral-100 flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-amber-400" />
            <span>{t.presetsTitle}</span>
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            {lang === 'ru' 
              ? 'Готовые конфигурации для популярных игр, бенчмарков и гринда' 
              : 'Pre-tuned configurations for gaming, benchmarks, and repetitive tasks'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsSaving(!isSaving)}
          className="px-4 py-2 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm shadow-amber-500/10 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>{t.customPresetSave}</span>
        </button>
      </div>

      {/* Save Modal / Dropdown Form */}
      {isSaving && (
        <form 
          onSubmit={handleSaveCustom}
          className="p-4 rounded-xl bg-neutral-900 border border-amber-500/30 flex flex-col sm:flex-row items-center gap-3 animate-in fade-in"
        >
          <div className="flex-1 w-full">
            <input
              type="text"
              required
              value={newPresetName}
              onChange={(e) => setNewPresetName(e.target.value)}
              placeholder={lang === 'ru' ? 'Введите название профиля (например: Мой кликер в CS)...' : 'Enter profile name...'}
              className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-100 outline-none focus:border-amber-500"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => setIsSaving(false)}
              className="px-3 py-2 text-xs text-neutral-400 hover:text-neutral-200"
            >
              {t.cancelBtn}
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg"
            >
              {t.saveBtn}
            </button>
          </div>
        </form>
      )}

      {/* Default Built-in Presets */}
      <div>
        <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-3">
          {lang === 'ru' ? 'Рекомендованные игровые и турбо-пресеты:' : 'Recommended Gaming & Turbo Presets:'}
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {DEFAULT_PRESETS.map((p) => {
            const isApplied = appliedId === p.id;
            return (
              <div 
                key={p.id}
                className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-neutral-800 text-amber-400 border border-neutral-700">
                      {p.tag}
                    </span>
                    <span className="text-xs font-mono text-neutral-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-neutral-500" />
                      <span>{p.config.intervalMs}ms</span>
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-neutral-100 mb-1">
                    {lang === 'ru' ? p.nameRu : p.name}
                  </h4>
                  <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                    {lang === 'ru' ? p.descriptionRu : p.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between">
                  <div className="text-[11px] font-mono text-neutral-500">
                    {p.config.target?.category === 'mouse' ? 'Mouse LMB' : `Key [${p.config.target?.displayName}]`}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleApply(p)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 ${
                      isApplied
                        ? 'bg-emerald-500 text-white'
                        : 'bg-neutral-800 hover:bg-neutral-750 text-neutral-200 border border-neutral-700'
                    }`}
                  >
                    {isApplied ? <Check className="w-3.5 h-3.5" /> : <Zap className="w-3.5 h-3.5 text-amber-400" />}
                    <span>{isApplied ? (lang === 'ru' ? 'Применено' : 'Applied') : t.loadPreset}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* User Custom Saved Presets */}
      {customPresets.length > 0 && (
        <div className="pt-4 border-t border-neutral-800">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-3">
            {t.savedPresets}:
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {customPresets.map((p) => {
              const isApplied = appliedId === p.id;
              return (
                <div 
                  key={p.id}
                  className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-neutral-800 text-emerald-400 border border-neutral-700">
                        {p.tag}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteCustom(p.id)}
                        className="text-neutral-500 hover:text-rose-400 transition-colors p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <h4 className="text-sm font-semibold text-neutral-100 mb-1">
                      {p.name}
                    </h4>
                    <p className="text-xs text-neutral-400 leading-relaxed mb-3">
                      {lang === 'ru' ? p.descriptionRu : p.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-neutral-500">
                      {p.config.intervalMs}ms · {p.config.trigger?.displayName}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleApply(p)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 ${
                        isApplied
                          ? 'bg-emerald-500 text-white'
                          : 'bg-neutral-800 hover:bg-neutral-750 text-neutral-200 border border-neutral-700'
                      }`}
                    >
                      {isApplied ? <Check className="w-3.5 h-3.5" /> : <Zap className="w-3.5 h-3.5 text-amber-400" />}
                      <span>{isApplied ? (lang === 'ru' ? 'Применено' : 'Applied') : t.loadPreset}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
