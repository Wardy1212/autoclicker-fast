/**
 * High-precision Web Worker Timer
 * Bypasses main-thread timer throttling (browser 4ms clamp & inactive tab delays)
 */

export class PreciseClickTimer {
  private worker: Worker | null = null;
  private onTickCallback: () => void;
  private isRunning = false;

  constructor(onTick: () => void) {
    this.onTickCallback = onTick;
    this.initWorker();
  }

  private initWorker() {
    if (typeof window === 'undefined') return;

    const workerScript = `
      let timerId = null;
      let intervalMs = 10;
      let jitterMs = 0;

      function scheduleNext() {
        if (!timerId) return;
        let delay = intervalMs;
        if (jitterMs > 0) {
          const delta = (Math.random() * 2 - 1) * jitterMs;
          delay = Math.max(1, intervalMs + delta);
        }
        timerId = setTimeout(() => {
          postMessage('tick');
          scheduleNext();
        }, delay);
      }

      onmessage = function(e) {
        const data = e.data;
        if (data.action === 'start') {
          intervalMs = Math.max(1, data.intervalMs || 10);
          jitterMs = data.jitterMs || 0;
          if (timerId) clearTimeout(timerId);
          timerId = true;
          postMessage('tick');
          scheduleNext();
        } else if (data.action === 'update') {
          intervalMs = Math.max(1, data.intervalMs || 10);
          jitterMs = data.jitterMs || 0;
        } else if (data.action === 'stop') {
          if (timerId) {
            clearTimeout(timerId);
            timerId = null;
          }
        }
      };
    `;

    try {
      const blob = new Blob([workerScript], { type: 'application/javascript' });
      const workerUrl = URL.createObjectURL(blob);
      this.worker = new Worker(workerUrl);
      this.worker.onmessage = (e) => {
        if (e.data === 'tick' && this.isRunning) {
          this.onTickCallback();
        }
      };
    } catch {
      // Fallback if Worker fails (e.g. strict CSP)
      this.worker = null;
    }
  }

  public start(intervalMs: number, jitterMs = 0) {
    this.isRunning = true;
    if (this.worker) {
      this.worker.postMessage({
        action: 'start',
        intervalMs,
        jitterMs
      });
    } else {
      this.fallbackLoop(intervalMs, jitterMs);
    }
  }

  public update(intervalMs: number, jitterMs = 0) {
    if (this.worker) {
      this.worker.postMessage({
        action: 'update',
        intervalMs,
        jitterMs
      });
    }
  }

  public stop() {
    this.isRunning = false;
    if (this.worker) {
      this.worker.postMessage({ action: 'stop' });
    }
  }

  private fallbackTimeout: number | null = null;
  private fallbackLoop(intervalMs: number, jitterMs: number) {
    if (!this.isRunning) return;
    this.onTickCallback();

    let delay = intervalMs;
    if (jitterMs > 0) {
      const delta = (Math.random() * 2 - 1) * jitterMs;
      delay = Math.max(1, intervalMs + delta);
    }

    this.fallbackTimeout = window.setTimeout(() => {
      this.fallbackLoop(intervalMs, jitterMs);
    }, delay);
  }

  public destroy() {
    this.stop();
    if (this.fallbackTimeout) clearTimeout(this.fallbackTimeout);
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
  }
}
