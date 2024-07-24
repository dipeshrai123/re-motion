import { useState, useRef, useLayoutEffect } from 'react';

import { useFluidValue } from './useFluidValue';
import { FluidValue } from '../controllers/FluidValue';

import type { AssignValue, FluidValueConfig } from '../types/animation';

export interface UseMountConfig {
  from: number;
  enter: number | AssignValue;
  exit: number | AssignValue;
  config?: FluidValueConfig;
}

/**
 * `useMount`
 *
 * applies mounting and unmounting of a component according to state change
 * applying transitions
 *
 * @param state - boolean indicating mount state of a component
 * @param config - the config object `UseMountConfig`
 */
export const useMount = (state: boolean, config: UseMountConfig) => {
  const [mounted, setMounted] = useState(false);
  const { from, enter, exit, config: innerConfig } = useRef(config).current;
  const [animation, setAnimation] = useFluidValue(from, innerConfig);

  useLayoutEffect(() => {
    if (state) {
      setMounted(true);
      queueMicrotask(() =>
        setAnimation(
          typeof enter === 'number'
            ? { toValue: enter, config: innerConfig }
            : enter
        )
      );
    } else {
      setAnimation(
        typeof exit === 'number'
          ? { toValue: exit, config: innerConfig }
          : exit,
        function ({ finished }: { finished: boolean }) {
          if (finished) {
            setMounted(false);
          }
        }
      );
    }
  }, [state]);

  return (
    callback: (animation: FluidValue, mounted: boolean) => React.ReactNode
  ) => callback(animation, mounted);
};