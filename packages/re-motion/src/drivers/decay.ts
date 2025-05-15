import { MotionValue } from '../MotionValue';
import { AnimationController } from './AnimationController';

interface DecayOpts {
  decay?: number;
  onStart?(): void;
  onPause?(): void;
  onResume?(): void;
  onComplete?(): void;
}

class DecayController implements AnimationController {
  private originalVelocity: number;
  private decayFactor: number; // per-millisecond decay
  private startTime: number = 0;
  private from: number = 0;
  private frameId!: number;

  private isPaused = false;
  private isCancelled = false;
  private pausedAt = 0;

  constructor(
    private mv: MotionValue<number>,
    initialVelocity: number,
    decayFactor: number,
    private hooks: DecayOpts
  ) {
    this.originalVelocity = initialVelocity;
    this.decayFactor = decayFactor;
    this.from = mv.current;
  }

  start() {
    this.hooks.onStart?.();
    this.mv.setAnimationController(this);

    this.isPaused = false;
    this.isCancelled = false;
    this.from = this.mv.current;
    this.startTime = performance.now();

    this.frameId = requestAnimationFrame(this.animate);
  }

  private animate = (now: number) => {
    if (this.isCancelled || this.isPaused) return;

    const t = now - this.startTime;
    const k = 1 - this.decayFactor;

    const vNow = this.originalVelocity * Math.exp(-k * t);

    const next =
      this.from + (this.originalVelocity / k) * (1 - Math.exp(-k * t));

    this.mv._internalSet(next);

    if (Math.abs(vNow) > 0.1) {
      this.frameId = requestAnimationFrame(this.animate);
    } else {
      this.hooks.onComplete?.();
    }
  };

  pause() {
    if (this.isCancelled || this.isPaused) return;

    this.isPaused = true;
    this.pausedAt = performance.now();
    cancelAnimationFrame(this.frameId);
    this.hooks.onPause?.();
  }

  resume() {
    if (this.isCancelled || !this.isPaused) return;
    const now = performance.now();

    this.startTime += now - this.pausedAt;

    this.isPaused = false;
    this.hooks.onResume?.();
    this.frameId = requestAnimationFrame(this.animate);
  }

  cancel() {
    this.isCancelled = true;
    cancelAnimationFrame(this.frameId);
  }

  reset() {
    this.cancel();
    this.isPaused = false;
    this.mv.reset();
    this.startTime = 0;
  }

  reverse() {}

  setOnComplete(fn: () => void): void {
    this.hooks.onComplete = fn;
  }
}

export function decay(
  mv: MotionValue<number>,
  velocity: number,
  opts: DecayOpts = {}
): DecayController {
  const { decay = 0.998, ...hooks } = opts;
  const ctl = new DecayController(mv, velocity, decay, hooks);
  return ctl;
}
