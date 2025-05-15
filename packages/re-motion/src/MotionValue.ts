import type { AnimationController } from './drivers/AnimationController';
import { isCssColorLiteral, parseCssColor } from './colorsUtils';

type Subscriber<T> = (v: T) => void;

type ExtrapolateType = 'identity' | 'extend' | 'clamp';

interface ExtrapolateConfig {
  extrapolate?: ExtrapolateType;
  extrapolateRight?: ExtrapolateType;
  extrapolateLeft?: ExtrapolateType;
}

function interpolate(
  input: MotionValue<number>,
  inRange: number[],
  outRange: (number | string)[],
  config?: ExtrapolateConfig
): MotionValue<number | string> {
  const len = inRange.length;
  if (len < 2 || outRange.length !== len) {
    throw new Error(
      'interpolate: inRange and outRange must be arrays of the same length >= 2'
    );
  }

  const extrapolateLeft: ExtrapolateType =
    config?.extrapolateLeft ?? config?.extrapolate ?? 'extend';
  const extrapolateRight: ExtrapolateType =
    config?.extrapolateRight ?? config?.extrapolate ?? 'extend';

  const mapValue = (tRaw: number): number | string => {
    let t = tRaw;
    if (tRaw < inRange[0] && extrapolateLeft === 'clamp') {
      t = inRange[0];
    } else if (tRaw > inRange[len - 1] && extrapolateRight === 'clamp') {
      t = inRange[len - 1];
    }

    let i = 0;
    if (t <= inRange[0]) {
      i = 0;
    } else if (t >= inRange[len - 1]) {
      i = len - 2;
    } else {
      for (let j = 0; j < len - 1; j++) {
        if (t >= inRange[j] && t <= inRange[j + 1]) {
          i = j;
          break;
        }
      }
    }

    const t0 = inRange[i];
    const t1 = inRange[i + 1];
    let p = (t - t0) / (t1 - t0);

    const fromOut = outRange[i];
    const toOut = outRange[i + 1];

    if (typeof fromOut === 'number' && typeof toOut === 'number') {
      return fromOut + (toOut - fromOut) * p;
    }

    return interpolateString(String(fromOut), String(toOut), p);
  };

  const out = new MotionValue(mapValue(input.current));
  input.subscribe((t) => out.set(mapValue(t)));
  return out;
}

function interpolateString(fromStr: string, toStr: string, p: number): string {
  const funcRegex = /^([a-zA-Z$_][\w$]*)\((-?\d*\.?\d+)([a-zA-Z%]*)\)$/;
  const m1 = fromStr.match(funcRegex);
  const m2 = toStr.match(funcRegex);
  if (m1 && m2 && m1[1] === m2[1] && m1[3] === m2[3]) {
    const name = m1[1];
    const fromN = parseFloat(m1[2]);
    const toN = parseFloat(m2[2]);
    const unit = m1[3];
    const val = fromN + (toN - fromN) * p;
    return `${name}(${val.toFixed(3)}${unit})`;
  }

  if (isCssColorLiteral(fromStr) && isCssColorLiteral(toStr)) {
    const c1 = parseCssColor(fromStr);
    const c2 = parseCssColor(toStr);
    const [r1, g1, b1, a1] = c1;
    const [r2, g2, b2, a2] = c2;
    const R = Math.round(r1 + (r2 - r1) * p);
    const G = Math.round(g1 + (g2 - g1) * p);
    const B = Math.round(b1 + (b2 - b1) * p);
    const A = a1 + (a2 - a1) * p;
    return A < 1
      ? `rgba(${R},${G},${B},${A.toFixed(3)})`
      : `rgb(${R},${G},${B})`;
  }

  const fromParts = fromStr.split(/(\s+)/);
  const toParts = toStr.split(/(\s+)/);
  if (fromParts.length !== toParts.length) {
    throw new Error(
      `interpolate: template mismatch:\n  "${fromStr}"\n  vs "${toStr}"`
    );
  }
  const numUnitRE = /^(-?\d+(\.\d+)?)([a-zA-Z%]*)$/;
  const mappers = fromParts.map((fp, i) => {
    const tp = toParts[i];

    if (fp === tp && /\s+/.test(fp)) return () => fp;

    const n1 = fp.match(numUnitRE);
    const n2 = tp.match(numUnitRE);

    if (n1 && n2 && n1[3] === n2[3]) {
      const fromN = parseFloat(n1[1]);
      const toN = parseFloat(n2[1]);
      const unit = n1[3];

      return () => {
        const val = fromN + (toN - fromN) * p;
        return `${val.toFixed(3)}${unit}`;
      };
    }

    if (isCssColorLiteral(fp) && isCssColorLiteral(tp)) {
      return () => interpolateString(fp, tp, p);
    }

    if (fp === tp) return () => fp;

    throw new Error(
      `interpolate: cannot interpolate tokens "${fp}" vs "${tp}"`
    );
  });
  return mappers.map((fn) => fn()).join('');
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

export class MotionValue<T = number> {
  private subs = new Set<Subscriber<T>>();
  private _current: T;
  private initial: T;
  private currentController?: AnimationController;

  constructor(initial: T) {
    this._current = initial;
    this.initial = initial;
  }

  get current(): T {
    return this._current;
  }

  set(v: T): void {
    this.currentController?.cancel();
    this.currentController = undefined;
    this._internalSet(v);
  }

  /**
   * @internal only use internally
   */
  _internalSet(v: T): void {
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

  reset() {
    this.set(this.initial);
  }

  destroy() {
    this.subs.clear();
    this.currentController?.cancel();
    this.currentController = undefined;
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
      const out = new MotionValue(mapFn(this._current));
      this.subscribe((v) => out.set(mapFn(v)));
      return out;
    }

    const inRange = arg1 as number[];
    const outRange = arg2 as (number | string)[];
    const config = arg3 as ExtrapolateConfig | undefined;
    return interpolate(this as MotionValue<number>, inRange, outRange, config);
  }

  setAnimationController(ctrl: AnimationController) {
    this.currentController?.cancel();
    this.currentController = ctrl;
  }
}
