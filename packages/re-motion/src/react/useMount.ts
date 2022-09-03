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
  const [mounted, setMounted] = React.useState(false);
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
      setAnimation(exit, exitConfig, function ({ finished }: any) {
        if (finished) {
          setMounted(false);
        }
      } as any);
    }
  }, [state]);

  React.useEffect(() => {
    if (mounted && initial.current) {
      setAnimation(enter, enterConfig);
    }
  }, [mounted, initial.current]);

  return (
    callback: (animation: FluidValue, mounted: boolean) => React.ReactNode
  ) => callback(animation, mounted);
}
