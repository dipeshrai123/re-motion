import { MotionValue } from './value';
import { Easing } from './easing';

const activeController = new WeakMap<
  MotionValue<number>,
  AnimationController
>();

export interface AnimationController {
  start(): void;
  pause(): void;
  resume(): void;
  cancel(): void;
}

function cancelAll(mv: MotionValue<number>) {
  const ctl = activeController.get(mv);
  if (ctl) {
    ctl.cancel();
    activeController.delete(mv);
  }
}

export class TimingController implements AnimationController {
  private from!: number;
  private startTime!: number;
  private frameId!: number;
  private cancelled = false;
  private pausedAt: number | null = null;
  private elapsedBeforePause = 0;

  constructor(
    private mv: MotionValue<number>,
    private to: number,
    private duration: number = 300,
    private easing: (t: number) => number = Easing.linear,
    private onComplete?: () => void
  ) {}

  start() {
    cancelAll(this.mv);
    activeController.set(this.mv, this);

    this.from = this.mv.current;
    this.startTime = performance.now();
    this.cancelled = false;
    this.pausedAt = null;
    this.elapsedBeforePause = 0;

    this.frameId = requestAnimationFrame(this.animate);
  }

  private animate = (ts: number) => {
    if (this.cancelled) return;

    const elapsed = this.elapsedBeforePause + (ts - this.startTime);
    const t = Math.min(1, elapsed / this.duration);
    this.mv.set(this.from + (this.to - this.from) * this.easing(t));

    if (t < 1) {
      this.frameId = requestAnimationFrame(this.animate);
    } else {
      this.mv.set(this.to);
      activeController.delete(this.mv);
      this.onComplete?.();
    }
  };

  pause() {
    if (this.cancelled || this.pausedAt != null) return;
    this.pausedAt = performance.now();
    this.elapsedBeforePause += this.pausedAt - this.startTime;
    cancelAnimationFrame(this.frameId);
  }

  resume() {
    if (this.cancelled || this.pausedAt == null) return;
    this.startTime = performance.now();
    this.pausedAt = null;
    this.frameId = requestAnimationFrame(this.animate);
  }

  cancel() {
    this.cancelled = true;
    cancelAnimationFrame(this.frameId);
    activeController.delete(this.mv);
  }
}

export function timing(
  mv: MotionValue<number>,
  to: number,
  opts: {
    duration?: number;
    easing?: (t: number) => number;
    onComplete?: () => void;
  } = {}
): TimingController {
  const ctl = new TimingController(
    mv,
    to,
    opts.duration,
    opts.easing,
    opts.onComplete
  );
  ctl.start();
  return ctl;
}

export class SpringController implements AnimationController {
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
    cancelAll(this.mv);
    activeController.set(this.mv, this);

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
      activeController.delete(this.mv);
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
    activeController.delete(this.mv);
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
  ctl.start();
  return ctl;
}

export class DecayController implements AnimationController {
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
    cancelAll(this.mv);
    activeController.set(this.mv, this);

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
      activeController.delete(this.mv);
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
    activeController.delete(this.mv);
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
  ctl.start();
  return ctl;
}
