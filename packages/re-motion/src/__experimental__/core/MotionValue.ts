// MotionValue.ts

import { valueSetter } from './valueSetter';
import type { AnimationObject } from './types';

export class MotionValue<T> {
  /** internal value */ _value: T;
  /** active animation */ _animation: AnimationObject<T> | null = null;
  /** subscribers (e.g. render hooks) */
  private subs = new Set<(v: T) => void>();

  constructor(initial: T) {
    this._value = initial;
  }

  /** read current */
  get value(): T {
    return this._value;
  }

  /** write new value or animation */
  set value(v: T | AnimationObject<T> | (() => AnimationObject<T>)) {
    valueSetter(this, v);
  }

  /** subscribe to value changes */
  onChange(fn: (value: T) => void) {
    this.subs.add(fn);
    return () => this.subs.delete(fn);
  }

  /** internal: notify all subscribers */
  _notifySubscribers() {
    this.subs.forEach((fn) => fn(this._value));
  }
}

/** helper */
export function createMotionValue<T>(initial: T): MotionValue<T> {
  return new MotionValue(initial);
}
