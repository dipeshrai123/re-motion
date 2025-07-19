import { isMotionValue } from '../isMotionValue';

const UNIT_LESS = new Set([
  'borderImageOutset',
  'borderImageSlice',
  'borderImageWidth',
  'fontWeight',
  'lineHeight',
  'opacity',
  'orphans',
  'tabSize',
  'widows',
  'zIndex',
  'zoom',
  'fillOpacity',
  'floodOpacity',
  'stopOpacity',
  'strokeDasharray',
  'strokeDashoffset',
  'strokeMiterlimit',
  'strokeOpacity',
  'strokeWidth',
  'animationIterationCount',
  'boxFlex',
  'boxFlexGroup',
  'boxOrdinalGroup',
  'columnCount',
  'flex',
  'flexGrow',
  'flexPositive',
  'flexShrink',
  'flexNegative',
  'flexOrder',
  'gridRow',
  'gridColumn',
  'order',
  'lineClamp',
]);

function applyStyleProps(el: HTMLElement, key: string, v: any) {
  const css =
    typeof v === 'number' && !UNIT_LESS.has(key) ? `${v}px` : String(v);
  (el.style as any)[key] = css;
}

export function applyStyles(
  node: HTMLElement,
  style: Record<string, any>
): (() => void)[] {
  const unsubs: (() => void)[] = [];

  for (const [key, val] of Object.entries(style)) {
    if (isMotionValue(val)) {
      applyStyleProps(node, key, val.value);
      unsubs.push(val.onChange((v) => applyStyleProps(node, key, v)));
    } else {
      applyStyleProps(node, key, val);
    }
  }

  return unsubs;
}
