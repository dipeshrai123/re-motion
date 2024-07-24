import { Easing } from '../easing/Easing';
import { FluidAnimation, EndResultType } from './FluidAnimation';

export type TimingConfig = {
  toValue: number;
  duration?: number;
  easing?: (value: number) => number;
  delay?: number;
};

export class Timing extends FluidAnimation {
  public isActive: boolean;
  public position: number;
  public startTime: number;
  public fromValue: number;
  public toValue: number;
  public duration: number;
  public delay: number;
  public timeout: any;
  public animationFrame: any;
  public easing: (value: number) => number;
  public onFrame: (value: number) => void;

  constructor(config: TimingConfig) {
    super();
    this.toValue = config.toValue;
    this.duration = config?.duration ?? 250;
    this.easing = config?.easing ?? Easing.linear;
    this.delay = config?.delay ?? 0;
  }

  start(
    value: number,
    onFrame: (value: number) => void,
    onEnd: (result: EndResultType) => void | null,
    previousAnimation: FluidAnimation | null
  ) {
    const onStart = () => {
      this.isActive = true;
      this.fromValue = this.position = value;
      this.onFrame = onFrame;
      this.onEnd = onEnd;

      if (
        previousAnimation &&
        previousAnimation instanceof Timing &&
        previousAnimation.toValue === this.toValue &&
        previousAnimation.startTime
      ) {
        this.startTime = previousAnimation.startTime;
        this.fromValue = previousAnimation.fromValue;
      } else {
        this.startTime = Date.now();
        this.fromValue = this.position;
      }

      this.animationFrame = requestAnimationFrame(this.onUpdate.bind(this));
    };

    if (this.delay !== 0) {
      this.timeout = setTimeout(() => onStart(), this.delay);
    } else {
      onStart();
    }
  }

  stop() {
    this.isActive = false;
    clearTimeout(this.timeout);
    cancelAnimationFrame(this.animationFrame);
    this.debouncedOnEnd({ finished: false, value: this.position });
  }

  onUpdate() {
    const now = Date.now();
    const runTime = now - this.startTime;

    if (runTime >= this.duration) {
      this.startTime = 0;
      this.position = this.toValue;

      this.onFrame(this.position);
      this.debouncedOnEnd({ finished: true, value: this.position });
      return;
    }

    const progress = this.easing(runTime / this.duration);
    this.position = this.fromValue + (this.toValue - this.fromValue) * progress;

    this.onFrame(this.position);

    if (this.isActive) {
      this.animationFrame = requestAnimationFrame(this.onUpdate.bind(this));
    }
  }
}
