import {
  createElement,
  forwardRef,
  RefObject,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react';

import { FluidProps } from './FluidProps';
import { getTransform, separateTransformStyle } from './transforms';
import { getCssValue } from '../helpers';

function applyFluidValues(ref: { current: any }, props: Record<string, any>) {
  const { style = {} } = props;
  const { nonTransformStyle, transformStyle } = separateTransformStyle(style);

  ref.current.style.transform = getTransform(transformStyle);
  Object.entries(nonTransformStyle).forEach(([property, value]) => {
    ref.current.style[property] = getCssValue(property, value);
  });
}

export function makeFluid(WrapperComponent: any) {
  return forwardRef((givenProps: any, givenRef: any) => {
    const instanceRef = useRef<any>(null);

    const fluidStylesRef = useRef<FluidProps | null>(null);

    useLayoutEffect(() => {
      fluidStylesRef.current = new FluidProps(givenProps, () => {
        if (!instanceRef) return;

        if (fluidStylesRef.current) {
          applyFluidValues(instanceRef, fluidStylesRef.current.get());
        }
      });

      return () => {
        fluidStylesRef.current?.detach();
      };
    }, []);

    const initialProps = useMemo(() => {
      const { style = {} } = new FluidProps(givenProps, () => {}).get();
      const { nonTransformStyle, transformStyle } =
        separateTransformStyle(style);

      return {
        style: {
          ...nonTransformStyle,
          transform: getTransform(transformStyle),
        },
      };
    }, [givenProps]);

    return createElement(WrapperComponent, {
      ...initialProps,
      ref: combineRefs(instanceRef, givenRef),
    });
  });
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
