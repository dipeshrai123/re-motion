// motion.tsx
import React, {
  useRef,
  useLayoutEffect,
  forwardRef,
  HTMLAttributes,
} from 'react';
import { FluidValue } from './value';

// type‐guard for FluidValue
function isFluidValue<T>(v: any): v is FluidValue<T> {
  return v != null && typeof v.subscribe === 'function';
}

// HOC factory that wires any tag name or component to fluid styles
export function makeFluid<ComponentProps extends {}>(
  Wrapped: keyof JSX.IntrinsicElements | React.ComponentType<ComponentProps>
) {
  type Props = ComponentProps &
    HTMLAttributes<HTMLElement> & {
      style?: Record<string, any>;
    };

  const FluidComp = forwardRef<HTMLElement, Props>((props, forwardedRef) => {
    const { style = {}, ...rest } = props;
    // ref to the underlying DOM node
    const localRef = useRef<HTMLElement>(null);
    const ref = (forwardedRef as React.RefObject<HTMLElement>) || localRef;

    useLayoutEffect(() => {
      // apply initial (non‐fluid) styles
      Object.entries(style).forEach(([key, val]) => {
        if (!isFluidValue(val) && ref.current) {
          (ref.current.style as any)[key] = val;
        }
      });

      // subscribe to all FluidValue styles
      const unsubs = Object.entries(style)
        .filter(([, val]) => isFluidValue(val))
        .map(([key, val]) => {
          return (val as FluidValue<any>).subscribe((v: any) => {
            if (ref.current) {
              // numbers get "px" by default; strings pass through
              const str = typeof v === 'number' ? `${v}px` : v;
              (ref.current.style as any)[key] = str;
            }
          });
        });

      return () => {
        unsubs.forEach((unsub) => unsub());
      };
    }, [style]);

    // Render the wrapped component / tag with our ref and rest props
    return React.createElement(Wrapped as any, { ref, ...rest } as any);
  });

  FluidComp.displayName =
    typeof Wrapped === 'string'
      ? `Fluid.${Wrapped}`
      : `Fluid(${Wrapped.displayName || Wrapped.name})`;

  return FluidComp;
}

// a proxy so you can do motion.div, motion.span, etc.
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
