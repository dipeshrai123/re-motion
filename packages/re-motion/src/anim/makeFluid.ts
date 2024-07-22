import {
  createElement,
  forwardRef,
  RefObject,
  useLayoutEffect,
  useRef,
} from 'react';

import { FluidStyle } from './FluidStyle';

export function makeFluid(WrapperComponent: any) {
  return forwardRef((givenProps: any, givenRef: any) => {
    const instanceRef = useRef<any>(null);

    const fluidStyles = useRef<FluidStyle | null>(null);

    useLayoutEffect(() => {
      const { style = {} } = givenProps;

      fluidStyles.current = new FluidStyle(style, () => {
        if (!instanceRef) return;

        if (fluidStyles.current) {
          Object.entries(fluidStyles.current.get()).forEach(
            ([property, value]) => {
              instanceRef.current.style[property] =
                typeof value === 'string' ? value : value + 'px';
            }
          );
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
