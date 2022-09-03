import React from 'react';

import { useTransitions } from './useTransitions';

/**
 * useMounts
 * applies mounting and unmounting of a component according to state change
 * applying transitions for multiple keys
 *
 * @param state - boolean indicating mount state of a component
 * @param config - the config object `UseMountConfig`
 */
export function useMounts(
  state: boolean,
  config: { from: any; enter: any; exit: any }
) {
  const initial = React.useRef(true);
  const [mounted, setMounted] = React.useState(false);
  const { from, enter, exit } = React.useRef(config).current;
  const [animation, setAnimation] = useTransitions(from);

  React.useEffect(() => {
    if (state) {
      initial.current = true;
      setMounted(true);
    } else {
      initial.current = false;
      setAnimation(exit, {
        onRest: function ({ finished }) {
          if (finished) {
            setMounted(false);
          }
        },
      });
    }
  }, [state]);

  React.useEffect(() => {
    if (mounted && initial.current) {
      setAnimation(enter);
    }
  }, [mounted, initial.current]);

  return (callback: (animation: any, mounted: boolean) => React.ReactNode) =>
    callback(animation, mounted);
}
