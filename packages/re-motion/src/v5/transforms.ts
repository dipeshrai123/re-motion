import { namedColors } from './colors';
import { MotionValue } from './value';

const numberRE = /-?\d+(\.\d+)?/g;
const HEX_RE = /^#(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
const RGB_RE =
  /^rgba?\(\s*-?\d+(\.\d+)?%?(?:\s*,\s*-?\d+(\.\d+)?%?){2}(?:\s*,\s*(0|1|0?\.\d+))?\s*\)$/i;
const HSL_RE =
  /^hsla?\(\s*\d+(\.\d+)?(?:\s*,\s*\d+(\.\d+)?%){2}(?:\s*,\s*(0|1|0?\.\d+))?\s*\)$/i;

function isCssColorLiteral(s: string): boolean {
  const c = s.trim().toLowerCase();
  return (
    HEX_RE.test(c) ||
    RGB_RE.test(c) ||
    HSL_RE.test(c) ||
    namedColors[c] !== undefined
  );
}
function parseCssColor(c: string): [number, number, number, number] {
  let color = c.trim().toLowerCase();
  if (namedColors[color]) color = namedColors[color];

  if (HEX_RE.test(color)) {
    let hex = color.slice(1);
    if (hex.length === 3)
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    else if (hex.length === 4)
      hex =
        hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
    const hasA = hex.length === 8;
    const v = parseInt(hex, 16);
    const r = (v >> (hasA ? 24 : 16)) & 0xff;
    const g = (v >> (hasA ? 16 : 8)) & 0xff;
    const b = (v >> (hasA ? 8 : 0)) & 0xff;
    const a = hasA ? (v & 0xff) / 255 : 1;
    return [r, g, b, a];
  }
  if (RGB_RE.test(color)) {
    const nums = [...color.matchAll(numberRE)].map((m) => +m[0]);
    const [r, g, b, a = 1] = nums;
    return [r, g, b, a];
  }
  if (HSL_RE.test(color)) {
    const nums = [...color.matchAll(numberRE)].map((m) => +m[0]);
    let [h, s, l, a = 1] = nums;
    s /= 100;
    l /= 100;
    const c_ = (1 - Math.abs(2 * l - 1)) * s;
    const x = c_ * (1 - Math.abs(((h / 60) % 2) - 1));
    const m_ = l - c_ / 2;
    let [r1, g1, b1] = [0, 0, 0];
    if (h < 60) [r1, g1, b1] = [c_, x, 0];
    else if (h < 120) [r1, g1, b1] = [x, c_, 0];
    else if (h < 180) [r1, g1, b1] = [0, c_, x];
    else if (h < 240) [r1, g1, b1] = [0, x, c_];
    else if (h < 300) [r1, g1, b1] = [x, 0, c_];
    else [r1, g1, b1] = [c_, 0, x];
    return [
      Math.round((r1 + m_) * 255),
      Math.round((g1 + m_) * 255),
      Math.round((b1 + m_) * 255),
      a,
    ];
  }
  throw new Error(`Unrecognized CSS color: ${c}`);
}

export function interpolate(
  input: MotionValue<number>,
  inRange: [number, number],
  outRange: [number, number],
  easing?: (t: number) => number
): MotionValue<number>;

export function interpolate(
  input: MotionValue<number>,
  inRange: [number, number],
  outRange: [string, string],
  easing?: (t: number) => number
): MotionValue<string>;

export function interpolate(
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
      p = Math.max(0, Math.min(1, p));
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
      p = Math.max(0, Math.min(1, p));
      p = easing(p);
      const [r1, g1, b1, a1] = c1,
        [r2, g2, b2, a2] = c2;
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
  const mappers: PartMapper[] = fromParts.map((fp, i) => {
    const tp = toParts[i];
    if (fp === tp && /\s+/.test(fp)) {
      return () => fp;
    }
    const numUnitRE = /^(-?\d+(\.\d+)?)([a-zA-Z%]*)$/;
    const m1 = fp.match(numUnitRE);
    const m2 = tp.match(numUnitRE);
    if (m1 && m2 && m1[3] === m2[3]) {
      const fromN = parseFloat(m1[1]),
        toN = parseFloat(m2[1]),
        unit = m1[3];
      return (t: number) => {
        let p = (t - inMin) / (inMax - inMin);
        p = Math.max(0, Math.min(1, p));
        p = easing(p);
        const val = fromN + (toN - fromN) * p;
        return `${val.toFixed(3)}${unit}`;
      };
    }
    if (isCssColorLiteral(fp) && isCssColorLiteral(tp)) {
      const c1 = parseCssColor(fp),
        c2 = parseCssColor(tp);
      return (t: number) => {
        let p = (t - inMin) / (inMax - inMin);
        p = Math.max(0, Math.min(1, p));
        p = easing(p);
        const [r1, g1, b1, a1] = c1,
          [r2, g2, b2, a2] = c2;
        const R = Math.round(r1 + (r2 - r1) * p);
        const G = Math.round(g1 + (g2 - g1) * p);
        const B = Math.round(b1 + (b2 - b1) * p);
        const A = a1 + (a2 - a1) * p;
        return A < 1
          ? `rgba(${R},${G},${B},${A.toFixed(3)})`
          : `rgb(${R},${G},${B})`;
      };
    }

    if (fp === tp) {
      return () => fp;
    }

    throw new Error(
      `interpolate: cannot interpolate tokens "${fp}" vs "${tp}"`
    );
  });

  const mapper = (t: number) => {
    return mappers.map((fn) => fn(t)).join('');
  };

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
