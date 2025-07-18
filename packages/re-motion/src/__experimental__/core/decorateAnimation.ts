export function decorateAnimation(animation: any) {
  const baseOnStart = animation.onStart;
  const baseOnFrame = animation.onFrame;

  animation.previousAnimation = null;

  animation.onStart = (
    anim: any,
    value: number,
    timestamp: number,
    previousAnimation?: any
  ) => {
    anim.startValue = value;
    anim.current = value;
    anim.previousAnimation = previousAnimation ?? null;
    return baseOnStart(anim, value, timestamp, previousAnimation);
  };

  animation.onFrame = (anim: any, now: number) => {
    return baseOnFrame(anim, now);
  };
}
