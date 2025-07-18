import { Easing } from '../../easing/Easing';
import { createAnimator } from '../core/createAnimator';

export interface TimingConfig {
  duration?: number;
  easing?: (t: number) => number;
}

export function withTiming(
  target: number,
  userConfig: TimingConfig = {},
  callback?: (finished: boolean) => void
) {
  return createAnimator(() => {
    const config: Required<TimingConfig> = {
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
      animation: any,
      value: number,
      now: number,
      previousAnimation: any
    ) {
      if (
        previousAnimation &&
        previousAnimation.type === 'timing' &&
        previousAnimation.target === target &&
        previousAnimation.startTime
      ) {
        animation.startTime = previousAnimation.startTime;
        animation.origin = previousAnimation.origin;
      } else {
        animation.startTime = now;
        animation.origin = value;
      }
      animation.current = value;
      animation.easing = config.easing;
    }

    function step(animation: any, now: number) {
      const { target, startTime, origin } = animation;
      const runtime = now - startTime;

      if (runtime >= config.duration) {
        animation.startTime = 0;
        animation.current = target;
        return true;
      }

      const progress = animation.easing(runtime / config.duration);
      animation.current = origin + (target - origin) * progress;
      return false;
    }

    return {
      type: 'timing',
      start,
      step,
      target,
      current: target,
      callback,
      startValue: 0,
      startTime: 0,
      easing: () => 0,
    };
  });
}
