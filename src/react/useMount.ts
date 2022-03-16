import * as React from 'react';
import {
  useTransition,
  TransitionValue,
  UseTransitionConfig,
} from './useTransition';

export interface InnerUseMountConfig extends UseTransitionConfig {
  enterDuration?: number;
  exitDuration?: number;
}

interface UseMountConfig {
  from: number;
  enter: number;
  exit: number;
  config?: InnerUseMountConfig;
}

/**
 * useMount handles mounting and unmounting of a component
 * @param state - boolean
 * @param config - useTransitionConfig
 * @returns mount function with a callback with argument ( TransitionNode, mounted )
 */
export function useMount(state: boolean, config: UseMountConfig) {
  const [initial, setInitial] = React.useState(true);
  const [mounted, setMounted] = React.useState(state);
  const { from, enter, exit, config: _config } = React.useRef(config).current;
  const [animation, setAnimation] = useTransition(from, _config);

  const enterDuration = config.config?.enterDuration ?? config.config?.duration;
  const exitDuration = config.config?.exitDuration ?? config.config?.duration;

  React.useEffect(() => {
    if (state) {
      setInitial(true);
      setMounted(true);
    } else {
      setInitial(false);
      setAnimation(
        {
          toValue: exit,
          config: {
            duration: exitDuration,
          },
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
    if (mounted && initial) {
      setAnimation(
        {
          toValue: enter,
          config: {
            duration: enterDuration,
          },
        },
        function () {
          return;
        }
      );
    }
  }, [mounted, initial]);

  return function (
    callback: (
      { value }: { value: TransitionValue },
      mounted: boolean
    ) => React.ReactNode
  ) {
    return callback({ value: animation }, mounted);
  };
}
