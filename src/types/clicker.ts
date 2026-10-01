export type InputCategory = 'mouse' | 'keyboard';

export type MouseButtonType = 'left' | 'right' | 'middle' | 'wheel_up' | 'wheel_down' | 'mouse4' | 'mouse5';

export type ClickType = 'single' | 'double' | 'triple' | 'hold';

export type TriggerMode = 'toggle' | 'hold';

export interface TargetInput {
  category: InputCategory;
  mouseButton: MouseButtonType;
  key: string;       // e.g. "Space", "e", "Enter", "F", "Shift"
  code: string;      // e.g. "KeyE", "Space", "Enter"
  displayName: string;
}

export interface TriggerKey {
  key: string;
  code: string;
  displayName: string;
  mouseButton?: MouseButtonType;
}

export interface ClickerConfig {
  target: TargetInput;
  trigger: TriggerKey;
  triggerMode: TriggerMode;
  intervalMs: number;
  jitterMs: number;
  clickType: ClickType;
  holdDurationMs: number; // for 'hold' clickType
  repeatLimit: number;    // 0 = infinite
  soundEffect: 'none' | 'mechanical_blue' | 'mechanical_red' | 'mouse_switch' | 'blaster';
}

export interface PresetProfile {
  id: string;
  name: string;
  nameRu: string;
  description: string;
  descriptionRu: string;
  config: Partial<ClickerConfig>;
  tag: string;
}

export interface ClickStats {
  totalClicks: number;
  currentCps: number;
  peakCps: number;
  activeSeconds: number;
  targetHitCount: number;
}
