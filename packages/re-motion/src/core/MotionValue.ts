import { assignAnimator } from './animator';
import type { Animator } from './types';
import { type ExtrapolateConfig, to } from '../to/to';

export class MotionValue<T> {
  current: T;
  listeners = new Set<(value: T) => void>();
  activeAnimator: Animator<T> | null = null;

  constructor(initial: T) {
    this.current = initial;
  }

  get(): T {
    return this.current;
  }

  set(newValue: T | Animator<T> | (() => Animator<T>)) {
    assignAnimator(this, newValue);
  }

  onChange(callback: (value: T) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notifyListeners() {
    this.listeners.forEach((fn) => fn(this.current));
  }

  to<U>(mapperFn: (v: T) => U): MotionValue<U>;
  to(
    inRange: number[],
    outRange: (number | string)[],
    config?: ExtrapolateConfig
  ): MotionValue<number | string>;
  to(arg1: any, arg2?: any, arg3?: any): MotionValue<any> {
    if (typeof arg1 === 'function') {
      const mapFn = arg1 as (v: T) => any;
      const out = new MotionValue(mapFn(this.get()));
      this.onChange((v) => out.set(v));
      return out;
    }

    const inRange = arg1 as number[];
    const outRange = arg2 as (number | string)[];
    const config = arg3 as ExtrapolateConfig | undefined;

    const mapValue = to(inRange, outRange, config);
    const out = new MotionValue(mapValue(this.current as number));
    this.onChange((t) => out.set(mapValue(t as number)));

    return out;
  }
}

export function createMotionValue<T>(initial: T): MotionValue<T> {
  return new MotionValue(initial);
}

export function cancelMotionValue<T>(mv: MotionValue<T>) {
  mv.set(mv.get());
}
