import { Easing } from '../../easing/Easing';
import { defineAnimation } from '../core/defineAnimation';

export interface TimingConfig {
  duration?: number;
  easing?: (t: number) => number;
}

export function withTiming(
  toValue: number,
  userConfig: TimingConfig = {},
  callback?: (finished: boolean) => void
) {
  return defineAnimation(() => {
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

    function onStart(
      animation: any,
      value: number,
      now: number,
      previousAnimation: any
    ) {
      if (
        previousAnimation &&
        previousAnimation.type === 'timing' &&
        previousAnimation.toValue === toValue &&
        previousAnimation.startTime
      ) {
        animation.startTime = previousAnimation.startTime;
        animation.startValue = previousAnimation.startValue;
      } else {
        animation.startTime = now;
        animation.startValue = value;
      }
      animation.current = value;
      animation.easing = config.easing;
    }

    function onFrame(animation: any, now: number) {
      const { toValue, startTime, startValue } = animation;
      const runtime = now - startTime;

      if (runtime >= config.duration) {
        animation.startTime = 0;
        animation.current = toValue;
        return true;
      }

      const progress = animation.easing(runtime / config.duration);
      animation.current =
        (startValue as number) + (toValue - (startValue as number)) * progress;
      return false;
    }

    return {
      type: 'timing',
      onStart,
      onFrame,
      toValue,
      current: toValue,
      callback,
    };
  });
}
