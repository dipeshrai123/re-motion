import { createAnimator } from '../core/createAnimator';

export interface DecayConfig {
  deceleration?: number;
  velocity?: number;
}

const VELOCITY_EPS = 1 / 20;

export function withDecay(
  userConfig?: DecayConfig,
  callback?: (finished: boolean) => void
) {
  return createAnimator(() => {
    const config: Required<DecayConfig> = {
      deceleration: 0.998,
      velocity: 0,
    };

    if (userConfig) {
      Object.keys(userConfig).forEach(
        (key) =>
          ((config as any)[key] = userConfig[key as keyof typeof userConfig])
      );
    }

    function start(animation: any, value: number, now: number): void {
      const initialVelocity = config.velocity;
      animation.current = value;
      animation.lastTimestamp = now;
      animation.startTimestamp = now;
      animation.initialVelocity = initialVelocity;
      animation.velocity = initialVelocity;
    }

    function step(animation: any, now: number): boolean {
      const dt = Math.min(now - animation.lastTimestamp, 64);
      animation.lastTimestamp = now;
      animation.velocity! *= Math.pow(config.deceleration!, dt);
      animation.current! += animation.velocity! * dt;
      return Math.abs(animation.velocity!) < VELOCITY_EPS;
    }

    return {
      type: 'decay',
      start,
      step,
      current: undefined,
      velocity: config.velocity || 0,
      initialVelocity: 0,
      lastTimestamp: 0,
      startTimestamp: 0,
      callback,
    };
  });
}
