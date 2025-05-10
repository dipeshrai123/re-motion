import { MotionValue } from '../MotionValue';
import { AnimationController } from './AnimationController';

class DecayController implements AnimationController {
  private velocity: number;
  private frameId!: number;
  private cancelled = false;

  constructor(
    private mv: MotionValue<number>,
    initialVelocity: number,
    private decayFactor: number = 0.998,
    private onComplete?: () => void
  ) {
    this.velocity = initialVelocity;
  }

  start() {
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
      this.onComplete?.();
    }
  };

  pause() {
    if (this.cancelled) return;
    this.cancelled = true;
    cancelAnimationFrame(this.frameId);
  }

  resume() {
    if (!this.cancelled) return;
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
  opts: {
    decay?: number;
    onComplete?: () => void;
  } = {}
): DecayController {
  const ctl = new DecayController(mv, velocity, opts.decay, opts.onComplete);
  return ctl;
}
