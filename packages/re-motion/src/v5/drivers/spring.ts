import { MotionValue } from '../MotionValue';
import { AnimationController } from './AnimationController';

class SpringController implements AnimationController {
  private velocity = 0;
  private frameId!: number;
  private cancelled = false;

  constructor(
    private mv: MotionValue<number>,
    private to: number,
    private stiffness: number = 170,
    private damping: number = 26,
    private onComplete?: () => void
  ) {}

  start() {
    this.mv.setAnimationController(this);

    this.cancelled = false;
    this.frameId = requestAnimationFrame(this.animate);
  }

  private animate = () => {
    if (this.cancelled) return;

    const x = this.mv.current;
    const F = -this.stiffness * (x - this.to) - this.damping * this.velocity;
    this.velocity += F * (1 / 60);
    const next = x + this.velocity * (1 / 60);
    this.mv.set(next);

    if (Math.abs(this.velocity) > 0.001 || Math.abs(x - this.to) > 0.001) {
      this.frameId = requestAnimationFrame(this.animate);
    } else {
      this.mv.set(this.to);
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

export function spring(
  mv: MotionValue<number>,
  to: number,
  opts: {
    stiffness?: number;
    damping?: number;
    onComplete?: () => void;
  } = {}
): SpringController {
  const ctl = new SpringController(
    mv,
    to,
    opts.stiffness,
    opts.damping,
    opts.onComplete
  );
  return ctl;
}
