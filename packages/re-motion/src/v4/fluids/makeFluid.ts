import {
  createElement,
  forwardRef,
  RefObject,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react';

import { FluidProps } from './FluidProps';
import { applyFluidValues, getInitialProps } from '../helpers';

export function makeFluid(WrapperComponent: any) {
  return forwardRef((givenProps: any, givenRef: any) => {
    const instanceRef = useRef<any>(null);

    const fluidStylesRef = useRef<FluidProps | null>(null);

    useLayoutEffect(() => {
      const oldFluidStyleRef = fluidStylesRef.current;

      fluidStylesRef.current = new FluidProps(givenProps, () => {
        if (!instanceRef) return;

        if (fluidStylesRef.current) {
          applyFluidValues(instanceRef, fluidStylesRef.current.get());
        }
      });

      oldFluidStyleRef?.detach();
    }, [givenProps]);

    const initialProps = useMemo(
      () => getInitialProps(givenProps),
      [givenProps]
    );

    return createElement(WrapperComponent, {
      ref: combineRefs(instanceRef, givenRef),
      ...initialProps,
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
