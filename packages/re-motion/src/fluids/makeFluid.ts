import {
  ComponentType,
  forwardRef,
  HTMLAttributes,
  RefObject,
  useLayoutEffect,
  useMemo,
  useRef,
  createElement,
  CSSProperties,
  SVGAttributes,
} from 'react';

import { FluidProps } from './FluidProps';
import {
  applyFluidValues,
  getInitialProps,
  styleTrasformKeys,
} from '../helpers';
import { FluidValue } from './FluidValue';
import { FluidInterpolation } from './FluidInterpolation';
import { FluidCombine } from './FluidCombine';

type WrappedComponentOrTag =
  | ComponentType<HTMLAttributes<HTMLElement>>
  | keyof JSX.IntrinsicElements;

type FluidCSSProperties = {
  [key in keyof CSSProperties]:
    | CSSProperties[key]
    | FluidValue
    | FluidInterpolation
    | FluidCombine;
} & {
  [key in (typeof styleTrasformKeys)[number]]?:
    | FluidValue
    | FluidInterpolation
    | FluidCombine
    | number
    | string;
};

type FluidHTMLAttributes<T> = {
  [key in keyof HTMLAttributes<T>]:
    | HTMLAttributes<T>[key]
    | FluidValue
    | FluidInterpolation
    | FluidCombine;
};

type FluidSVGAttributes<T> = {
  [key in keyof SVGAttributes<T>]:
    | SVGAttributes<T>[key]
    | FluidValue
    | FluidInterpolation
    | FluidCombine;
};

type FluidAttributes<T extends EventTarget> = Omit<
  FluidHTMLAttributes<T> & FluidSVGAttributes<T>,
  'style'
> & {
  style?: FluidCSSProperties;
};

export function makeFluid<C extends WrappedComponentOrTag>(
  WrapperComponent: C
) {
  return forwardRef(
    (givenProps: FluidAttributes<EventTarget>, givenRef: any) => {
      const instanceRef = useRef<any>(null);

      const fluidStylesRef = useRef<FluidProps | null>(null);

      useLayoutEffect(() => {
        const callback = () => {
          if (!instanceRef) return;

          if (fluidStylesRef.current) {
            applyFluidValues(instanceRef, fluidStylesRef.current.get());
          }
        };

        fluidStylesRef.current = new FluidProps(givenProps, callback);
        fluidStylesRef.current.attach();

        return () => fluidStylesRef.current?.detach();
      }, []);

      const initialProps: any = useMemo(
        () => getInitialProps(givenProps),
        [givenProps]
      );

      return createElement(WrapperComponent, {
        ...initialProps,
        ref: combineRefs(instanceRef, givenRef),
      });
    }
  );
}

function combineRefs(
  ...refs: Array<RefObject<any> | ((element: HTMLElement) => void)>
) {
  return function applyRef(element: HTMLElement) {
    refs.forEach((ref) => {
      if (!ref) return;
      if (typeof ref === 'function') {
        ref(element);
        return;
      }
      if ('current' in ref) (ref.current as HTMLElement) = element;
    });
  };
}
