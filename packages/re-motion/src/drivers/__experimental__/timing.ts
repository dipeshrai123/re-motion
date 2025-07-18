// withTiming.ts
import { defineAnimation } from './defineAnimation';

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
    const duration = userConfig.duration ?? 300;
    const easing = userConfig.easing ?? ((t) => t);
    let startTime = 0;

    function onStart(anim: any, value: number, now: number) {
      startTime = anim.startTime || now;
      anim.startValue = value;
      anim.current = value;
      anim.easing = easing;
    }

    function onFrame(anim: any, now: number) {
      const elapsed = now - startTime;
      if (elapsed >= duration) {
        anim.current = toValue;
        callback?.(true);
        return true;
      }
      const t = anim.easing(elapsed / duration);
      anim.current = anim.startValue + (toValue - anim.startValue) * t;
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
