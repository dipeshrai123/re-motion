// valueSetter.ts

import type { AnimationObject } from './types';
import { MotionValue } from './MotionValue';

/**
 * Sets a new value or animation on a MotionValue.
 * If you pass it an AnimationObject (or a factory returning one),
 * it will start/cancel/step that animation internally via rAF.
 */
export function valueSetter<T>(
  mv: MotionValue<T>,
  value: T | AnimationObject<T> | (() => AnimationObject<T>),
  forceUpdate = false
): void {
  // cancel any previous animation
  const previous = mv._animation;
  if (previous) {
    previous.cancelled = true;
    mv._animation = null;
  }

  // is this an animation?
  const isAnimFactory = typeof value === 'function';
  const anim: AnimationObject<T> | null = isAnimFactory
    ? (value as () => AnimationObject<T>)()
    : typeof value === 'object' && 'onFrame' in value!
    ? (value as AnimationObject<T>)
    : null;

  if (anim) {
    // guard against animating to same current value
    if (!forceUpdate && mv._value === anim.current && !anim.isHigherOrder) {
      anim.callback?.(true);
      return;
    }

    // initialize
    const now = performance.now();
    anim.onStart(anim, mv.value, now, previous);

    // step function
    const step = (ts: number) => {
      // if cancelled, bail
      if (anim.cancelled) {
        anim.callback?.(false);
        return;
      }

      // call onFrame → returns true when finished
      const finished = anim.onFrame(anim, ts);
      mv._value = anim.current!;
      mv._notifySubscribers();

      if (finished) {
        anim.callback?.(true);
      } else {
        mv._animation = anim;
        requestAnimationFrame(step);
      }
    };

    mv._animation = anim;
    // kick things off
    requestAnimationFrame(step);
  } else {
    // plain value
    if (!forceUpdate && mv._value === (value as T)) return;
    mv._value = value as T;
    mv._notifySubscribers();
  }
}
