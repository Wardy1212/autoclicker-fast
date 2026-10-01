import React, { useState } from 'react';
import { 
  Download, 
  Copy, 
  Check, 
  Terminal, 
  FileCode, 
  Info,
  ExternalLink
} from 'lucide-react';
import { ClickerConfig } from '../types/clicker';
import { Language, translations } from '../translations/i18n';
import { 
  generateAhkV2Script, 
  generateAhkV1Script, 
  generatePythonScript, 
  generatePowerShellScript, 
  generateBashScript 
} from '../utils/generators';

interface ScriptExporterProps {
  config: ClickerConfig;
  lang: Language;
}

type ScriptType = 'ahkv2' | 'ahkv1' | 'python' | 'powershell' | 'bash';

export const ScriptExporter: React.FC<ScriptExporterProps> = ({ config, lang }) => {
  const [selectedType, setSelectedType] = useState<ScriptType>('ahkv2');
  const [isCopied, setIsCopied] = useState(false);

  const t = translations[lang];

  let scriptCode = '';
  let fileName = 'hyperclick.ahk';

  switch (selectedType) {
    case 'ahkv2':
      scriptCode = generateAhkV2Script(config);
      fileName = 'hyperclick_v2.ahk';
      break;
    case 'ahkv1':
      scriptCode = generateAhkV1Script(config);
      fileName = 'hyperclick_v1.ahk';
      break;
    case 'python':
      scriptCode = generatePythonScript(config);
      fileName = 'hyperclick.py';
      break;
    case 'powershell':
      scriptCode = generatePowerShellScript(config);
      fileName = 'hyperclick.ps1';
      break;
    case 'bash':
      scriptCode = generateBashScript(config);
      fileName = 'hyperclick.sh';
      break;
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(scriptCode);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleDownload = () => {
    const blob = new Blob([scriptCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Intro Notice */}
      <div className="p-4 sm:p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-neutral-100">{t.exportTitle}</h3>
            <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
              {t.exportDesc}
            </p>
          </div>
        </div>
      </div>

      {/* Script Selector Tabs & Action Bar */}
      <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-neutral-950 rounded-xl border border-neutral-800">
            {[
              { id: 'ahkv2' as ScriptType, label: t.scriptAhkV2, badge: 'Рекомендуется' },
              { id: 'ahkv1' as ScriptType, label: t.scriptAhkV1 },
              { id: 'python' as ScriptType, label: t.scriptPython },
              { id: 'powershell' as ScriptType, label: t.scriptPowerShell },
              { id: 'bash' as ScriptType, label: t.scriptBash },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedType(tab.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                  selectedType === tab.id
                    ? 'bg-neutral-800 text-amber-300 shadow-sm border border-neutral-750'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="text-[9px] px-1 py-0.2 bg-amber-400/20 text-amber-300 rounded font-normal">
                    {lang === 'ru' ? 'Топ' : 'Best'}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="px-3.5 py-1.5 text-xs font-semibold text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopied ? t.copiedNotice : t.copyScript}</span>
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="px-4 py-1.5 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm shadow-amber-500/10"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t.downloadScript}</span>
            </button>
          </div>
        </div>

        {/* Code display window */}
        <div className="my-4 relative rounded-xl bg-neutral-950 border border-neutral-800 overflow-hidden">
          <div className="px-4 py-2 bg-neutral-900/80 border-b border-neutral-800 flex items-center justify-between text-xs font-mono text-neutral-400">
            <div className="flex items-center gap-2">
              <FileCode className="w-3.5 h-3.5 text-amber-400" />
              <span>{fileName}</span>
            </div>
            <span className="text-[11px] text-neutral-500">
              {lang === 'ru' ? 'Сгенерировано с вашими параметрами' : 'Pre-configured with your settings'}
            </span>
          </div>
          <pre className="p-4 text-xs font-mono text-neutral-200 overflow-x-auto leading-relaxed max-h-96">
            <code>{scriptCode}</code>
          </pre>
        </div>

        {/* How to run guide */}
        <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800/80">
          <h4 className="text-xs font-semibold text-neutral-300 mb-2 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.instructionsTitle}</span>
          </h4>
          
          {selectedType === 'ahkv2' && (
            <div className="text-xs text-neutral-400 space-y-1 leading-relaxed">
              <p>1. Скачайте бесплатный <a href="https://www.autohotkey.com" target="_blank" rel="noreferrer" className="text-amber-400 underline inline-flex items-center gap-0.5">AutoHotkey v2 <ExternalLink className="w-2.5 h-2.5" /></a>.</p>
              <p>2. Нажмите «Скачать файл» выше или сохраните код как <code>hyperclick.ahk</code>.</p>
              <p>3. Запустите двойным кликом. В игре нажимайте <strong className="text-neutral-200 font-mono">[{config.trigger.displayName}]</strong> для включения и выключения!</p>
            </div>
          )}

          {selectedType === 'ahkv1' && (
            <div className="text-xs text-neutral-400 space-y-1 leading-relaxed">
              <p>1. Установите AutoHotkey v1.1.</p>
              <p>2. Запустите сохраненный файл <code>hyperclick_v1.ahk</code>.</p>
              <p>3. Хоткей <strong className="text-neutral-200 font-mono">[{config.trigger.displayName}]</strong> управляет кликером в любой игре.</p>
            </div>
          )}

          {selectedType === 'python' && (
            <div className="text-xs text-neutral-400 space-y-1 leading-relaxed">
              <p>1. Установите библиотеку перехвата клавиш: <code className="text-amber-300 bg-neutral-900 px-1.5 py-0.5 rounded font-mono">pip install pynput</code></p>
              <p>2. Запустите скрипт: <code className="text-amber-300 bg-neutral-900 px-1.5 py-0.5 rounded font-mono">python hyperclick.py</code></p>
              <p>3. Скрипт глобально реагирует на клавишу <strong className="text-neutral-200 font-mono">[{config.trigger.displayName}]</strong> в фоновом режиме на Windows, Mac и Linux.</p>
            </div>
          )}

          {selectedType === 'powershell' && (
            <div className="text-xs text-neutral-400 space-y-1 leading-relaxed">
              <p>1. Не требует никаких установок — работает прямо в стандартной консоли Windows!</p>
              <p>2. Откройте PowerShell от имени пользователя и выполните: <code className="text-amber-300 bg-neutral-900 px-1.5 py-0.5 rounded font-mono">.\hyperclick.ps1</code></p>
              <p>3. Нажмите F6 для старта и остановки кликов.</p>
            </div>
          )}

          {selectedType === 'bash' && (
            <div className="text-xs text-neutral-400 space-y-1 leading-relaxed">
              <p>1. Установите утилиту xdotool: <code className="text-amber-300 bg-neutral-900 px-1.5 py-0.5 rounded font-mono">sudo apt-get install xdotool</code></p>
              <p>2. Сделайте файл исполняемым: <code className="text-amber-300 bg-neutral-900 px-1.5 py-0.5 rounded font-mono">chmod +x hyperclick.sh</code></p>
              <p>3. Запустите в терминале: <code className="text-amber-300 bg-neutral-900 px-1.5 py-0.5 rounded font-mono">./hyperclick.sh</code></p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
