import { MotionValue } from './value';

const TRANSFORM_KEYS = new Set([
  'translateX',
  'translateY',
  'translateZ',
  'rotate',
  'rotateX',
  'rotateY',
  'rotateZ',
  'scale',
  'scaleX',
  'scaleY',
  'skewX',
  'skewY',
  'perspective',
]);

function splitCSSValueAndUnit(raw: string) {
  const numMatch = raw.match(/-?\d+(\.\d+)?/)?.[0] ?? '0';
  const unitMatch =
    raw.match(/px|rem|em|ex|%|cm|mm|in|pt|pc|ch|vh|vw|vmin|vmax/)?.[0] ?? '';
  return { value: Number(numMatch), unit: unitMatch };
}

function defaultUnit(key: string) {
  if (key === 'perspective' || key.startsWith('translate')) return 'px';
  if (key.startsWith('rotate') || key.startsWith('skew')) return 'deg';
  return '';
}

function formatTransformFunction(key: string, raw: any) {
  const cur =
    raw && typeof (raw as MotionValue<any>).subscribe === 'function'
      ? (raw as MotionValue<any>).current
      : raw;

  if (Array.isArray(cur)) {
    return `${key}(${cur.join(',')})`;
  }

  const str = String(cur);

  const { value, unit: parsedUnit } = splitCSSValueAndUnit(str);
  const unit = parsedUnit || defaultUnit(key);
  return `${key}(${value}${unit})`;
}

export function isTransformKey(key: string) {
  return TRANSFORM_KEYS.has(key);
}

export function applyTransformsStyle(
  node: HTMLElement,
  txProps: Record<string, any>
): (() => void)[] {
  const render = () => {
    const parts: string[] = [];

    for (const key of Object.keys(txProps)) {
      if (isTransformKey(key)) {
        parts.push(formatTransformFunction(key, txProps[key]));
      }
    }

    node.style.transform = parts.join(' ');
  };

  render();

  const unsubs: (() => void)[] = [];
  for (const key of Object.keys(txProps)) {
    const val = txProps[key];
    if (val && typeof (val as MotionValue<any>).subscribe === 'function') {
      unsubs.push((val as MotionValue<any>).subscribe(render));
    }
  }
  return unsubs;
}
