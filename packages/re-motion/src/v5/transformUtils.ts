import { MotionValue } from './value';

export const UNIT_LESS = new Set([
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

export const TRANSFORM_KEYS = new Set([
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

export function applyStyleProp(el: HTMLElement, key: string, v: any) {
  const css =
    typeof v === 'number' && !UNIT_LESS.has(key) ? `${v}px` : String(v);
  (el.style as any)[key] = css;
}

export function setupTransformSubscriptions(
  elRef: React.MutableRefObject<HTMLElement | null>,
  txProps: Record<string, any>
): (() => void)[] {
  function renderTransform() {
    const el = elRef.current!;
    const parts: string[] = [];
    for (const key of TRANSFORM_KEYS) {
      const val = txProps[key];
      if (val == null) continue;
      const cur =
        typeof (val as MotionValue<any>).subscribe === 'function'
          ? (val as MotionValue<any>).current
          : val;
      if (typeof cur === 'string') {
        parts.push(`${key}(${cur})`);
      } else {
        switch (key) {
          case 'rotate':
          case 'rotateX':
          case 'rotateY':
          case 'rotateZ':
          case 'skewX':
          case 'skewY':
            parts.push(`${key}(${cur}deg)`);
            break;
          case 'scale':
          case 'scaleX':
          case 'scaleY':
            parts.push(`${key}(${cur})`);
            break;
          default:
            parts.push(`${key}(${cur}px)`);
        }
      }
    }
    el.style.transform = parts.join(' ');
  }

  renderTransform();

  const unsubs: (() => void)[] = [];
  for (const key of Object.keys(txProps)) {
    const val = txProps[key];
    if (val && typeof (val as MotionValue<any>).subscribe === 'function') {
      unsubs.push((val as MotionValue<any>).subscribe(renderTransform));
    }
  }

  return unsubs;
}
