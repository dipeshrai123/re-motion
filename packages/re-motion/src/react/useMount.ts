import React from 'react';
import { useTransition } from './useTransition';
import type { FluidValue, TransitionValueConfig, AssignValue } from '../types';

export interface UseMountConfig {
  from: number;
  enter: number | AssignValue;
  exit: number | AssignValue;
  enterConfig?: TransitionValueConfig;
  exitConfig?: TransitionValueConfig;
  config?: TransitionValueConfig;
}

/**
 * Mount hook
 * applies mounting and unmounting of a component according to state change
 * applying transitions
 *
 * @param state - boolean indicating mount state of a component
 * @param config - the config object `UseMountConfig`
 */
export function useMount(state: boolean, config: UseMountConfig) {
  const initial = React.useRef(true);
  const [mounted, setMounted] = React.useState(state);
  const {
    from,
    enter,
    exit,
    config: innerConfig,
    enterConfig,
    exitConfig,
  } = React.useRef(config).current;
  const [animation, setAnimation] = useTransition(from, innerConfig);

  React.useEffect(() => {
    if (state) {
      initial.current = true;
      setMounted(true);
    } else {
      initial.current = false;
      setAnimation(
        typeof exit === 'number'
          ? ({
              toValue: exit,
              config: exitConfig,
            } as any)
          : exit,
        function ({ finished }: any) {
          if (finished) {
            setMounted(false);
          }
        } as any
      );
    }
  }, [state]);

  React.useEffect(() => {
    if (mounted && initial.current) {
      setAnimation(
        typeof enter === 'number'
          ? ({
              toValue: enter,
              config: enterConfig,
            } as any)
          : enter
      );
    }
  }, [mounted, initial.current]);

  return function (
    callback: (animation: FluidValue, mounted: boolean) => React.ReactNode
  ) {
    return callback(animation, mounted);
  };
}
