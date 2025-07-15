import { applyStyleProps } from './applyStyleProp';
import { isMotionValue } from '../isMotionValue';
import { applyTransformsStyle } from './styleTransformUtils';

export function applyStyles(
  node: HTMLElement,
  style: Record<string, any>
): (() => void)[] {
  const unsubs: (() => void)[] = [];

  for (const [key, val] of Object.entries(style)) {
    if (isMotionValue(val)) {
      unsubs.push(val.subscribe((v) => applyStyleProps(node, key, v)));
    } else {
      applyStyleProps(node, key, val);
    }
  }

  return unsubs;
}

export function applyAttrs(
  node: HTMLElement,
  props: Record<string, any>
): (() => void)[] {
  const unsubs: (() => void)[] = [];

  for (const [key, val] of Object.entries(props)) {
    if (isMotionValue(val)) {
      unsubs.push(val.subscribe((v) => node.setAttribute(key, String(v))));
    } else if (
      typeof val === 'string' ||
      typeof val === 'number' ||
      typeof val === 'boolean'
    ) {
      node.setAttribute(key, String(val));
    }
  }

  return unsubs;
}

export function applyTransforms(
  elRef: HTMLElement,
  txProps: Record<string, any>
): (() => void)[] {
  return applyTransformsStyle(elRef, txProps);
}
