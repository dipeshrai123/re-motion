import {
  createElement,
  forwardRef,
  RefObject,
  useLayoutEffect,
  useRef,
} from 'react';

import { FluidStyle } from './FluidStyle';
import { getTransform, separateTransformStyle } from './transforms';
import { getCssValue } from '../helpers';

function applyFluidValues(ref: { current: any }, style: Record<string, any>) {
  const { nonTransformStyle, transformStyle } = separateTransformStyle(style);

  ref.current.style.transform = getTransform(transformStyle);
  Object.entries(nonTransformStyle).forEach(([property, value]) => {
    ref.current.style[property] = getCssValue(property, value);
  });
}

export function makeFluid(WrapperComponent: any) {
  return forwardRef((givenProps: any, givenRef: any) => {
    const instanceRef = useRef<any>(null);

    const fluidStylesRef = useRef<FluidStyle | null>(null);

    useLayoutEffect(() => {
      const { style = {} } = givenProps;

      fluidStylesRef.current = new FluidStyle(style, () => {
        if (!instanceRef) return;

        if (fluidStylesRef.current) {
          applyFluidValues(instanceRef, fluidStylesRef.current.get());
        }
      });
    }, []);

    return createElement(WrapperComponent, {
      ...givenProps,
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
