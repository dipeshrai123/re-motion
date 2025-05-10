import { MotionValue } from './value';

export const namedColors: Record<string, string> = {
  transparent: '#00000000',
  aliceblue: '#f0f8ffff',
  antiquewhite: '#faebd7ff',
  aqua: '#00ffffff',
  aquamarine: '#7fffd4ff',
  azure: '#f0ffffff',
  beige: '#f5f5dcff',
  bisque: '#ffe4c4ff',
  black: '#000000ff',
  blanchedalmond: '#ffebcdff',
  blue: '#0000ffff',
  blueviolet: '#8a2be2ff',
  brown: '#a52a2aff',
  burlywood: '#deb887ff',
  burntsienna: '#ea7e5dff',
  cadetblue: '#5f9ea0ff',
  chartreuse: '#7fff00ff',
  chocolate: '#d2691eff',
  coral: '#ff7f50ff',
  cornflowerblue: '#6495edff',
  cornsilk: '#fff8dcff',
  crimson: '#dc143cff',
  cyan: '#00ffffff',
  darkblue: '#00008bff',
  darkcyan: '#008b8bff',
  darkgoldenrod: '#b8860bff',
  darkgray: '#a9a9a9ff',
  darkgreen: '#006400ff',
  darkgrey: '#a9a9a9ff',
  darkkhaki: '#bdb76bff',
  darkmagenta: '#8b008bff',
  darkolivegreen: '#556b2fff',
  darkorange: '#ff8c00ff',
  darkorchid: '#9932ccff',
  darkred: '#8b0000ff',
  darksalmon: '#e9967aff',
  darkseagreen: '#8fbc8fff',
  darkslateblue: '#483d8bff',
  darkslategray: '#2f4f4fff',
  darkslategrey: '#2f4f4fff',
  darkturquoise: '#00ced1ff',
  darkviolet: '#9400d3ff',
  deeppink: '#ff1493ff',
  deepskyblue: '#00bfffff',
  dimgray: '#696969ff',
  dimgrey: '#696969ff',
  dodgerblue: '#1e90ffff',
  firebrick: '#b22222ff',
  floralwhite: '#fffaf0ff',
  forestgreen: '#228b22ff',
  fuchsia: '#ff00ffff',
  gainsboro: '#dcdcdcff',
  ghostwhite: '#f8f8ffff',
  gold: '#ffd700ff',
  goldenrod: '#daa520ff',
  gray: '#808080ff',
  green: '#008000ff',
  greenyellow: '#adff2fff',
  grey: '#808080ff',
  honeydew: '#f0fff0ff',
  hotpink: '#ff69b4ff',
  indianred: '#cd5c5cff',
  indigo: '#4b0082ff',
  ivory: '#fffff0ff',
  khaki: '#f0e68cff',
  lavender: '#e6e6faff',
  lavenderblush: '#fff0f5ff',
  lawngreen: '#7cfc00ff',
  lemonchiffon: '#fffacdff',
  lightblue: '#add8e6ff',
  lightcoral: '#f08080ff',
  lightcyan: '#e0ffffff',
  lightgoldenrodyellow: '#fafad2ff',
  lightgray: '#d3d3d3ff',
  lightgreen: '#90ee90ff',
  lightgrey: '#d3d3d3ff',
  lightpink: '#ffb6c1ff',
  lightsalmon: '#ffa07aff',
  lightseagreen: '#20b2aaff',
  lightskyblue: '#87cefaff',
  lightslategray: '#778899ff',
  lightslategrey: '#778899ff',
  lightsteelblue: '#b0c4deff',
  lightyellow: '#ffffe0ff',
  lime: '#00ff00ff',
  limegreen: '#32cd32ff',
  linen: '#faf0e6ff',
  magenta: '#ff00ffff',
  maroon: '#800000ff',
  mediumaquamarine: '#66cdaaff',
  mediumblue: '#0000cdff',
  mediumorchid: '#ba55d3ff',
  mediumpurple: '#9370dbff',
  mediumseagreen: '#3cb371ff',
  mediumslateblue: '#7b68eeff',
  mediumspringgreen: '#00fa9aff',
  mediumturquoise: '#48d1ccff',
  mediumvioletred: '#c71585ff',
  midnightblue: '#191970ff',
  mintcream: '#f5fffaff',
  mistyrose: '#ffe4e1ff',
  moccasin: '#ffe4b5ff',
  navajowhite: '#ffdeadff',
  navy: '#000080ff',
  oldlace: '#fdf5e6ff',
  olive: '#808000ff',
  olivedrab: '#6b8e23ff',
  orange: '#ffa500ff',
  orangered: '#ff4500ff',
  orchid: '#da70d6ff',
  palegoldenrod: '#eee8aaff',
  palegreen: '#98fb98ff',
  paleturquoise: '#afeeeeff',
  palevioletred: '#db7093ff',
  papayawhip: '#ffefd5ff',
  peachpuff: '#ffdab9ff',
  peru: '#cd853fff',
  pink: '#ffc0cbff',
  plum: '#dda0ddff',
  powderblue: '#b0e0e6ff',
  purple: '#800080ff',
  rebeccapurple: '#663399ff',
  red: '#ff0000ff',
  rosybrown: '#bc8f8fff',
  royalblue: '#4169e1ff',
  saddlebrown: '#8b4513ff',
  salmon: '#fa8072ff',
  sandybrown: '#f4a460ff',
  seagreen: '#2e8b57ff',
  seashell: '#fff5eeff',
  sienna: '#a0522dff',
  silver: '#c0c0c0ff',
  skyblue: '#87ceebff',
  slateblue: '#6a5acdff',
  slategray: '#708090ff',
  slategrey: '#708090ff',
  snow: '#fffafaff',
  springgreen: '#00ff7fff',
  steelblue: '#4682b4ff',
  tan: '#d2b48cff',
  teal: '#008080ff',
  thistle: '#d8bfd8ff',
  tomato: '#ff6347ff',
  turquoise: '#40e0d0ff',
  violet: '#ee82eeff',
  wheat: '#f5deb3ff',
  white: '#ffffffff',
  whitesmoke: '#f5f5f5ff',
  yellow: '#ffff00ff',
  yellowgreen: '#9acd32ff',
};

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
