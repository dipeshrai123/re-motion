import { Animator } from './types';

export function wrapAnimatorLifecycle<T>(animator: Animator<T>) {
  const baseStart = animator.start;
  const baseStep = animator.step;

  animator.start = (
    anim: Animator<T>,
    from: T,
    now: number,
    previous?: Animator<T> | null
  ) => {
    anim.current = from;
    anim.origin = from;
    anim.cancelled = false;
    anim.finished = false;
    return baseStart(anim, from, now, previous);
  };

  animator.step = (anim, now) => {
    return baseStep(anim, now);
  };
}
