import { MotionValue } from '../MotionValue';
import { AnimationController } from './AnimationController';

export interface DecayOpts {
  decay?: number;
  onStart?(): void;
  onPause?(): void;
  onResume?(): void;
  onComplete?(): void;
}

class DecayController implements AnimationController {
  private velocity: number;
  private originalVelocity: number;
  private frameId!: number;
  private from!: number;

  private isPaused = false;
  private isCancelled = false;

  constructor(
    private mv: MotionValue<number>,
    initialVelocity: number,
    private decayFactor: number,
    private hooks: DecayOpts
  ) {
    this.originalVelocity = initialVelocity;
    this.velocity = initialVelocity;
    this.from = this.mv.current;
  }

  start() {
    this.isPaused = false;
    this.isCancelled = false;

    this.hooks.onStart?.();

    this.mv.setAnimationController(this);
    this.isCancelled = false;
    this.frameId = requestAnimationFrame(this.animate);
  }

  private animate = () => {
    if (this.isCancelled || this.isPaused) return;

    this.velocity *= this.decayFactor;
    const next = this.mv.current + this.velocity * (1 / 60);
    this.mv.set(next);

    if (Math.abs(this.velocity) > 0.001) {
      this.frameId = requestAnimationFrame(this.animate);
    } else {
      this.hooks.onComplete?.();
    }
  };

  pause() {
    if (this.isCancelled || this.isPaused) return;

    this.isPaused = true;
    cancelAnimationFrame(this.frameId);
    this.hooks.onPause?.();
  }

  resume() {
    if (this.isCancelled || !this.isPaused) return;

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

    this.mv.set(this.from);
    this.velocity = this.originalVelocity;
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
