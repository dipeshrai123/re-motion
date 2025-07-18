import React, { useRef, useLayoutEffect } from 'react';
import type { MotionValue } from './MotionValue'; // your core MotionValue

type MotionStyle = {
  [K in keyof React.CSSProperties]?: React.CSSProperties[K] | MotionValue<any>;
} & {
  // allow arbitrary props like translateX, rotate, etc.
  [key: string]: any | MotionValue<any>;
};

type MotionProps<Tag extends keyof JSX.IntrinsicElements> = Omit<
  JSX.IntrinsicElements[Tag],
  'style'
> & {
  style?: MotionStyle;
};

function isMotionValue<T>(v: any): v is MotionValue<T> {
  return v != null && typeof (v as MotionValue<T>).onChange === 'function';
}

// Which keys should be treated as transform functions
const transformProps = new Set([
  'translateX',
  'translateY',
  'scale',
  'scaleX',
  'scaleY',
  'rotate',
  'rotateX',
  'rotateY',
  'skewX',
  'skewY',
]);

function getTransformUnit(key: string, val: any) {
  if (key.startsWith('translate')) return typeof val === 'number' ? 'px' : '';
  if (key.startsWith('rotate') || key.startsWith('skew'))
    return typeof val === 'number' ? 'deg' : '';
  return '';
}

function updateTransform(el: HTMLElement, key: string, val: any) {
  const existing = el.style.transform || '';
  // strip any previous instance of this function
  const cleaned = existing
    .replace(new RegExp(`${key}\\([^)]*\\)`, 'g'), '')
    .trim();
  const unit = getTransformUnit(key, val);
  el.style.transform = `${cleaned} ${key}(${val}${unit})`.trim();
}

function applyStyle(el: HTMLElement, key: string, val: any) {
  if (transformProps.has(key)) {
    updateTransform(el, key, val);
  } else {
    // for non-transform props, append "px" on numbers
    const value = typeof val === 'number' ? `${val}px` : `${val}`;
    // @ts-ignore
    el.style[key] = value;
  }
}

export function createMotionComponent<Tag extends keyof JSX.IntrinsicElements>(
  tag: Tag
) {
  return function MotionComponent(props: MotionProps<Tag>) {
    const { style = {}, ...rest } = props;
    const ref = useRef<HTMLElement>(null);

    useLayoutEffect(() => {
      const el = ref.current;
      if (!el) return;

      // Initial application of all style props
      Object.entries(style).forEach(([key, raw]) => {
        const v = isMotionValue(raw) ? raw.value : raw;
        applyStyle(el, key, v);
      });

      // Subscribe to every MotionValue in style
      const unsubs: (() => void)[] = [];
      Object.entries(style).forEach(([key, raw]) => {
        if (isMotionValue(raw)) {
          unsubs.push(
            raw.onChange((v) => {
              applyStyle(el, key, v);
            })
          );
        }
      });

      return () => unsubs.forEach((f) => f());
    }, [style]);

    // Render without passing React `style` (we manage it ourselves)
    return React.createElement(tag, { ref, ...rest });
  } as React.ComponentType<MotionProps<Tag>>;
}
