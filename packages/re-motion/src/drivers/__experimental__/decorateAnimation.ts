// decorateAnimation.ts
// ---------------------

/**
 * Injects a uniform onStart/onFrame wrapper around your raw animation,
 * so drivers only focus on their own logic.
 */
export function decorateAnimation(anim: any) {
  'worklet';
  const baseOnStart = anim.onStart;
  const baseOnFrame = anim.onFrame;

  anim.onStart = (animation: any, value: any, timestamp: number) => {
    animation.startValue = value;
    animation.current = value;
    return baseOnStart(animation, value, timestamp);
  };

  anim.onFrame = (animation: any, timestamp: number) => {
    return baseOnFrame(animation, timestamp);
  };
}
