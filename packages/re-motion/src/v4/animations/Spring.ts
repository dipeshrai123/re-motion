import { FluidAnimation, EndResultType } from './FluidAnimation';

export type SpringConfig = {
  toValue: number;
  mass?: number;
  tension?: number;
  friction?: number;
  restDistance?: number;
  delay?: number;
};

export class Spring extends FluidAnimation {
  private startTime: number;
  private restDisplacementThreshold: number;
  private restSpeedThreshold: number;
  private velocity: number;
  private position: number;
  private toValue: number;
  private mass: number;
  private tension: number;
  private friction: number;
  private delay: number;
  private timeout: any;
  private aniamtionFrame: any;
  private onChange: (value: number) => void;

  constructor(config: SpringConfig) {
    super();

    this.restDisplacementThreshold = this.restSpeedThreshold =
      config?.restDistance ?? 0.001;
    this.velocity = 0;
    this.toValue = config.toValue;
    this.mass = config?.mass ?? 1;
    this.tension = config?.tension ?? 170;
    this.friction = config?.friction ?? 26;
    this.delay = config?.delay ?? 0;
  }

  start = (
    value: number,
    onChange: (value: number) => void,
    onEnd: (result: EndResultType) => void | null,
    previousAnimation: FluidAnimation | null
  ) => {
    const onStart = () => {
      this.isActive = true;
      this.position = value;
      this.onChange = onChange;
      this.onEnd = onEnd;

      const now = Date.now();

      if (previousAnimation instanceof Spring) {
        this.velocity = previousAnimation.velocity || this.velocity || 0;
        this.startTime = previousAnimation.startTime || now;
      } else {
        this.startTime = now;
      }

      this.aniamtionFrame = requestAnimationFrame(this.onUpdate.bind(this));
    };

    if (this.delay !== 0) {
      this.timeout = setTimeout(() => onStart(), this.delay);
    } else {
      onStart();
    }
  };

  stop() {
    this.isActive = false;
    clearTimeout(this.timeout);
    cancelAnimationFrame(this.aniamtionFrame);
    this.debouncedOnEnd({ finished: false, value: this.position });
  }

  onUpdate() {
    const now = Date.now();

    const deltaTime = Math.min(now - this.startTime, 64);
    this.startTime = now;

    const c = this.friction;
    const m = this.mass;
    const k = this.tension;

    const v0 = -this.velocity;
    const x0 = this.toValue - this.position;

    const zeta = c / (2 * Math.sqrt(k * m)); // damping ratio
    const omega0 = Math.sqrt(k / m); // undamped angular frequency of the oscillator (rad/ms)
    const omega1 = omega0 * Math.sqrt(1 - zeta ** 2); // exponential decay

    const t = deltaTime / 1000;

    const sin1 = Math.sin(omega1 * t);
    const cos1 = Math.cos(omega1 * t);

    // under damped
    const underDampedEnvelope = Math.exp(-zeta * omega0 * t);
    const underDampedFrag1 =
      underDampedEnvelope *
      (sin1 * ((v0 + zeta * omega0 * x0) / omega1) + x0 * cos1);

    const underDampedPosition = this.toValue - underDampedFrag1;
    // This looks crazy -- it's actually just the derivative of the oscillation function
    const underDampedVelocity =
      zeta * omega0 * underDampedFrag1 -
      underDampedEnvelope *
        (cos1 * (v0 + zeta * omega0 * x0) - omega1 * x0 * sin1);

    // critically damped
    const criticallyDampedEnvelope = Math.exp(-omega0 * t);
    const criticallyDampedPosition =
      this.toValue - criticallyDampedEnvelope * (x0 + (v0 + omega0 * x0) * t);

    const criticallyDampedVelocity =
      criticallyDampedEnvelope *
      (v0 * (t * omega0 - 1) + t * x0 * omega0 * omega0);

    this.onChange(this.position);

    const isVelocity = Math.abs(this.velocity) < this.restSpeedThreshold;
    const isDisplacement =
      this.tension === 0 ||
      Math.abs(this.toValue - this.position) < this.restDisplacementThreshold;

    if (zeta < 1) {
      this.position = underDampedPosition;
      this.velocity = underDampedVelocity;
    } else {
      this.position = criticallyDampedPosition;
      this.velocity = criticallyDampedVelocity;
    }

    if (isVelocity && isDisplacement) {
      if (this.tension !== 0) {
        this.velocity = 0;
        this.position = this.toValue;

        this.onChange(this.position);
      }

      this.startTime = 0;
      this.debouncedOnEnd({ finished: true, value: this.toValue });

      return;
    }

    this.aniamtionFrame = requestAnimationFrame(this.onUpdate.bind(this));
  }
}
