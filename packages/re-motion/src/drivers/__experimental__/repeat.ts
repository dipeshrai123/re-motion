import { defineAnimation } from './defineAnimation';
import { AnimationObject } from './types';

export function withRepeat<T>(
  _nextAnimation: AnimationObject<T> | (() => AnimationObject<T>),
  numberOfReps = 2,
  reverse = false,
  callback?: (finished: boolean) => void
) {
  return defineAnimation(() => {
    const nextAnimation: any =
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
        // call inner animation's callback on every repetition
        // as the second argument the animation's current value is passed
        if (nextAnimation.callback) {
          nextAnimation.callback(true, animation.current);
        }
        if (numberOfReps > 0 && animation.reps >= numberOfReps) {
          return true;
        }

        const startValue = reverse
          ? (nextAnimation.current as number)
          : animation.startValue;
        if (reverse) {
          nextAnimation.toValue = animation.startValue;
          animation.startValue = startValue;
        }
        nextAnimation.onStart(
          nextAnimation,
          startValue,
          now,
          (nextAnimation as any).previousAnimation
        );
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
