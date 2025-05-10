import React, {
  useRef,
  useLayoutEffect,
  forwardRef,
  HTMLAttributes,
  ReactNode,
} from 'react';
import { FluidValue } from './value';

// type-guard
function isFluidValue(v: any): v is FluidValue<any> {
  return v != null && typeof v.subscribe === 'function';
}

/**
 * Wraps any intrinsic tag or component so that:
 *  - static style props are applied once
 *  - FluidValue style props subscribe and update el.style directly
 */
export function makeFluid<
  TagProps extends { style?: Record<string, any>; children?: ReactNode }
>(Wrapped: React.ComponentType<TagProps> | keyof JSX.IntrinsicElements) {
  type Props = TagProps & HTMLAttributes<HTMLElement>;

  const FluidComp = forwardRef<HTMLElement, Props>((props, forwardedRef) => {
    const { style = {}, ...rest } = props;
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

      // 1) apply all static (non-FluidValue) styles once
      for (const [key, val] of Object.entries(style)) {
        if (!isFluidValue(val)) {
          const cssValue = typeof val === 'number' ? `${val}px` : String(val);
          (node.style as any)[key] = cssValue;
        }
      }

      // 2) subscribe to each FluidValue style, updating nodeRef.current
      const unsubs = Object.entries(style)
        .filter(([, val]) => isFluidValue(val))
        .map(([key, val]) =>
          (val as FluidValue<any>).subscribe((v) => {
            const str = typeof v === 'number' ? `${v}px` : v;
            const cur = nodeRef.current;
            if (cur) (cur.style as any)[key] = str;
          })
        );

      return () => {
        unsubs.forEach((u) => u());
      };
    }, [style]);

    // render the wrapped element with our ref and rest props
    return React.createElement(
      Wrapped as any,
      { ref: refCallback, ...rest } as any
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
      return makeFluid(tag as any);
    },
  }
) as {
  [K in keyof JSX.IntrinsicElements]: React.ForwardRefExoticComponent<
    JSX.IntrinsicElements[K] & { style?: Record<string, any> }
  >;
};
