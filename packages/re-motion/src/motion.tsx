import React, {
  useRef,
  useLayoutEffect,
  forwardRef,
  HTMLAttributes,
  ReactNode,
} from 'react';
import { isTransformKey } from './styleTransformUtils';
import { applyAttrs, applyStyles, applyTransforms } from './apply';

export function makeMotion<
  TagProps extends { style?: Record<string, any>; children?: ReactNode }
>(Wrapped: React.ComponentType<TagProps> | keyof JSX.IntrinsicElements) {
  type Props = TagProps & HTMLAttributes<HTMLElement>;

  const MotionComp = forwardRef<HTMLElement, Props>((props, forwardedRef) => {
    const { style = {}, children, ...rest } = props;
    const nodeRef = useRef<HTMLElement | null>(null);

    const refCallback = (node: HTMLElement | null) => {
      nodeRef.current = node;
      if (!forwardedRef) return;
      if (typeof forwardedRef === 'function') {
        forwardedRef(node);
      } else {
        (forwardedRef as React.MutableRefObject<HTMLElement | null>).current =
          node;
      }
    };

    useLayoutEffect(() => {
      const node = nodeRef.current;
      if (!node) return;

      const normal: Record<string, any> = {};
      const tx: Record<string, any> = {};

      for (const [k, v] of Object.entries(style)) {
        if (isTransformKey(k)) tx[k] = v;
        else normal[k] = v;
      }

      const unsubsStyle = applyStyles(node, normal);
      const unsubsTransform = applyTransforms(node, tx);
      const unsubsAttr = applyAttrs(node, rest);

      return () => {
        unsubsStyle.forEach((u) => u());
        unsubsTransform.forEach((u) => u());
        unsubsAttr.forEach((u) => u());
      };
    }, []);

    return React.createElement(
      Wrapped as any,
      { ref: refCallback, ...rest },
      children
    );
  });

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
  [K in keyof JSX.IntrinsicElements]: React.ForwardRefExoticComponent<
    JSX.IntrinsicElements[K] & { style?: Record<string, any> }
  >;
};
