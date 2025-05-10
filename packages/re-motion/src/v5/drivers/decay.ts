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
  private cancelled = false;
  private from!: number;

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
    this.hooks.onStart?.();

    this.mv.setAnimationController(this);
    this.cancelled = false;
    this.frameId = requestAnimationFrame(this.animate);
  }

  private animate = () => {
    if (this.cancelled) return;

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
    if (this.cancelled) return;
    this.cancelled = true;
    cancelAnimationFrame(this.frameId);

    this.hooks.onPause?.();
  }

  resume() {
    if (!this.cancelled) return;

    this.hooks.onResume?.();

    this.cancelled = false;
    this.frameId = requestAnimationFrame(this.animate);
  }

  cancel() {
    this.cancelled = true;
    cancelAnimationFrame(this.frameId);
  }

  reset() {
    this.cancelled = true;
    cancelAnimationFrame(this.frameId);

    this.mv.set(this.from);
    this.velocity = this.originalVelocity;
  }

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
