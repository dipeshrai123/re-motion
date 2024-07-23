import { FluidAnimation } from './FluidAnimation';

type TimingConfig = {
  toValue: number;
  duration?: number;
};

export class Timing extends FluidAnimation {
  public isActive: boolean;
  public startTime: number;
  public fromValue: number;
  public toValue: any;
  public duration: number;
  public animationFrame: any;
  public onChange: (value: number) => void;
  public onEnd: (value: number) => void;

  constructor(config: TimingConfig) {
    super();
    this.toValue = config.toValue;
    this.duration = config?.duration ?? 250;
  }

  start(
    fromValue: number,
    onChange: (value: number) => void,
    onEnd: (value: number) => void
  ) {
    this.isActive = true;
    this.fromValue = fromValue;
    this.onChange = onChange;
    this.onEnd = onEnd;

    if (this.duration === 0) {
      this.onChange(this.toValue);
    } else {
      this.startTime = Date.now();
      this.animationFrame = requestAnimationFrame(this.onUpdate.bind(this));
    }
  }

  stop() {
    this.isActive = false;
    cancelAnimationFrame(this.animationFrame);
  }

  onUpdate(): void {
    var now = Date.now();

    if (now >= this.startTime + this.duration) {
      if (this.duration === 0) {
        this.onChange(this.toValue);
      } else {
        this.onChange(this.fromValue + (this.toValue - this.fromValue));
      }

      return;
    }

    this.onChange(
      this.fromValue +
        ((now - this.startTime) / this.duration) *
          (this.toValue - this.fromValue)
    );

    if (this.isActive) {
      this.animationFrame = requestAnimationFrame(this.onUpdate.bind(this));
    }
  }
}