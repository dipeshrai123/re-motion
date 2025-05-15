import { Easing } from '../easing/Easing';
import { MotionValue } from '../MotionValue';
import { AnimationController } from './AnimationController';

interface TimingOpts {
  duration?: number;
  easing?: (t: number) => number;
  onStart?(): void;
  onPause?(): void;
  onResume?(): void;
  onComplete?(): void;
}

class TimingController implements AnimationController {
  private startTime!: number;
  private frameId!: number;
  private from!: number;

  private isPaused = false;
  private isCancelled = false;
  private pausedAt: number | null = null;
  private elapsedBeforePause = 0;

  constructor(
    private mv: MotionValue<number>,
    private to: number,
    private duration: number = 300,
    private easing: (t: number) => number = Easing.linear,
    private hooks: Omit<TimingOpts, 'duration' | 'easing' | 'delay'>
  ) {}

  start() {
    this.hooks.onStart?.();
    this.mv.setAnimationController(this);

    this.isPaused = false;
    this.isCancelled = false;
    this.from = this.mv.current;
    this.startTime = performance.now();
    this.pausedAt = null;
    this.elapsedBeforePause = 0;

    this.frameId = requestAnimationFrame(this.animate);
  }

  private animate = (ts: number) => {
    if (this.isCancelled || this.isPaused) return;

    const elapsed = this.elapsedBeforePause + (ts - this.startTime);
    const t = Math.min(1, elapsed / this.duration);
    this.mv._internalSet(this.from + (this.to - this.from) * this.easing(t));

    if (t < 1) {
      this.frameId = requestAnimationFrame(this.animate);
    } else {
      this.mv._internalSet(this.to);
      this.hooks.onComplete?.();
    }
  };

  pause() {
    if (this.isCancelled || this.isPaused) return;

    this.isPaused = true;
    this.pausedAt = performance.now();
    this.elapsedBeforePause += this.pausedAt - this.startTime;
    cancelAnimationFrame(this.frameId);
    this.hooks.onPause?.();
  }

  resume() {
    if (this.isCancelled || !this.isPaused) return;

    this.isPaused = false;
    this.hooks.onResume?.();
    this.startTime = performance.now();
    this.pausedAt = null;
    this.frameId = requestAnimationFrame(this.animate);
  }

  cancel() {
    this.isCancelled = true;
    cancelAnimationFrame(this.frameId);
  }

  reset() {
    this.cancel();
    this.isPaused = false;
    cancelAnimationFrame(this.frameId);
    this.mv.reset();
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
  const { duration = 300, easing = Easing.linear, ...hooks } = opts;
  const ctl = new TimingController(mv, to, duration, easing, hooks);
  return ctl;
}
