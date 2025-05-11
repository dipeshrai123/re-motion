import { Easing } from '../easing/easing';
import { MotionValue } from '../MotionValue';
import { AnimationController } from './AnimationController';

export interface TimingOpts {
  delay?: number;
  duration?: number;
  easing?: (t: number) => number;
  onStart?(): void;
  onPause?(): void;
  onResume?(): void;
  onComplete?(): void;
}

class TimingController implements AnimationController {
  private timeoutId: ReturnType<typeof setTimeout> | null = null;
  private startTime!: number;
  private frameId!: number;
  private from!: number;
  private originalFrom: number;

  private isPaused = false;
  private isCancelled = false;
  private pausedAt: number | null = null;
  private elapsedBeforePause = 0;

  constructor(
    private mv: MotionValue<number>,
    private to: number,
    private duration: number = 300,
    private easing: (t: number) => number = Easing.linear,
    private hooks: Omit<TimingOpts, 'duration' | 'easing' | 'delay'>,
    private delay: number
  ) {
    this.originalFrom = mv.current;
  }

  start() {
    this.hooks.onStart?.();
    this.mv.setAnimationController(this);

    this.isPaused = false;
    this.isCancelled = false;
    this.from = this.mv.current;
    this.pausedAt = null;
    this.elapsedBeforePause = 0;

    const beginAnimation = () => {
      if (this.isCancelled) return;
      this.startTime = performance.now();
      this.frameId = requestAnimationFrame(this.animate);
      this.timeoutId = null;
    };

    if (this.delay > 0) {
      this.timeoutId = setTimeout(beginAnimation, this.delay);
    } else {
      beginAnimation();
    }
  }

  private animate = (ts: number) => {
    if (this.isCancelled || this.isPaused) return;

    const elapsed = this.elapsedBeforePause + (ts - this.startTime);
    const t = Math.min(1, elapsed / this.duration);
    this.mv.set(this.from + (this.to - this.from) * this.easing(t));

    if (t < 1) {
      this.frameId = requestAnimationFrame(this.animate);
    } else {
      this.mv.set(this.to);
      this.hooks.onComplete?.();
    }
  };

  pause() {
    if (this.isCancelled || this.isPaused) return;
    this.isPaused = true;

    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    } else {
      this.pausedAt = performance.now();
      this.elapsedBeforePause += this.pausedAt - this.startTime;
      cancelAnimationFrame(this.frameId);
    }

    this.hooks.onPause?.();
  }

  resume() {
    if (this.isCancelled || !this.isPaused) return;
    this.isPaused = false;
    this.hooks.onResume?.();

    if (this.timeoutId === null && this.startTime === undefined) {
      this.start();
    } else {
      this.startTime = performance.now();
      this.frameId = requestAnimationFrame(this.animate);
    }
  }

  cancel() {
    this.isCancelled = true;
    if (this.timeoutId != null) clearTimeout(this.timeoutId);
    cancelAnimationFrame(this.frameId);
  }

  reset() {
    this.cancel();
    this.isPaused = false;
    this.mv.set(this.originalFrom);
  }

  setOnComplete(fn: () => void) {
    this.hooks.onComplete = fn;
  }
}

export function timing(
  mv: MotionValue<number>,
  to: number,
  opts: TimingOpts = {}
): TimingController {
  const { delay = 0, duration = 300, easing = Easing.linear, ...hooks } = opts;
  const ctl = new TimingController(mv, to, duration, easing, hooks, delay);
  return ctl;
}
