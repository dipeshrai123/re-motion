import { Easing } from '../easing/Easing';
import { createAnimator } from '../core/animator';
import { Animator } from '../core/types';

export interface WithTimingConfig {
  duration?: number;
  easing?: (t: number) => number;
}

export interface TimingAnimator<T> extends Animator<T> {
  type: 'timing';
  origin: T;
  current: T;
  target: T;
  startTime: number;
  easing: (t: number) => number;
}

export function withTiming(
  target: number,
  userConfig: WithTimingConfig = {},
  callback?: (finished: boolean) => void
): TimingAnimator<number> {
  return createAnimator(() => {
    const config: Required<WithTimingConfig> = {
      duration: 300,
      easing: Easing.inOut(Easing.quad),
    };

    if (userConfig) {
      Object.keys(userConfig).forEach(
        (key) =>
          ((config as any)[key] = userConfig[key as keyof typeof userConfig])
      );
    }

    function start(
      animator: TimingAnimator<number>,
      value: number,
      now: number,
      previous: TimingAnimator<number>
    ) {
      if (
        previous &&
        previous.type === 'timing' &&
        previous.target === target &&
        previous.startTime
      ) {
        animator.startTime = previous.startTime;
        animator.origin = previous.origin;
      } else {
        animator.startTime = now;
        animator.origin = value;
      }
      animator.current = value;
      animator.easing = config.easing;
    }

    function step(animator: TimingAnimator<number>, now: number) {
      const { target, startTime, origin } = animator;
      const runtime = now - startTime;

      if (runtime >= config.duration) {
        animator.startTime = 0;
        animator.current = target;
        return true;
      }

      const progress = animator.easing(runtime / config.duration);
      animator.current = origin + (target - origin) * progress;
      return false;
    }

    return {
      type: 'timing',
      start,
      step,
      target,
      current: target,
      callback,
      origin: 0,
      startTime: 0,
      easing: () => 0,
    };
  });
}
