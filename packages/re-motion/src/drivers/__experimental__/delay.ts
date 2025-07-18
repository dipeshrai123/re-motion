// withDelay.ts
import { defineAnimation } from './defineAnimation';
import type { AnimationObject } from './types';

export function withDelay<T>(
  delayMs: number,
  _nextAnimation: AnimationObject<T> | (() => AnimationObject<T>)
) {
  return defineAnimation(() => {
    const nextAnimation =
      typeof _nextAnimation === 'function' ? _nextAnimation() : _nextAnimation;

    let started = false;
    let startTime = 0;

    function onStart(
      animation: any,
      value: T,
      now: number,
      previousAnimation?: AnimationObject<T>
    ) {
      animation.current = value;
      animation.previousAnimation = previousAnimation;
      startTime = now;
      started = false;
    }

    function onFrame(animation: any, now: number): boolean {
      const elapsed = now - startTime;

      if (elapsed >= delayMs) {
        if (!started) {
          started = true;
          nextAnimation.onStart(
            nextAnimation,
            animation.current,
            now,
            animation.previousAnimation
          );
        }
        const finished = nextAnimation.onFrame(nextAnimation, now);
        animation.current = nextAnimation.current;
        return finished;
      }

      // If delay hasn't passed, hold current value
      return false;
    }

    const callback = (finished: boolean) => {
      nextAnimation.callback?.(finished);
    };

    return {
      isHigherOrder: true,
      onStart,
      onFrame,
      callback,
      current: 0 as any, // will be updated by child
      previousAnimation: null,
    };
  });
}
