import { assignAnimator } from './assignAnimator';
import type { Animator } from './types';

export class MotionValue<T> {
  current: T;
  listeners = new Set<(value: T) => void>();
  activeAnimator: Animator<T> | null = null;

  constructor(initial: T) {
    this.current = initial;
  }

  get value(): T {
    return this.current;
  }

  set value(newValue: T | Animator<T> | (() => Animator<T>)) {
    assignAnimator(this, newValue);
  }

  onChange(callback: (value: T) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notifyListeners() {
    this.listeners.forEach((fn) => fn(this.current));
  }
}

/** helper */
export function createMotionValue<T>(initial: T): MotionValue<T> {
  return new MotionValue(initial);
}
