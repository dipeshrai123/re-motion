import type { AnimationController } from './drivers/AnimationController';
import { isCssColorLiteral, parseCssColor } from './colorsUtils';

type Subscriber<T> = (v: T) => void;

export class MotionValue<T = number> {
  private subs = new Set<Subscriber<T>>();
  private _current: T;
  private currentController?: AnimationController;

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

  destroy() {
    this.subs.clear();
    this.currentController?.cancel();
    this.currentController = undefined;
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

  setAnimationController(ctrl: AnimationController) {
    this.currentController?.cancel();
    this.currentController = ctrl;
  }
}

function interpolate(
  input: MotionValue<number>,
  inRange: [number, number],
  outRange: [number, number],
  easing?: (t: number) => number
): MotionValue<number>;

function interpolate(
  input: MotionValue<number>,
  inRange: [number, number],
  outRange: [string, string],
  easing?: (t: number) => number
): MotionValue<string>;

function interpolate(
  input: MotionValue<number>,
  inRange: [number, number],
  outRange: [number | string, number | string],
  easing: (t: number) => number = (t) => t
): MotionValue<number | string> {
  const [inMin, inMax] = inRange;
  const [fromOut, toOut] = outRange;

  if (typeof fromOut === 'number' && typeof toOut === 'number') {
    const mapNum = (t: number) => {
      let p = (t - inMin) / (inMax - inMin);
      p = easing(p);
      return fromOut + (toOut - fromOut) * p;
    };

    const out = new MotionValue<number>(mapNum(input.current));
    input.subscribe((t) => out.set(mapNum(t)));
    return out;
  }

  const fromStr = String(fromOut);
  const toStr = String(toOut);

  if (isCssColorLiteral(fromStr) && isCssColorLiteral(toStr)) {
    const c1 = parseCssColor(fromStr);
    const c2 = parseCssColor(toStr);
    const mapColor = (t: number) => {
      let p = (t - inMin) / (inMax - inMin);
      p = easing(p);
      const [r1, g1, b1, a1] = c1;
      const [r2, g2, b2, a2] = c2;
      const R = Math.round(r1 + (r2 - r1) * p);
      const G = Math.round(g1 + (g2 - g1) * p);
      const B = Math.round(b1 + (b2 - b1) * p);
      const A = a1 + (a2 - a1) * p;
      return A < 1
        ? `rgba(${R},${G},${B},${A.toFixed(3)})`
        : `rgb(${R},${G},${B})`;
    };

    const out = new MotionValue<string>(mapColor(input.current));
    input.subscribe((t) => out.set(mapColor(t)));

    return out;
  }

  const fromParts = fromStr.split(/(\s+)/);
  const toParts = toStr.split(/(\s+)/);

  if (fromParts.length !== toParts.length) {
    throw new Error(
      `interpolate: template mismatch:\n  "${fromStr}"\n  vs "${toStr}"`
    );
  }

  type PartMapper = (t: number) => string;
  const numUnitRE = /^(-?\d+(\.\d+)?)([a-zA-Z%]*)$/;

  const mappers: PartMapper[] = fromParts.map((fp, i) => {
    const tp = toParts[i];

    if (fp === tp && /\s+/.test(fp)) return () => fp;

    const m1 = fp.match(numUnitRE);
    const m2 = tp.match(numUnitRE);

    if (m1 && m2 && m1[3] === m2[3]) {
      const fromN = parseFloat(m1[1]);
      const toN = parseFloat(m2[1]);
      const unit = m1[3];
      return (t: number) => {
        let p = (t - inMin) / (inMax - inMin);
        p = easing(p);
        const val = fromN + (toN - fromN) * p;
        return `${val.toFixed(3)}${unit}`;
      };
    }

    if (isCssColorLiteral(fp) && isCssColorLiteral(tp)) {
      const c1 = parseCssColor(fp);
      const c2 = parseCssColor(tp);
      return (t: number) => {
        let p = (t - inMin) / (inMax - inMin);
        p = easing(p);
        const [r1, g1, b1, a1] = c1;
        const [r2, g2, b2, a2] = c2;
        const R = Math.round(r1 + (r2 - r1) * p);
        const G = Math.round(g1 + (g2 - g1) * p);
        const B = Math.round(b1 + (b2 - b1) * p);
        const A = a1 + (a2 - a1) * p;
        return A < 1
          ? `rgba(${R},${G},${B},${A.toFixed(3)})`
          : `rgb(${R},${G},${B})`;
      };
    }

    if (fp === tp) return () => fp;

    throw new Error(
      `interpolate: cannot interpolate tokens "${fp}" vs "${tp}"`
    );
  });

  const mapper = (t: number) => mappers.map((fn) => fn(t)).join('');
  const out = new MotionValue<string>(mapper(input.current));
  input.subscribe((t) => out.set(mapper(t)));
  return out;
}

export function combine<T extends any[], U>(
  inputs: { [K in keyof T]: MotionValue<T[K]> },
  combiner: (...values: T) => U
): MotionValue<U> {
  const initial = inputs.map((fv) => fv.current) as T;
  const out = new MotionValue<U>(combiner(...initial));

  const update = () => {
    const vals = inputs.map((fv) => fv.current) as T;
    out.set(combiner(...vals));
  };

  inputs.map((fv) => fv.subscribe(() => update()));

  return out;
}
