import { isMotionValue } from './isMotionValue';
import type { MotionValue } from './MotionValue';

export const transformKeys = [
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
] as const;

export function isTransformKey(
  key: string
): key is (typeof transformKeys)[number] {
  return transformKeys.includes(key as any);
}

function splitCSSValueAndUnit(raw: string) {
  const numMatch = raw.match(/-?\d+(\.\d+)?/)?.[0] ?? '0';
  const unitMatch =
    raw.match(
      /px|rem|em|ex|%|cm|mm|in|pt|pc|ch|vh|vw|vmin|vmax|deg|rad|turn/
    )?.[0] ?? '';
  return { value: Number(numMatch), unit: unitMatch };
}

function defaultUnit(key: string) {
  if (key === 'perspective' || key.startsWith('translate')) return 'px';
  if (key.startsWith('rotate') || key.startsWith('skew')) return 'deg';
  return '';
}

function formatTransformFunction(key: string, raw: any) {
  const cur = isMotionValue(raw) ? (raw as MotionValue<any>).value : raw;

  if (Array.isArray(cur)) {
    return `${key}(${cur.join(',')})`;
  }

  const str = String(cur);
  const { value, unit: parsedUnit } = splitCSSValueAndUnit(str);
  const unit = parsedUnit || defaultUnit(key);
  return `${key}(${value}${unit})`;
}

function parseTransform(transform: string): Record<string, string> {
  const result: Record<string, string> = {};
  const regex = /(\w+)\(([^)]+)\)/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(transform))) {
    result[match[1]] = match[0];
  }
  return result;
}

function updateTransformStyle(node: HTMLElement, key: string, raw: any) {
  const existing = node.style.transform || '';
  const transforms = parseTransform(existing);
  transforms[key] = formatTransformFunction(key, raw);
  node.style.transform = Object.values(transforms).join(' ');
}

export function applyTransformsStyle(
  node: HTMLElement,
  txProps: Record<string, any>
): (() => void)[] {
  const unsubs: (() => void)[] = [];
  const keys = Object.keys(txProps).filter(isTransformKey);

  if (keys.length) {
    for (const key of keys) {
      const val = txProps[key];
      const initial = isMotionValue(val)
        ? (val as MotionValue<any>).value
        : val;
      updateTransformStyle(node, key, initial);

      if (isMotionValue(val)) {
        unsubs.push(
          (val as MotionValue<any>).onChange((v) =>
            updateTransformStyle(node, key, v)
          )
        );
      }
    }
  } else if (typeof txProps.transform === 'string') {
    node.style.transform = txProps.transform;
  }

  return unsubs;
}
