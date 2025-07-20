import { createAnimator } from '../core/animator';
import type { Animator } from '../core/types';

export function delay<T>(
  delayMs: number,
  _nextAnimator: Animator<T> | (() => Animator<T>)
) {
  return createAnimator(() => {
    const nextAnimator =
      typeof _nextAnimator === 'function' ? _nextAnimator() : _nextAnimator;

    let started = false;
    let startTime = 0;

    function start(
      animator: any,
      value: T,
      now: number,
      previous?: Animator<T>
    ) {
      animator.current = value;
      animator.previous = previous;
      startTime = now;
      started = false;
    }

    function step(animator: any, now: number): boolean {
      const elapsed = now - startTime;

      if (elapsed >= delayMs) {
        if (!started) {
          started = true;
          nextAnimator.start(
            nextAnimator,
            animator.current,
            now,
            animator.previous
          );
        }
        const finished = nextAnimator.step(nextAnimator, now);
        animator.current = nextAnimator.current;
        return finished;
      }

      return false;
    }

    const callback = (finished: boolean) => {
      nextAnimator.callback?.(finished);
    };

    return {
      wrapper: true,
      start,
      step,
      callback,
      current: 0 as any,
      previous: null,
    };
  });
}
