import { EasingFn, MotionInterpolation, MotionValue } from './motion';

/* Map a MotionValue through an input→output numeric range.
 */
export function interpolateNumber(
  value: MotionValue,
  inputRange: [number, number],
  outputRange: [number, number],
  easing: EasingFn = (t) => t
): MotionInterpolation<number> {
  const [inMin, inMax] = inputRange;
  const [outMin, outMax] = outputRange;
  return new MotionInterpolation(value, (raw) => {
    let t = (raw - inMin) / (inMax - inMin);
    t = Math.max(0, Math.min(1, easing(t)));
    return outMin + (outMax - outMin) * t;
  });
}

/**
 * Parse a hex color string (#RGB or #RRGGBB) into [r,g,b]
 */
function parseHexColor(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  if (h.length === 3) {
    const [r, g, b] = h.split('');
    return [parseInt(r + r, 16), parseInt(g + g, 16), parseInt(b + b, 16)];
  } else if (h.length === 6) {
    return [
      parseInt(h.slice(0, 2), 16),
      parseInt(h.slice(2, 4), 16),
      parseInt(h.slice(4, 6), 16),
    ];
  }
  return [0, 0, 0];
}

/**
 * Map a MotionValue through an input range to interpolate between two hex colors.
 */
export function interpolateColor(
  value: MotionValue,
  inputRange: [number, number],
  fromColor: string,
  toColor: string
): MotionInterpolation<string> {
  const [r1, g1, b1] = parseHexColor(fromColor);
  const [r2, g2, b2] = parseHexColor(toColor);
  const [inMin, inMax] = inputRange;

  return new MotionInterpolation(value, (raw) => {
    let t = (raw - inMin) / (inMax - inMin);
    t = Math.max(0, Math.min(1, t));
    const r = Math.round(r1 + (r2 - r1) * t);
    const g = Math.round(g1 + (g2 - g1) * t);
    const b = Math.round(b1 + (b2 - b1) * t);
    return `rgb(${r}, ${g}, ${b})`;
  });
}
