// v5/transforms.ts
import { FluidValue } from './value';

const numberRE = /-?\d*\.?\d+/g;

// A minimal map of CSS named colors. Extend this as needed.
const namedColors: Record<string, string> = {
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

// Parse a CSS color string into [r,g,b,a]
// Supports hex, rgb(a), hsl(a), and named colors
function parseCssColor(color: string): [number, number, number, number] {
  let c = color.trim().toLowerCase();

  // named color
  if (namedColors[c]) {
    c = namedColors[c];
  }

  // hex
  if (c[0] === '#') {
    let hex = c.slice(1);
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    } else if (hex.length === 4) {
      hex =
        hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
    } else if (hex.length === 6) {
      // ok
    } else if (hex.length === 8) {
      // ok
    } else {
      throw new Error(`Invalid hex color: ${color}`);
    }
    const bigint = parseInt(hex, 16);
    const hasAlpha = hex.length === 8;
    const r = (bigint >> (hasAlpha ? 24 : 16)) & 0xff;
    const g = (bigint >> (hasAlpha ? 16 : 8)) & 0xff;
    const b = (bigint >> (hasAlpha ? 8 : 0)) & 0xff;
    const a = hasAlpha ? (bigint & 0xff) / 255 : 1;
    return [r, g, b, a];
  }

  // rgb() or rgba()
  if (c.startsWith('rgb')) {
    const nums = [...c.matchAll(numberRE)].map((m) => Number(m[0]));
    if (nums.length < 3 || nums.length > 4) {
      throw new Error(`Invalid rgb/rgba color: ${color}`);
    }
    const [r, g, b, a = 1] = nums;
    return [r, g, b, a];
  }

  // hsl() or hsla()
  if (c.startsWith('hsl')) {
    const parts = [...c.matchAll(numberRE)].map((m) => Number(m[0]));
    if (parts.length < 3 || parts.length > 4) {
      throw new Error(`Invalid hsl/hsla color: ${color}`);
    }
    let [h, s, l, a = 1] = parts;
    s = s / 100;
    l = l / 100;
    // convert hsl to rgb
    const c_ = (1 - Math.abs(2 * l - 1)) * s;
    const x = c_ * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c_ / 2;
    let [r1, g1, b1] = [0, 0, 0];
    if (h < 60) [r1, g1, b1] = [c_, x, 0];
    else if (h < 120) [r1, g1, b1] = [x, c_, 0];
    else if (h < 180) [r1, g1, b1] = [0, c_, x];
    else if (h < 240) [r1, g1, b1] = [0, x, c_];
    else if (h < 300) [r1, g1, b1] = [x, 0, c_];
    else [r1, g1, b1] = [c_, 0, x];
    const r = Math.round((r1 + m) * 255);
    const g = Math.round((g1 + m) * 255);
    const b = Math.round((b1 + m) * 255);
    return [r, g, b, a];
  }

  throw new Error(`Unrecognized color format: ${color}`);
}

/**
 * Interpolates a FluidValue<number> through either:
 *  • two numbers → number,
 *  • two strings with embedded numbers → string,
 *  • or two CSS colors → rgb(a) string.
 */
export function interpolate(
  input: FluidValue<number>,
  inRange: [number, number],
  outRange: [number, number] | [string, string],
  easing: (t: number) => number = (t) => t
): FluidValue<number> | FluidValue<string> {
  const [inMin, inMax] = inRange;
  const [fromOut, toOut] = outRange;

  // ———————————————————
  // Numeric → Numeric
  // ———————————————————
  if (typeof fromOut === 'number' && typeof toOut === 'number') {
    const [outMin, outMax] = [fromOut, toOut] as [number, number];
    const mapNum = (t: number) => {
      let p = (t - inMin) / (inMax - inMin);
      p = Math.max(0, Math.min(1, p));
      p = easing(p);
      return outMin + (outMax - outMin) * p;
    };
    const out = new FluidValue(mapNum(input.current));
    input.subscribe((t) => out.set(mapNum(t)));
    return out;
  }

  // both are strings
  const fromStr = String(fromOut);
  const toStr = String(toOut);

  // extract all numeric tokens
  const fromNums = [...fromStr.matchAll(numberRE)].map((m) => parseFloat(m[0]));
  const toNums = [...toStr.matchAll(numberRE)].map((m) => parseFloat(m[0]));

  // ———————————————————
  // CSS-Color → CSS-Color
  // ———————————————————
  // treat as color if there are NO numeric tokens in the literal strings
  if (fromNums.length === 0 && toNums.length === 0) {
    // parse both to RGBA arrays
    const [r1, g1, b1, a1] = parseCssColor(fromStr);
    const [r2, g2, b2, a2] = parseCssColor(toStr);

    const mapColor = (t: number) => {
      let p = (t - inMin) / (inMax - inMin);
      p = Math.max(0, Math.min(1, p));
      p = easing(p);
      const r = Math.round(r1 + (r2 - r1) * p);
      const g = Math.round(g1 + (g2 - g1) * p);
      const b = Math.round(b1 + (b2 - b1) * p);
      const a = a1 + (a2 - a1) * p;
      return a < 1
        ? `rgba(${r},${g},${b},${a.toFixed(3)})`
        : `rgb(${r},${g},${b})`;
    };

    const out = new FluidValue(mapColor(input.current));
    input.subscribe((t) => out.set(mapColor(t)));
    return out;
  }

  // ———————————————————
  // Generic string with numbers → interpolate each number
  // ———————————————————
  if (fromNums.length !== toNums.length) {
    throw new Error(
      `interpolate: string "${fromStr}" and "${toStr}" have mismatched number counts`
    );
  }

  // build a template of text + placeholders
  type Part = { text: string } | { idx: number };
  const parts: Part[] = [];
  let lastIndex = 0;
  let count = 0;
  let match: RegExpExecArray | null;
  numberRE.lastIndex = 0;
  while ((match = numberRE.exec(fromStr)) !== null) {
    const i = match.index;
    if (i > lastIndex) parts.push({ text: fromStr.slice(lastIndex, i) });
    parts.push({ idx: count++ });
    lastIndex = i + match[0].length;
  }
  if (lastIndex < fromStr.length) {
    parts.push({ text: fromStr.slice(lastIndex) });
  }

  const mapString = (t: number) => {
    let p = (t - inMin) / (inMax - inMin);
    p = Math.max(0, Math.min(1, p));
    p = easing(p);
    const curr = fromNums.map((a, i) => a + (toNums[i] - a) * p);
    return parts
      .map((part) => ('text' in part ? part.text : String(curr[part.idx])))
      .join('');
  };

  const out = new FluidValue(mapString(input.current));
  input.subscribe((t) => out.set(mapString(t)));
  return out;
}
