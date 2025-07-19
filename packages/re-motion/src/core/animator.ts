import { MotionValue } from './MotionValue';
import type { Animator } from './types';

function wrapAnimatorLifecycle<T>(animator: Animator<T>) {
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

export function createAnimator<T>(factory: () => T): T {
  const builder = () => {
    const animator = factory();
    wrapAnimatorLifecycle(animator as any);
    return animator;
  };
  (builder as any).__isAnimator = true;
  return builder as T;
}

export function assignAnimator<T>(
  mv: MotionValue<T>,
  incoming: T | Animator<T> | (() => Animator<T>),
  forceUpdate = false
): void {
  const previous = mv.activeAnimator;
  if (previous) {
    previous.cancelled = true;
    mv.activeAnimator = null;
  }

  const isFactory = typeof incoming === 'function';
  const animator: Animator<T> | null = isFactory
    ? (incoming as () => Animator<T>)()
    : typeof incoming === 'object' && incoming && 'step' in incoming
    ? (incoming as Animator<T>)
    : null;

  if (animator) {
    if (!forceUpdate && mv.current === animator.current && !animator.wrapper) {
      animator.callback?.(true);
      return;
    }

    const now = performance.now();
    animator.start(animator, mv.value, now, previous);

    const step = (ts: number) => {
      if (animator.cancelled) {
        animator.callback?.(false);
        return;
      }

      const finished = animator.step(animator, ts);
      mv.current = animator.current!;
      mv.notifyListeners();

      if (finished) {
        animator.callback?.(true);
      } else {
        mv.activeAnimator = animator;
        requestAnimationFrame(step);
      }
    };

    mv.activeAnimator = animator;
    requestAnimationFrame(step);
  } else {
    if (!forceUpdate && mv.current === (incoming as T)) return;
    mv.current = incoming as T;
    mv.notifyListeners();
  }
}

export function cancelAnimator<T>(mv: MotionValue<T>) {
  mv.value = mv.value;
}
