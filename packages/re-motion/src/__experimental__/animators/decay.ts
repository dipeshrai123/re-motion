import { createAnimator } from '../core/animator';
import type { Animator } from '../core/types';

export interface WithDecayConfig {
  deceleration?: number;
  velocity?: number;
}

export interface DecayAnimator<T> extends Omit<Animator<T>, 'current'> {
  type: 'decay';
  current?: number;
  velocity: number;
  initialVelocity: number;
  lastTimestamp: number;
  startTimestamp: number;
}

const VELOCITY_EPS = 1 / 20;

export function withDecay(
  userConfig?: WithDecayConfig,
  callback?: (finished: boolean) => void
): DecayAnimator<number> {
  return createAnimator(() => {
    const config: Required<WithDecayConfig> = {
      deceleration: 0.998,
      velocity: 0,
    };

    if (userConfig) {
      Object.keys(userConfig).forEach(
        (key) =>
          ((config as any)[key] = userConfig[key as keyof typeof userConfig])
      );
    }

    function start(animator: any, value: number, now: number): void {
      const initialVelocity = config.velocity;
      animator.current = value;
      animator.lastTimestamp = now;
      animator.startTimestamp = now;
      animator.initialVelocity = initialVelocity;
      animator.velocity = initialVelocity;
    }

    function step(animator: any, now: number): boolean {
      const dt = Math.min(now - animator.lastTimestamp, 64);
      animator.lastTimestamp = now;
      animator.velocity! *= Math.pow(config.deceleration!, dt);
      animator.current! += animator.velocity! * dt;
      return Math.abs(animator.velocity!) < VELOCITY_EPS;
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
