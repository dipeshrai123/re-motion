import { useRef, useState, useEffect } from 'react';

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
  const initial = useRef(true);
  const [mounted, setMounted] = useState(false);
  const { from, enter, exit } = useRef(config).current;
  const [animation, setAnimation] = useTransitions(from);

  useEffect(() => {
    if (state) {
      initial.current = true;
      setMounted(true);
    } else {
      initial.current = false;
      setAnimation(exit, undefined, function ({ finished }) {
        if (finished) {
          setMounted(false);
        }
      });
    }
  }, [state]);

  useEffect(() => {
    if (mounted && initial.current) {
      setAnimation(enter);
    }
  }, [mounted, initial.current]);

  return (callback: (animation: any, mounted: boolean) => React.ReactNode) =>
    callback(animation, mounted);
}
