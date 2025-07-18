import { defineAnimation } from '../core/defineAnimation';
import { AnimationObject } from '../core/types';

export function withRepeat<T>(
  _nextAnimation: AnimationObject<T> | (() => AnimationObject<T>),
  numberOfReps = 2,
  reverse = false,
  callback?: (finished: boolean) => void
) {
  return defineAnimation(() => {
    const nextAnimation =
      typeof _nextAnimation === 'function' ? _nextAnimation() : _nextAnimation;

    function onStart(
      animation: any,
      value: T,
      now: number,
      previousAnimation?: any
    ) {
      animation.startValue = value;
      animation.reps = 0;
      nextAnimation.onStart(nextAnimation, value, now, previousAnimation);
    }

    function onFrame(animation: any, now: number): boolean {
      const finished = nextAnimation.onFrame(nextAnimation, now);
      animation.current = nextAnimation.current;

      if (finished) {
        animation.reps += 1;
        nextAnimation.callback?.(true);

        if (numberOfReps > 0 && animation.reps >= numberOfReps) {
          return true;
        }

        const from = reverse
          ? (nextAnimation.current as number)
          : animation.startValue;

        if (reverse) {
          // manually flip the spring's target
          const prevTo = nextAnimation.toValue;
          nextAnimation.toValue = animation.startValue;
          animation.startValue = prevTo;
        }

        // ✅ Force full spring restart — treat as new animation
        nextAnimation.onStart(nextAnimation, from, now, undefined);

        return false;
      }

      return false;
    }

    const repCallback = (finished: boolean) => {
      if (callback) callback(finished);
      // if we got cancelled mid-flight, also fire inner's callback
      if (!finished) nextAnimation.callback?.(false);
    };

    return {
      isHigherOrder: true,
      onFrame,
      onStart,
      reps: 0,
      current: nextAnimation.current,
      callback: repCallback,
      startValue: 0,
    };
  });
}
