import { EasingFn, MotionInterpolation, MotionNode } from './motion';

//////////////////////
// Numeric interpolation
//////////////////////

function interpolateNumber(
  value: number,
  inR: number[],
  outR: number[],
  easing: EasingFn
) {
  // clamp
  const v = Math.min(Math.max(value, inR[0]), inR[inR.length - 1]);
  // find segment
  let i = inR.findIndex((_, idx) => idx < inR.length - 1 && v <= inR[idx + 1]);
  if (i === -1) i = inR.length - 2;
  const [inMin, inMax] = [inR[i], inR[i + 1]];
  const [outMin, outMax] = [outR[i], outR[i + 1]];
  const t = inMax === inMin ? 0 : (v - inMin) / (inMax - inMin);
  return outMin + (outMax - outMin) * easing(t);
}

//////////////////////
// Color interpolation helpers
//////////////////////

const HEX3 = /^#([0-9a-f]{3})$/i;
const HEX6 = /^#([0-9a-f]{6})$/i;
const RGB = /^rgba?\(\s*(\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\s*\)$/i;
// const NAMED  = /^[a-z]+$/i;

// minimal map for named CSS colors; you can expand this as needed
const namedColorMap: Record<string, string> = {
  black: '#000000',
  white: '#ffffff',
  red: '#ff0000',
  fuchsia: '#ff00ff',
  // …add more if you need…
};

function toRgb(c: string): [number, number, number] {
  if (HEX3.test(c) || HEX6.test(c)) {
    let h = c.slice(1);
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    const num = parseInt(h, 16);
    return [(num >> 16) & 0xff, (num >> 8) & 0xff, num & 0xff];
  }
  const m = c.match(RGB);
  if (m) {
    return [parseInt(m[1]), parseInt(m[2]), parseInt(m[3])];
  }
  const hex = namedColorMap[c.toLowerCase()];
  if (hex) return toRgb(hex);
  throw new Error(`Unknown color "${c}"`);
}

function toHex([r, g, b]: [number, number, number]) {
  const h = (n: number) => n.toString(16).padStart(2, '0');
  return `#${h(r)}${h(g)}${h(b)}`;
}

//////////////////////
// Main interpolate
//////////////////////

export function interpolate<T extends number | string>(
  node: MotionNode<number>,
  inputRange: number[],
  outputRange: T[],
  easing: EasingFn = (t) => t
): MotionInterpolation<T> {
  // — number → number
  if (typeof outputRange[0] === 'number') {
    const nums = outputRange as number[];
    return new MotionInterpolation<T>(
      node,
      (v) => interpolateNumber(v, inputRange, nums, easing) as any
    );
  }

  // — string → string
  const strs = outputRange as string[];

  // 1) Extract color tokens + build placeholder templates
  type Extract = { template: string; colors: string[] };
  const extracted: Extract[] = strs.map((s) => {
    const colors: string[] = [];
    let tpl = s;

    // a) hex or rgb
    tpl = tpl.replace(
      /#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b|rgba?\([^)]+\)/g,
      (match) => {
        colors.push(match);
        return `__COLOR${colors.length - 1}__`;
      }
    );

    // b) if no color yet, try trailing named color
    if (!colors.length) {
      const m = tpl.match(/\b([a-z]+)\s*$/i);
      if (m && namedColorMap[m[1].toLowerCase()]) {
        colors.push(m[1]);
        tpl = tpl.replace(m[1], `__COLOR0__`);
      }
    }

    return { template: tpl, colors };
  });

  // ensure same number of color tokens at each stop
  const colorCount = extracted[0].colors.length;
  if (!extracted.every((e) => e.colors.length === colorCount)) {
    throw new Error('All strings must have the same number of color tokens');
  }

  // 2) Parse numeric template on the FIRST placeholder string
  const { parts, nums: _baseNums } = (() => {
    const regex = /-?\d+\.?\d*/g;
    const parts: string[] = [];
    const nums: number[] = [];
    let last = 0,
      m: RegExpExecArray | null;
    const s = extracted[0].template;
    while ((m = regex.exec(s))) {
      parts.push(s.slice(last, m.index));
      nums.push(parseFloat(m[0]));
      last = m.index + m[0].length;
    }
    parts.push(s.slice(last));
    return { parts, nums };
  })();

  // extract numeric stops for each segment
  const numericStops = extracted.map((e) => {
    const matches = Array.from(e.template.matchAll(/-?\d+\.?\d*/g));
    return matches.map((m) => parseFloat(m[0]));
  });

  // 3) Build the MotionInterpolation
  return new MotionInterpolation<T>(node, (v) => {
    // --- numeric interpolation ---
    const vClamped = Math.min(
      Math.max(v, inputRange[0]),
      inputRange[inputRange.length - 1]
    );
    let seg = inputRange.findIndex(
      (_, i) => i < inputRange.length - 1 && vClamped <= inputRange[i + 1]
    );
    if (seg === -1) seg = inputRange.length - 2;

    const inMin = inputRange[seg],
      inMax = inputRange[seg + 1];
    const t = inMax === inMin ? 0 : (vClamped - inMin) / (inMax - inMin);
    const te = easing(t);

    // interpolate each numeric token
    const fromNums = numericStops[seg];
    const toNums = numericStops[seg + 1];
    const currNums = fromNums.map((f, i) => f + (toNums[i] - f) * te);

    // rebuild the "number+static" string
    let out = '';
    for (let i = 0; i < currNums.length; i++) {
      out += parts[i] + currNums[i];
    }
    out += parts[parts.length - 1];

    // --- color interpolation & placeholder replacement ---
    for (let c = 0; c < colorCount; c++) {
      // get start/end color for this segment
      const startCol = toRgb(extracted[seg].colors[c]);
      const endCol = toRgb(extracted[seg + 1].colors[c]);
      const [r1, g1, b1] = startCol,
        [r2, g2, b2] = endCol;
      // channel-wise lerp
      const rc = Math.round(r1 + (r2 - r1) * te);
      const gc = Math.round(g1 + (g2 - g1) * te);
      const bc = Math.round(b1 + (b2 - b1) * te);
      const hex = toHex([rc, gc, bc]);

      // replace all instances of the placeholder
      out = out.replace(new RegExp(`__COLOR${c}__`, 'g'), hex);
    }

    return out as any;
  });
}
