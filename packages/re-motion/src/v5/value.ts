// Core FluidValue primitive
export type Subscriber<T> = (v: T) => void;

export class FluidValue<T = number> {
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
    // immediately emit current value
    fn(this._current);
    return () => {
      this.subs.delete(fn);
    };
  }
}

export function fluidValue<T = number>(initial: T): FluidValue<T> {
  return new FluidValue(initial);
}
