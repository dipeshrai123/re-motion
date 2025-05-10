import { Easing } from '../easing/easing';
import { MotionValue } from '../MotionValue';
import { AnimationController } from './AnimationController';

class TimingController implements AnimationController {
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
    this.mv.setAnimationController(this);

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
  return ctl;
}
