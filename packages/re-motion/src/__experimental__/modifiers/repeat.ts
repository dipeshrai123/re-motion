import { createAnimator } from '../core/createAnimator';
import type { Animator } from '../core/types';

export function withRepeat<T>(
  _nextAnimator: Animator<T> | (() => Animator<T>),
  numberOfReps = 2,
  reverse = false,
  callback?: (finished: boolean) => void
) {
  return createAnimator(() => {
    const nextAnimator =
      typeof _nextAnimator === 'function' ? _nextAnimator() : _nextAnimator;

    function start(animator: any, value: T, now: number, previous?: any) {
      animator.origin = value;
      animator.reps = 0;
      nextAnimator.start(nextAnimator, value, now, previous);
    }

    function step(animator: any, now: number): boolean {
      const finished = nextAnimator.step(nextAnimator, now);
      animator.current = nextAnimator.current;

      if (finished) {
        animator.reps += 1;
        nextAnimator.callback?.(true);

        if (numberOfReps > 0 && animator.reps >= numberOfReps) {
          return true;
        }

        const from = reverse
          ? (nextAnimator.current as number)
          : animator.origin;

        if (reverse) {
          const prevTo = nextAnimator.target;
          nextAnimator.target = animator.origin;
          animator.origin = prevTo;
        }

        nextAnimator.start(nextAnimator, from, now, undefined);

        return false;
      }

      return false;
    }

    const repCallback = (finished: boolean) => {
      if (callback) callback(finished);
      if (!finished) nextAnimator.callback?.(false);
    };

    return {
      wrapper: true,
      step,
      start,
      reps: 0,
      current: nextAnimator.current,
      callback: repCallback,
      origin: 0,
    };
  });
}
