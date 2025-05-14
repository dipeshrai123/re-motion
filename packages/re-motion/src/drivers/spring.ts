import { MotionValue } from '../MotionValue';
import { AnimationController } from './AnimationController';

interface SpringOpts {
  stiffness?: number;
  damping?: number;
  mass?: number;
  onStart?(): void;
  onPause?(): void;
  onResume?(): void;
  onComplete?(): void;
}

class SpringController implements AnimationController {
  private velocity = 0;
  private frameId!: number;
  private originalVelocity = 0;

  private isPaused = false;
  private isCancelled = false;

  constructor(
    private mv: MotionValue<number>,
    private to: number,
    private stiffness: number,
    private damping: number,
    private mass: number,
    private hooks: SpringOpts
  ) {
    this.originalVelocity = 0;
  }

  start() {
    this.hooks.onStart?.();
    this.mv.setAnimationController(this);

    this.isPaused = false;
    this.isCancelled = false;
    this.velocity = this.originalVelocity;

    this.frameId = requestAnimationFrame(this.animate);
  }

  private animate = () => {
    if (this.isCancelled || this.isPaused) return;

    const x = this.mv.current;
    const F = -this.stiffness * (x - this.to) - this.damping * this.velocity;
    this.velocity += (F / this.mass) * (1 / 60);

    const next = x + this.velocity * (1 / 60);
    this.mv.internalSet(next);

    if (Math.abs(this.velocity) > 0.001 || Math.abs(x - this.to) > 0.001) {
      this.frameId = requestAnimationFrame(this.animate);
    } else {
      this.mv.internalSet(this.to);
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
    this.velocity = this.originalVelocity;
    this.mv.reset();
  }

  setOnComplete(fn: () => void) {
    this.hooks.onComplete = fn;
  }
}

export function spring(
  mv: MotionValue<number>,
  to: number,
  opts: SpringOpts = {}
): SpringController {
  const { stiffness = 170, damping = 26, mass = 1, ...hooks } = opts;
  const ctl = new SpringController(mv, to, stiffness, damping, mass, hooks);
  return ctl;
}
