// defineAnimation.ts
// ------------------

import { decorateAnimation } from './decorateAnimation';

/**
 * Core helper to turn a factory into a reusable animation definition.
 * @param starting  – the “toValue” or initial payload
 * @param factory   – a worklet that returns an { onStart, onFrame, … } animation object
 */
export function defineAnimation<T>(factory: () => T): T {
  const build = () => {
    const anim = factory();
    decorateAnimation(anim as any);
    return anim;
  };

  return build();
}
