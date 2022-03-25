import * as React from 'react';
import {
  useTransition,
  TransitionValue,
  UseTransitionConfig,
} from './useTransition';

export interface UseMountConfig {
  from: number;
  enter: number;
  exit: number;
  enterConfig?: UseTransitionConfig; // animation config on enter
  exitConfig?: UseTransitionConfig; // animation config on exit
  config?: UseTransitionConfig;
}

/**
 * useMount handles mounting and unmounting of a component
 * @param state - boolean
 * @param config - useTransitionConfig
 * @returns mount function with a callback with argument ( TransitionNode, mounted )
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
        {
          toValue: exit,
          config: exitConfig,
        },
        function ({ finished }) {
          if (finished) {
            setMounted(false);
          }
        }
      );
    }
  }, [state]);

  React.useEffect(() => {
    if (mounted && initial.current) {
      setAnimation({
        toValue: enter,
        config: enterConfig,
      });
    }
  }, [mounted, initial.current]);

  return function (
    callback: (animation: TransitionValue, mounted: boolean) => React.ReactNode
  ) {
    return callback(animation, mounted);
  };
}
