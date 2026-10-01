import { PresetProfile } from '../types/clicker';

export const DEFAULT_PRESETS: PresetProfile[] = [
  {
    id: 'turbo_1000',
    name: 'Ultra Turbo (1000 CPS)',
    nameRu: 'Ультра Турбо (1000 CPS / 1 мс)',
    description: 'Maximum theoretical speed: 1ms interval, continuous fire for benchmark and clicker games.',
    descriptionRu: 'Максимальная скорость: 1 мс интервал, беспрерывный поток кликов для тестов и кликеров.',
    tag: 'Extreme',
    config: {
      target: { category: 'mouse', mouseButton: 'left', key: '', code: '', displayName: 'LMB (Левая кнопка)' },
      trigger: { key: 'F6', code: 'F6', displayName: 'F6' },
      triggerMode: 'toggle',
      intervalMs: 1,
      jitterMs: 0,
      clickType: 'single',
      soundEffect: 'mouse_switch'
    }
  },
  {
    id: 'minecraft_pvp',
    name: 'Minecraft PvP (16 CPS)',
    nameRu: 'Minecraft PvP (16 CPS с джиттером)',
    description: 'Human-like PvP clicking with realistic 8ms jitter to bypass anti-cheat checks.',
    descriptionRu: 'Реалистичный PvP клик с джиттером 8мс, имитирующий живого игрока для обхода анти-читов.',
    tag: 'Gaming',
    config: {
      target: { category: 'mouse', mouseButton: 'left', key: '', code: '', displayName: 'LMB (Левая кнопка)' },
      trigger: { key: 'F7', code: 'F7', displayName: 'F7' },
      triggerMode: 'toggle',
      intervalMs: 62,
      jitterMs: 10,
      clickType: 'single',
      soundEffect: 'mouse_switch'
    }
  },
  {
    id: 'roblox_afk',
    name: 'Roblox / MMO AFK Farmer',
    nameRu: 'Roblox / MMO Авто-Фарм',
    description: 'Continuous key tap on "E" to collect loot and prevent AFK kick.',
    descriptionRu: 'Безостановочный таб по клавише «E» для лута и защиты от AFK кика.',
    tag: 'Grind',
    config: {
      target: { category: 'keyboard', mouseButton: 'left', key: 'e', code: 'KeyE', displayName: 'Клавиша [E]' },
      trigger: { key: 'F8', code: 'F8', displayName: 'F8' },
      triggerMode: 'toggle',
      intervalMs: 120,
      jitterMs: 15,
      clickType: 'single',
      soundEffect: 'mechanical_red'
    }
  },
  {
    id: 'bhop_space',
    name: 'Bunny Hop (Space Spammer)',
    nameRu: 'Bunny Hop (Спам Пробела)',
    description: 'High-speed Spacebar repeater on key hold for continuous jumping in FPS games.',
    descriptionRu: 'Быстрое нажатие клавиши «Пробел» при зажатии хоткея для непрерывных прыжков.',
    tag: 'FPS',
    config: {
      target: { category: 'keyboard', mouseButton: 'left', key: ' ', code: 'Space', displayName: 'Пробел [Space]' },
      trigger: { key: 'x', code: 'KeyX', displayName: 'X' },
      triggerMode: 'hold',
      intervalMs: 20,
      jitterMs: 0,
      clickType: 'single',
      soundEffect: 'mechanical_blue'
    }
  },
  {
    id: 'cookie_destroyer',
    name: 'Cookie Clicker Breaker (200 CPS)',
    nameRu: 'Разрушитель Кликеров (200 CPS)',
    description: 'Blazing 5ms interval for clicker games, idle games, and coin clickers.',
    descriptionRu: 'Молниеносный интервал 5 мс для игр-кликеров и добычи монет.',
    tag: 'Clicker',
    config: {
      target: { category: 'mouse', mouseButton: 'left', key: '', code: '', displayName: 'LMB (Левая кнопка)' },
      trigger: { key: 'F6', code: 'F6', displayName: 'F6' },
      triggerMode: 'toggle',
      intervalMs: 5,
      jitterMs: 0,
      clickType: 'single',
      soundEffect: 'blaster'
    }
  }
];
