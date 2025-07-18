import { wrapAnimatorLifecycle } from './wrapAnimatorLifeCycle';

export function createAnimator<T>(factory: () => T): T {
  const builder = () => {
    const animator = factory();
    wrapAnimatorLifecycle(animator as any);
    return animator;
  };
  (builder as any).__isAnimator = true;
  return builder as T;
}
