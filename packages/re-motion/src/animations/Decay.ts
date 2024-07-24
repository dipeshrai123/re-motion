import { FluidAnimation, EndResultType } from './FluidAnimation';

export type DecayConfig = {
  velocity?: number;
  deceleration?: number;
  delay?: number;
};

export class Decay extends FluidAnimation {
  private startTime: number;
  private fromValue: number;
  private position: number;
  private lastPosition: number;
  private velocity: number;
  private deceleration: number;
  private delay: number;
  private timeout: any;
  private animationFrame: any;
  private onFrame: (value: number) => void;

  constructor(config: DecayConfig) {
    super();

    this.deceleration = config?.deceleration ?? 0.998;
    this.velocity = config?.velocity ?? 0;
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
      this.fromValue = this.position = this.lastPosition = value;
      this.onFrame = onFrame;
      this.onEnd = onEnd;

      this.startTime = Date.now();

      if (previousAnimation instanceof Decay) {
        this.velocity = previousAnimation.velocity;
        this.deceleration = previousAnimation.deceleration;
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

    this.position =
      this.fromValue +
      (this.velocity / (1 - this.deceleration)) *
        (1 - Math.exp(-(1 - this.deceleration) * (now - this.startTime)));

    if (Math.abs(this.lastPosition - this.position) < 0.1) {
      this.debouncedOnEnd({ finished: true, value: this.position });
      return;
    }

    this.onFrame(this.position);

    this.lastPosition = this.position;

    if (this.isActive) {
      this.animationFrame = requestAnimationFrame(this.onUpdate.bind(this));
    }
  }
}
