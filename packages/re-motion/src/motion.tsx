import React, {
  useRef,
  useLayoutEffect,
  forwardRef,
  HTMLAttributes,
  RefObject,
  SVGAttributes,
  CSSProperties,
} from 'react';
import { isTransformKey } from './styleTransformUtils';
import { applyAttrs, applyStyles, applyTransforms } from './apply';

type MotionStyle = {
  [K in keyof CSSProperties]?: CSSProperties[K] | string | number;
} & {
  [key: string]: any;
};

type MotionHTMLAttributes<T> = {
  [K in keyof HTMLAttributes<T>]?: HTMLAttributes<T>[K] | string | number;
};

type MotionSVGAttributes<T> = {
  [K in keyof SVGAttributes<T>]?: SVGAttributes<T>[K] | string | number;
};

type MotionAttributes<T extends EventTarget> = Omit<
  MotionHTMLAttributes<T> & MotionSVGAttributes<T>,
  'style'
> & {
  style?: MotionStyle;
};

function combineRefs<T>(
  ...refs: Array<RefObject<T> | ((el: T | null) => void) | null | undefined>
) {
  return (element: T | null) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === 'function') ref(element);
      else if ('current' in ref) (ref.current as T | null) = element;
    }
  };
}

export function makeMotion<Tag extends keyof JSX.IntrinsicElements>(
  Wrapped: Tag
) {
  const MotionComp = forwardRef<HTMLElement, MotionAttributes<HTMLElement>>(
    (givenProps, givenRef) => {
      const nodeRef = useRef<HTMLElement | null>(null);

      useLayoutEffect(() => {
        const node = nodeRef.current;
        if (!node) return;

        const { style = {}, ...rest } = givenProps;

        const normal: Record<string, any> = {};
        const tx: Record<string, any> = {};

        for (const [k, v] of Object.entries(style)) {
          if (isTransformKey(k)) tx[k] = v;
          else normal[k] = v;
        }

        const cleanSubs = [
          ...applyStyles(node, normal),
          ...applyTransforms(node, style),
          ...applyAttrs(node, rest),
        ];

        return () => cleanSubs.forEach((c) => c());
      }, []);

      return React.createElement(Wrapped, {
        ...givenProps,
        ref: combineRefs(nodeRef, givenRef),
      });
    }
  );

  MotionComp.displayName =
    typeof Wrapped === 'string'
      ? `Motion.${Wrapped}`
      : `Motion(${
          (Wrapped as any).displayName || (Wrapped as any).name || 'Component'
        })`;

  return MotionComp;
}

export const motion = new Proxy(
  {},
  {
    get(_, tag: string) {
      return makeMotion(tag as keyof JSX.IntrinsicElements);
    },
  }
) as {
  [K in keyof JSX.IntrinsicElements]: ReturnType<typeof makeMotion<K>>;
};
