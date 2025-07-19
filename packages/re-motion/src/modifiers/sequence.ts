import { createAnimator } from '../core/animator';
import type { Animator } from '../core/types';

export function withSequence<T>(
  ...animators: (Animator<T> | (() => Animator<T>))[]
) {
  return createAnimator(() => {
    const anims = animators.map((a) => (typeof a === 'function' ? a() : a));

    anims.forEach((a) => (a.finished = false));

    function start(
      animation: any,
      value: T,
      now: number,
      previousAnimation?: any
    ) {
      animation.animationIndex = 0;
      animation.current = value;

      const current = anims[0];
      current.start(current, value, now, previousAnimation);
    }

    function step(animation: any, now: number): boolean {
      const current = anims[animation.animationIndex];
      const finished = current.step(current, now);
      animation.current = current.current;

      if (finished) {
        current.finished = true;
        current.callback?.(true);

        animation.animationIndex += 1;

        if (animation.animationIndex >= anims.length) {
          return true;
        }

        const next = anims[animation.animationIndex];
        next.start(next, current.current, now, current);
      }

      return false;
    }

    const onCancel = (finished: boolean) => {
      if (!finished) {
        for (const anim of anims) {
          if (!anim.finished) {
            anim.callback?.(false);
          }
        }
      }
    };

    return {
      wrapper: true,
      start,
      step,
      callback: onCancel,
      current: anims[0]?.current ?? 0,
      animationIndex: 0,
    };
  });
}
