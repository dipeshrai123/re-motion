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
  private frameId!: number;
  private cancelled = false;

  constructor(
    private mv: MotionValue<number>,
    initialVelocity: number,
    private decayFactor: number,
    private hooks: DecayOpts
  ) {
    this.velocity = initialVelocity;
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
}

export function decay(
  mv: MotionValue<number>,
  velocity: number,
  opts: DecayOpts = {}
): DecayController {
  const ctl = new DecayController(mv, velocity, opts.decay ?? 0.998, opts);
  return ctl;
}
