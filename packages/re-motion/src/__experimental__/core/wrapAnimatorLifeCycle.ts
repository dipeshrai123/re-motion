export function wrapAnimatorLifecycle(animator: any) {
  const baseStart = animator.start;
  const baseStep = animator.step;

  animator.start = (from: any, set: any, now: number) => {
    animator.current = from;
    animator.previous = null;
    return baseStart(from, set, now);
  };

  animator.step = (now: number) => {
    return baseStep(now);
  };
}
