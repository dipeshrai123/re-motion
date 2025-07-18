// withSequence.ts
import { defineAnimation } from './defineAnimation';
import type { AnimationObject } from './types';

export function withSequence<T>(
  ..._animations: (AnimationObject<T> | (() => AnimationObject<T>))[]
) {
  return defineAnimation(() => {
    // normalize the animation list
    const animations = _animations.map((a) =>
      typeof a === 'function' ? a() : a
    );

    // mark them unfinished
    animations.forEach((anim) => (anim.finished = false));

    function onStart(
      animation: any,
      value: T,
      now: number,
      previousAnimation?: any
    ) {
      animation.animationIndex = 0;
      animation.current = value;

      const current = animations[0];
      current.onStart(current, value, now, previousAnimation);
    }

    function onFrame(animation: any, now: number): boolean {
      const current = animations[animation.animationIndex];
      const finished = current.onFrame(current, now);
      animation.current = current.current;

      if (finished) {
        current.finished = true;
        current.callback?.(true);

        animation.animationIndex += 1;

        if (animation.animationIndex >= animations.length) {
          return true;
        }

        const next = animations[animation.animationIndex];
        next.onStart(next, current.current, now, current);
      }

      return false;
    }

    const onCancel = (finished: boolean) => {
      if (!finished) {
        for (const anim of animations) {
          if (!anim.finished) {
            anim.callback?.(false);
          }
        }
      }
    };

    return {
      isHigherOrder: true,
      onStart,
      onFrame,
      callback: onCancel,
      current: animations[0]?.current ?? 0,
      animationIndex: 0,
    };
  });
}
