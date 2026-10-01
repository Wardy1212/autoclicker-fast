import { ClickerConfig } from '../types/clicker';

function mapToAhkKey(key: string, code: string): string {
  if (code.startsWith('Key')) return code.slice(3).toLowerCase();
  if (code.startsWith('Digit')) return code.slice(5);
  if (code.startsWith('Numpad')) return code;
  if (code.startsWith('F') && !isNaN(Number(code.slice(1)))) return code;
  
  switch (code) {
    case 'Space': return 'Space';
    case 'Enter': return 'Enter';
    case 'Escape': return 'Escape';
    case 'Tab': return 'Tab';
    case 'Backspace': return 'Backspace';
    case 'ShiftLeft':
    case 'ShiftRight': return 'Shift';
    case 'ControlLeft':
    case 'ControlRight': return 'Ctrl';
    case 'AltLeft':
    case 'AltRight': return 'Alt';
    case 'ArrowUp': return 'Up';
    case 'ArrowDown': return 'Down';
    case 'ArrowLeft': return 'Left';
    case 'ArrowRight': return 'Right';
    default: return key.length === 1 ? key.toLowerCase() : key;
  }
}

function mapToAhkMouseButton(mb: string): string {
  switch (mb) {
    case 'left': return 'LButton';
    case 'right': return 'RButton';
    case 'middle': return 'MButton';
    case 'wheel_up': return 'WheelUp';
    case 'wheel_down': return 'WheelDown';
    case 'mouse4': return 'XButton1';
    case 'mouse5': return 'XButton2';
    default: return 'LButton';
  }
}

export function generateAhkV2Script(config: ClickerConfig): string {
  const triggerKey = mapToAhkKey(config.trigger.key, config.trigger.code);
  const isMouseTarget = config.target.category === 'mouse';
  const targetAhk = isMouseTarget 
    ? mapToAhkMouseButton(config.target.mouseButton)
    : mapToAhkKey(config.target.key, config.target.code);
  
  const clickCount = config.clickType === 'double' ? 2 : config.clickType === 'triple' ? 3 : 1;
  const clickCmd = isMouseTarget 
    ? `Click("${targetAhk} ${clickCount}")`
    : `Send("{${targetAhk}}")`;
  
  const interval = Math.max(1, config.intervalMs);
  const jitter = config.jitterMs;

  if (config.triggerMode === 'hold') {
    return `; ==========================================
; HyperClick - Auto Clicker (AutoHotkey v2)
; Target: ${isMouseTarget ? config.target.mouseButton : config.target.key}
; Trigger: HOLD ${triggerKey}
; Interval: ${interval}ms (Jitter: ±${jitter}ms)
; ==========================================
#Requires AutoHotkey v2.0
#SingleInstance Force

${triggerKey}::
{
    While GetKeyState("${triggerKey}", "P")
    {
        ${clickCmd}
        ${jitter > 0 ? `Sleep(Random(${Math.max(1, interval - jitter)}, ${interval + jitter}))` : `Sleep(${interval})`}
    }
}
`;
  }

  // Toggle Mode
  return `; ==========================================
; HyperClick - Auto Clicker (AutoHotkey v2)
; Target: ${isMouseTarget ? config.target.mouseButton : config.target.key}
; Trigger: TOGGLE ${triggerKey} (Press to Start/Stop)
; Interval: ${interval}ms (Jitter: ±${jitter}ms)
; ==========================================
#Requires AutoHotkey v2.0
#SingleInstance Force

global isActive := false

${triggerKey}::
{
    global isActive := !isActive
    if (isActive) {
        SoundBeep(850, 80)
        SetTimer(DoClick, 1)
    } else {
        SoundBeep(450, 80)
        SetTimer(DoClick, 0)
    }
}

DoClick()
{
    global isActive
    if (!isActive)
        return
    
    ${clickCmd}
    ${jitter > 0 ? `Sleep(Random(${Math.max(1, interval - jitter)}, ${interval + jitter}))` : `Sleep(${interval})`}
}
`;
}

export function generateAhkV1Script(config: ClickerConfig): string {
  const triggerKey = mapToAhkKey(config.trigger.key, config.trigger.code);
  const isMouseTarget = config.target.category === 'mouse';
  const targetAhk = isMouseTarget 
    ? mapToAhkMouseButton(config.target.mouseButton)
    : mapToAhkKey(config.target.key, config.target.code);
  
  const clickCount = config.clickType === 'double' ? 2 : config.clickType === 'triple' ? 3 : 1;
  const clickCmd = isMouseTarget 
    ? `Click ${targetAhk} ${clickCount}`
    : `Send {${targetAhk}}`;
  
  const interval = Math.max(1, config.intervalMs);
  const jitter = config.jitterMs;

  if (config.triggerMode === 'hold') {
    return `; ==========================================
; HyperClick - Auto Clicker (AutoHotkey v1.1)
; Trigger: HOLD ${triggerKey}
; ==========================================
#SingleInstance, Force
SetBatchLines, -1

${triggerKey}::
    While GetKeyState("${triggerKey}", "P")
    {
        ${clickCmd}
        ${jitter > 0 ? `Random, randSleep, ${Math.max(1, interval - jitter)}, ${interval + jitter}\n        Sleep, %randSleep%` : `Sleep, ${interval}`}
    }
return
`;
  }

  return `; ==========================================
; HyperClick - Auto Clicker (AutoHotkey v1.1)
; Trigger: TOGGLE ${triggerKey}
; ==========================================
#SingleInstance, Force
SetBatchLines, -1

Toggle := 0

${triggerKey}::
    Toggle := !Toggle
    if (Toggle) {
        SoundBeep, 850, 70
        SetTimer, ClickLoop, 1
    } else {
        SoundBeep, 450, 70
        SetTimer, ClickLoop, Off
    }
return

ClickLoop:
    if (!Toggle)
        return
    ${clickCmd}
    ${jitter > 0 ? `Random, randSleep, ${Math.max(1, interval - jitter)}, ${interval + jitter}\n    Sleep, %randSleep%` : `Sleep, ${interval}`}
return
`;
}

export function generatePythonScript(config: ClickerConfig): string {
  const triggerKeyStr = config.trigger.code.startsWith('Key') 
    ? `'${config.trigger.code.slice(3).toLowerCase()}'`
    : `Key.${config.trigger.code.toLowerCase()}`;

  const isMouse = config.target.category === 'mouse';
  const intervalSec = (Math.max(1, config.intervalMs) / 1000).toFixed(4);
  const jitterSec = (config.jitterMs / 1000).toFixed(4);

  let mouseButtonPy = 'Button.left';
  if (config.target.mouseButton === 'right') mouseButtonPy = 'Button.right';
  else if (config.target.mouseButton === 'middle') mouseButtonPy = 'Button.middle';
  else if (config.target.mouseButton === 'mouse4') mouseButtonPy = 'Button.x1';
  else if (config.target.mouseButton === 'mouse5') mouseButtonPy = 'Button.x2';

  const keyTargetPy = config.target.key.length === 1 
    ? `'${config.target.key.toLowerCase()}'` 
    : `Key.${config.target.code.toLowerCase()}`;

  return `#!/usr/bin/env python3
# ==========================================
# HyperClick - Ultra Fast Python Clicker
# Requirements: pip install pynput
# Works on Windows, macOS, and Linux
# ==========================================

import time
import random
import threading
from pynput.mouse import Button, Controller as MouseController
from pynput.keyboard import Key, KeyCode, Controller as KeyboardController, Listener

mouse = MouseController()
keyboard = KeyboardController()

ACTIVE = False
BASE_INTERVAL = ${intervalSec}
JITTER = ${jitterSec}
TRIGGER_KEY_NAME = "${config.trigger.displayName}"

def clicker_worker():
    global ACTIVE
    while True:
        if ACTIVE:
            # Trigger tap action
            ${isMouse ? `mouse.click(${mouseButtonPy})` : `keyboard.tap(${keyTargetPy})`}
            
            # Sleep with jitter
            delay = BASE_INTERVAL
            if JITTER > 0:
                delay = max(0.001, BASE_INTERVAL + random.uniform(-JITTER, JITTER))
            time.sleep(delay)
        else:
            time.sleep(0.01)

def on_press(key):
    global ACTIVE
    # Match trigger key
    key_char = getattr(key, 'char', None)
    key_name = getattr(key, 'name', None)
    
    target_match = False
    if key_char and key_char.lower() == "${config.trigger.key.toLowerCase()}":
        target_match = True
    elif key_name and key_name.lower() == "${config.trigger.code.toLowerCase()}":
        target_match = True
    elif str(key).replace("Key.", "").lower() == "${config.trigger.code.toLowerCase()}":
        target_match = True

    if target_match:
        ${config.triggerMode === 'toggle' ? `ACTIVE = not ACTIVE
        print(f"[{'RUNNING' if ACTIVE else 'STOPPED'}] Auto clicker active: {ACTIVE}")` : `if not ACTIVE:
            ACTIVE = True
            print("[RUNNING] Hold active")`}

${config.triggerMode === 'hold' ? `def on_release(key):
    global ACTIVE
    key_char = getattr(key, 'char', None)
    key_name = getattr(key, 'name', None)
    if (key_char and key_char.lower() == "${config.trigger.key.toLowerCase()}") or (key_name and key_name.lower() == "${config.trigger.code.toLowerCase()}"):
        ACTIVE = False
        print("[STOPPED] Hold released")` : `def on_release(key):
    pass`}

print("==================================================")
print(" HyperClick Native Python Clicker Started")
print(f" -> Press [{TRIGGER_KEY_NAME}] to ${config.triggerMode === 'toggle' ? 'TOGGLE start/stop' : 'HOLD to click'}")
print(f" -> Target: ${isMouse ? config.target.mouseButton : config.target.key} at ${config.intervalMs}ms")
print(" -> Press Ctrl+C in terminal to exit")
print("==================================================")

threading.Thread(target=clicker_worker, daemon=True).start()

with Listener(on_press=on_press, on_release=on_release) as listener:
    listener.join()
`;
}

export function generatePowerShellScript(config: ClickerConfig): string {
  const isMouse = config.target.category === 'mouse';
  const interval = Math.max(1, config.intervalMs);

  return `# ==========================================
# HyperClick - Native Windows PowerShell Clicker
# Zero-install script (runs directly in PowerShell)
# ==========================================

Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;
public class HyperNative {
    [DllImport("user32.dll")]
    public static extern void mouse_event(uint dwFlags, uint dx, uint dy, uint dwData, int dwExtraInfo);
    [DllImport("user32.dll")]
    public static extern short GetAsyncKeyState(int vKey);
    public const uint MOUSEEVENTF_LEFTDOWN = 0x02;
    public const uint MOUSEEVENTF_LEFTUP = 0x04;
    public const uint MOUSEEVENTF_RIGHTDOWN = 0x08;
    public const uint MOUSEEVENTF_RIGHTUP = 0x10;
}
"@

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " HyperClick PowerShell Auto-Clicker" -ForegroundColor Green
Write-Host " Trigger: F6 (Toggle Start/Stop)" -ForegroundColor Yellow
Write-Host " Press Ctrl+C in console to close" -ForegroundColor Gray
Write-Host "=========================================="

$active = $false
$lastF6 = $false

while ($true) {
    # Check F6 key (Virtual-Key 0x75 = 117)
    $f6State = [HyperNative]::GetAsyncKeyState(117) -band 0x8000
    if ($f6State -and -not $lastF6) {
        $active = -not $active
        if ($active) {
            [Console]::Beep(800, 80)
            Write-Host "[ACTIVE] Auto-clicking at ${interval}ms..." -ForegroundColor Green
        } else {
            [Console]::Beep(400, 80)
            Write-Host "[STOPPED] Idle." -ForegroundColor Yellow
        }
    }
    $lastF6 = $f6State

    if ($active) {
        ${isMouse ? `[HyperNative]::mouse_event([HyperNative]::MOUSEEVENTF_LEFTDOWN, 0, 0, 0, 0)
        [HyperNative]::mouse_event([HyperNative]::MOUSEEVENTF_LEFTUP, 0, 0, 0, 0)` : `[System.Windows.Forms.SendKeys]::SendWait("${config.target.key}")`}
        Start-Sleep -Milliseconds ${interval}
    } else {
        Start-Sleep -Milliseconds 20
    }
}
`;
}

export function generateBashScript(config: ClickerConfig): string {
  const isMouse = config.target.category === 'mouse';
  const mouseButtonNum = config.target.mouseButton === 'left' ? '1' : config.target.mouseButton === 'middle' ? '2' : '3';
  const intervalSec = (Math.max(1, config.intervalMs) / 1000).toFixed(4);

  return `#!/usr/bin/env bash
# ==========================================
# HyperClick - Linux Auto Clicker (xdotool)
# Requires: sudo apt-get install xdotool
# ==========================================

echo "=========================================="
echo " HyperClick Linux Clicker"
echo " Press Ctrl+C to terminate"
echo "=========================================="

while true; do
  ${isMouse ? `xdotool click ${mouseButtonNum}` : `xdotool key ${config.target.key}`}
  sleep ${intervalSec}
done
`;
}
