import { interpolate } from './transforms';

type Subscriber<T> = (v: T) => void;

export class MotionValue<T = number> {
  private subs = new Set<Subscriber<T>>();
  private _current: T;

  constructor(initial: T) {
    this._current = initial;
  }

  get current(): T {
    return this._current;
  }

  set(v: T): void {
    if (v === this._current) return;
    this._current = v;
    for (const sub of this.subs) sub(v);
  }

  subscribe(fn: Subscriber<T>): () => void {
    this.subs.add(fn);
    fn(this._current);
    return () => {
      this.subs.delete(fn);
    };
  }

  to(
    inRange: [number, number],
    outRange: [number, number],
    easing?: (t: number) => number
  ): MotionValue<number>;

  to(
    inRange: [number, number],
    outRange: [string, string],
    easing?: (t: number) => number
  ): MotionValue<string>;
  to<U>(mapperFn: (v: T) => U): MotionValue<U>;

  to(arg1: any, arg2?: any, arg3?: any): MotionValue<any> {
    if (typeof arg1 === 'function') {
      const mapFn = arg1 as (v: T) => any;
      const out = new MotionValue(mapFn(this._current));
      this.subscribe((v) => out.set(mapFn(v)));
      return out;
    }

    const inRange = arg1 as [number, number];
    const outRange = arg2;
    const easing = arg3 as ((t: number) => number) | undefined;
    return interpolate(this as any, inRange, outRange, easing);
  }
}
