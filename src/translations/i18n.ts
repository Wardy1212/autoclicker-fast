export type Language = 'ru' | 'en';

export const translations = {
  ru: {
    appTitle: 'HyperClick',
    appSubtitle: 'Сверхбыстрый авто-кликер и спамер клавиш',
    statusActive: 'АКТИВЕН (КЛИКАЕТ)',
    statusIdle: 'В ОЖИДАНИИ СТАРТА',
    startClicker: 'Запустить кликер',
    stopClicker: 'Остановить кликер',
    
    // Trigger settings
    activationSection: 'Кнопка активации (Старт / Стоп)',
    activationDesc: 'Нажмите клавишу или мышь для запуска/остановки скрипта',
    changeKey: 'Изменить кнопку',
    pressAnyKeyToBind: 'Нажмите любую клавишу клавиатуры или кнопку мыши...',
    triggerMode: 'Режим запуска',
    modeToggle: 'Переключатель (Toggle)',
    modeToggleDesc: 'Нажмите один раз для старта, еще раз для остановки',
    modeHold: 'Удержание (Hold)',
    modeHoldDesc: 'Кликает только пока кнопка физически зажата',

    // Target settings
    targetSection: 'Что нажимать (Целевая кнопка)',
    targetDesc: 'Выберите любую кнопку мыши или любую клавишу клавиатуры',
    targetCategoryMouse: 'Мышь',
    targetCategoryKeyboard: 'Клавиатура',
    mouseLeft: 'Левая кнопка мыши (ЛКМ)',
    mouseRight: 'Правая кнопка мыши (ПКМ)',
    mouseMiddle: 'Колесико мыши (СКМ)',
    mouseWheelUp: 'Прокрутка вверх',
    mouseWheelDown: 'Прокрутка вниз',
    mouse4: 'Боковая кнопка 4 (Назад)',
    mouse5: 'Боковая кнопка 5 (Вперед)',
    recordAnyKey: 'Захватить любую клавишу',
    quickKeys: 'Быстрый выбор',
    
    // Speed settings
    speedSection: 'Скорость и интервал',
    intervalMs: 'Интервал (мс)',
    intervalHint: '1 мс = 1000 кликов/сек (макс. скорость)',
    cpsLabel: 'Кликов в секунду (CPS)',
    jitterLabel: 'Рандомизация интервала (Джиттер / Анти-бан)',
    jitterDesc: 'Добавляет случайное отклонение ± мс, чтобы скрипт выглядел как живой игрок',
    clickType: 'Тип нажатия',
    clickSingle: 'Одиночный клик',
    clickDouble: 'Двойной клик',
    clickTriple: 'Тройной клик',
    clickHold: 'Зажатие (мс)',
    repeatLimit: 'Количество повторов',
    repeatInfinite: 'Бесконечно (до остановки)',
    repeatExact: 'Ровно',
    clicksUnit: 'кликов',

    // Sounds
    soundSection: 'Звук клика',
    soundNone: 'Без звука',
    soundMicroswitch: 'Микропереключатель мыши (Omron)',
    soundBlue: 'Механика (Blue Switch Click)',
    soundRed: 'Механика (Red Switch Thock)',
    soundBlaster: 'Кибер сигнал',

    // Testing sandbox
    arenaTitle: 'Интерактивная арена тестирования',
    arenaDesc: 'Наведите курсор или активируйте авто-кликер здесь, чтобы проверить реальную скорость',
    clickTargetPrompt: 'Цель для авто-кликера (нажмите или запустите хоткей)',
    totalClicks: 'Всего кликов',
    currentCps: 'Текущий CPS',
    peakCps: 'Пиковый CPS',
    sessionTime: 'Время работы',
    resetStats: 'Сбросить счётчик',
    targetHealth: 'Прочность цели',
    targetDestroyed: 'ЦЕЛЬ УНИЧТОЖЕНА!',
    nextTarget: 'Следующая цель',
    
    // Benchmark
    benchmarkBtn: 'Тест скорости (CPS Benchmark)',
    benchmarkRunning: 'Тестирование...',
    benchmarkResult: 'Результат теста:',

    // Scripts Export
    exportTitle: 'Экспорт нативного скрипта для ПК (Windows / Mac / Linux)',
    exportDesc: 'Браузер не может нажимать кнопки в фоновых играх (CS2, Minecraft, Roblox, GTA) из-за безопасности ОС. Скопируйте или скачайте готовый автономный скрипт с вашими настройками!',
    copyScript: 'Копировать код',
    downloadScript: 'Скачать файл',
    copiedNotice: 'Код скопирован в буфер!',
    scriptAhkV2: 'AutoHotkey v2 (.ahk)',
    scriptAhkV1: 'AutoHotkey v1 (.ahk)',
    scriptPython: 'Python pynput (.py)',
    scriptPowerShell: 'PowerShell (.ps1)',
    scriptBash: 'Linux xdotool (.sh)',
    instructionsTitle: 'Как запустить:',

    // Presets
    presetsTitle: 'Готовые профили и пресеты',
    loadPreset: 'Загрузить пресет',
    customPresetSave: 'Сохранить текущие настройки',
    presetNamePrompt: 'Название пресета:',
    saveBtn: 'Сохранить',
    cancelBtn: 'Отмена',
    deleteBtn: 'Удалить',
    savedPresets: 'Мои сохраненные профили',

    // Nav
    navConfig: 'Настройки',
    navArena: 'Песочница и CPS',
    navExport: 'Скрипты для ОС',
    navPresets: 'Пресеты',
  },
  en: {
    appTitle: 'HyperClick',
    appSubtitle: 'Ultra-Fast Auto Clicker & Key Spammer',
    statusActive: 'ACTIVE (CLICKING)',
    statusIdle: 'IDLE (READY)',
    startClicker: 'Start Clicker',
    stopClicker: 'Stop Clicker',

    // Trigger settings
    activationSection: 'Trigger Hotkey (Start / Stop)',
    activationDesc: 'Press this key or mouse button to activate/stop clicking',
    changeKey: 'Change Hotkey',
    pressAnyKeyToBind: 'Press any keyboard key or mouse button...',
    triggerMode: 'Trigger Mode',
    modeToggle: 'Toggle Mode',
    modeToggleDesc: 'Press once to start, press again to stop',
    modeHold: 'Hold Mode',
    modeHoldDesc: 'Clicks only while the key is physically held down',

    // Target settings
    targetSection: 'Target Button (What to Click)',
    targetDesc: 'Select any mouse button or any keyboard key',
    targetCategoryMouse: 'Mouse',
    targetCategoryKeyboard: 'Keyboard',
    mouseLeft: 'Left Mouse Button (LMB)',
    mouseRight: 'Right Mouse Button (RMB)',
    mouseMiddle: 'Middle Mouse Button (MMB)',
    mouseWheelUp: 'Scroll Wheel Up',
    mouseWheelDown: 'Scroll Wheel Down',
    mouse4: 'Mouse Button 4 (Back)',
    mouse5: 'Mouse Button 5 (Forward)',
    recordAnyKey: 'Capture Any Key',
    quickKeys: 'Quick Select',

    // Speed settings
    speedSection: 'Speed & Interval',
    intervalMs: 'Interval (ms)',
    intervalHint: '1 ms = 1000 clicks/sec (max speed)',
    cpsLabel: 'Clicks Per Second (CPS)',
    jitterLabel: 'Interval Randomization (Jitter / Anti-Ban)',
    jitterDesc: 'Adds random ± ms deviation to mimic human clicking variations',
    clickType: 'Click Type',
    clickSingle: 'Single Click',
    clickDouble: 'Double Click',
    clickTriple: 'Triple Click',
    clickHold: 'Hold Down (ms)',
    repeatLimit: 'Repeat Limit',
    repeatInfinite: 'Infinite (until stopped)',
    repeatExact: 'Exactly',
    clicksUnit: 'clicks',

    // Sounds
    soundSection: 'Audio Feedback',
    soundNone: 'Mute',
    soundMicroswitch: 'Mouse Microswitch (Omron)',
    soundBlue: 'Mechanical (Blue Switch Click)',
    soundRed: 'Mechanical (Red Switch Thock)',
    soundBlaster: 'Cyber Beep',

    // Testing sandbox
    arenaTitle: 'Interactive Testing Arena',
    arenaDesc: 'Hover cursor or run the auto clicker here to verify real-time CPS & latency',
    clickTargetPrompt: 'Auto-Clicker Target (click or press hotkey)',
    totalClicks: 'Total Clicks',
    currentCps: 'Current CPS',
    peakCps: 'Peak CPS',
    sessionTime: 'Active Time',
    resetStats: 'Reset Counter',
    targetHealth: 'Target Durability',
    targetDestroyed: 'TARGET DESTROYED!',
    nextTarget: 'Next Target',

    // Benchmark
    benchmarkBtn: 'Speed Benchmark (5s)',
    benchmarkRunning: 'Benchmarking...',
    benchmarkResult: 'Benchmark Result:',

    // Scripts Export
    exportTitle: 'Export Native Desktop Script (Windows / Mac / Linux)',
    exportDesc: 'Browsers cannot trigger OS hardware clicks inside other background game windows (CS2, Minecraft, Roblox, GTA). Copy or download a standalone native script pre-configured with your exact hotkeys & speeds!',
    copyScript: 'Copy Code',
    downloadScript: 'Download File',
    copiedNotice: 'Code copied to clipboard!',
    scriptAhkV2: 'AutoHotkey v2 (.ahk)',
    scriptAhkV1: 'AutoHotkey v1 (.ahk)',
    scriptPython: 'Python pynput (.py)',
    scriptPowerShell: 'PowerShell (.ps1)',
    scriptBash: 'Linux xdotool (.sh)',
    instructionsTitle: 'How to Run:',

    // Presets
    presetsTitle: 'Profiles & Presets',
    loadPreset: 'Load Preset',
    customPresetSave: 'Save Current Settings',
    presetNamePrompt: 'Profile Name:',
    saveBtn: 'Save',
    cancelBtn: 'Cancel',
    deleteBtn: 'Delete',
    savedPresets: 'My Saved Profiles',

    // Nav
    navConfig: 'Config',
    navArena: 'Arena & CPS',
    navExport: 'OS Scripts',
    navPresets: 'Presets',
  }
};
