import { EasingFn, MotionInterpolation, MotionNode } from './motion';

//////////////////////
//— Numeric helpers
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
  const te = easing(t);
  return outMin + (outMax - outMin) * te;
}

//////////////////////
//— String template
//////////////////////

type Template = { parts: string[]; nums: number[] };

const NUMBER_REGEX = /-?\d+\.?\d*/g;

function parseTemplate(str: string): Template {
  const parts: string[] = [];
  const nums: number[] = [];
  let last = 0,
    m: RegExpExecArray | null;
  while ((m = NUMBER_REGEX.exec(str))) {
    parts.push(str.slice(last, m.index));
    nums.push(parseFloat(m[0]));
    last = m.index + m[0].length;
  }
  parts.push(str.slice(last));
  return { parts, nums };
}

function buildString(t: Template, nums: number[]) {
  let out = '';
  for (let i = 0; i < nums.length; i++) {
    out += t.parts[i] + nums[i];
  }
  return out + t.parts[t.parts.length - 1];
}

//////////////////////
//— Hex-color helpers
//////////////////////

const HEX3 = /^#([0-9a-f]{3})$/i;
const HEX6 = /^#([0-9a-f]{6})$/i;

function isHexColor(s: string) {
  return HEX3.test(s) || HEX6.test(s);
}

function hexToRgb(hex: string): [number, number, number] {
  let h = hex.slice(1);
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  const num = parseInt(h, 16);
  return [(num >> 16) & 0xff, (num >> 8) & 0xff, num & 0xff];
}

function rgbToHex(r: number, g: number, b: number) {
  const to2 = (n: number) => n.toString(16).padStart(2, '0');
  return `#${to2(r)}${to2(g)}${to2(b)}`;
}

//////////////////////
//— Generic interpolate
//////////////////////

export function interpolate<T extends number | string>(
  node: MotionNode<number>,
  inputRange: number[],
  outputRange: T[],
  easing: EasingFn = (t) => t
): MotionInterpolation<T> {
  // — Number path
  if (typeof outputRange[0] === 'number') {
    const nums = outputRange as unknown as number[];
    return new MotionInterpolation<T>(
      node,
      (v) => interpolateNumber(v, inputRange, nums, easing) as any
    );
  }

  // — String path
  const strs = outputRange as string[];

  // 1) Hex-color special case
  if (strs.every(isHexColor)) {
    const channels = strs.map(hexToRgb); // [[r,g,b], …]
    return new MotionInterpolation<T>(node, (v) => {
      const tval = interpolateNumber(v, inputRange, [0, 1], easing);
      // find segment
      let i = inputRange.findIndex(
        (_, idx) => idx < inputRange.length - 1 && v <= inputRange[idx + 1]
      );
      if (i === -1) i = inputRange.length - 2;
      const [r1, g1, b1] = channels[i],
        [r2, g2, b2] = channels[i + 1];
      const r = Math.round(r1 + (r2 - r1) * tval);
      const g = Math.round(g1 + (g2 - g1) * tval);
      const b = Math.round(b1 + (b2 - b1) * tval);
      return rgbToHex(r, g, b) as any;
    });
  }

  // 2) Arbitrary strings with decimal numbers
  const templates = strs.map(parseTemplate);
  const base = templates[0];
  // verify all have same token structure
  for (let tpl of templates) {
    if (
      tpl.nums.length !== base.nums.length ||
      tpl.parts.length !== base.parts.length
    ) {
      throw new Error(
        'All output strings must have identical numeric token structure'
      );
    }
  }

  return new MotionInterpolation<T>(node, (v) => {
    // clamp + segment find
    const clamped = Math.min(
      Math.max(v, inputRange[0]),
      inputRange[inputRange.length - 1]
    );
    let i = inputRange.findIndex(
      (_, idx) => idx < inputRange.length - 1 && clamped <= inputRange[idx + 1]
    );
    if (i === -1) i = inputRange.length - 2;
    const [inMin, inMax] = [inputRange[i], inputRange[i + 1]];
    const t = inMax === inMin ? 0 : (clamped - inMin) / (inMax - inMin);
    const te = easing(t);

    const fromNums = templates[i].nums;
    const toNums = templates[i + 1].nums;
    const curr = fromNums.map((f, idx) => f + (toNums[idx] - f) * te);
    return buildString(base, curr) as any;
  });
}
