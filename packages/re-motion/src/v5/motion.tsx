import React, {
  useRef,
  useLayoutEffect,
  forwardRef,
  HTMLAttributes,
  ReactNode,
} from 'react';
import { FluidValue } from './value';
import {
  applyStyleProp,
  setupTransformSubscriptions,
  TRANSFORM_KEYS,
} from './transformUtils';

// type-guard
function isFluidValue(v: any): v is FluidValue<any> {
  return v != null && typeof v.subscribe === 'function';
}

/**
 * Wraps any intrinsic tag or component so that:
 *  - static style props are applied once
 *  - FluidValue style props subscribe and update el.style directly
 */
export function makeMotion<
  TagProps extends { style?: Record<string, any>; children?: ReactNode }
>(Wrapped: React.ComponentType<TagProps> | keyof JSX.IntrinsicElements) {
  type Props = TagProps & HTMLAttributes<HTMLElement>;

  const FluidComp = forwardRef<HTMLElement, Props>((props, forwardedRef) => {
    const { style = {}, children, ...rest } = props;
    const nodeRef = useRef<HTMLElement | null>(null);

    // callback ref that updates nodeRef (and forwards if needed)
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
        if (TRANSFORM_KEYS.has(k)) tx[k] = v;
        else normal[k] = v;
      }

      for (const [k, v] of Object.entries(normal)) {
        if (!isFluidValue(v)) applyStyleProp(node, k, v);
      }

      const unsubsStyle = Object.entries(normal)
        .filter(([, v]) => isFluidValue(v))
        .map(([k, v]) =>
          (v as FluidValue<any>).subscribe((val) =>
            applyStyleProp(node, k, val)
          )
        );

      const unsubsTransform = setupTransformSubscriptions(nodeRef, tx);

      const unsubsAttr = Object.entries(rest).map(([key, val]) => {
        if (isFluidValue(val)) {
          // subscribe
          return val.subscribe((v) => {
            if (node) node.setAttribute(key, String(v));
          });
        } else {
          // static primitive → initial attribute
          if (
            typeof val === 'string' ||
            typeof val === 'number' ||
            typeof val === 'boolean'
          ) {
            node.setAttribute(key, String(val));
          }
          return () => {};
        }
      });

      return () => {
        unsubsStyle.forEach((u) => u());
        unsubsTransform.forEach((u) => u());
        unsubsAttr.forEach((u) => u());
      };
    }, []);

    // render the wrapped element with our ref and rest props
    return React.createElement(
      Wrapped as any,
      { ref: refCallback, ...rest },
      children
    );
  });

  FluidComp.displayName =
    typeof Wrapped === 'string'
      ? `Fluid.${Wrapped}`
      : `Fluid(${
          (Wrapped as any).displayName || (Wrapped as any).name || 'Component'
        })`;

  return FluidComp;
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
