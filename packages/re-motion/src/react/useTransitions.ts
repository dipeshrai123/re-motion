import { useCallback, useEffect, useMemo, useRef } from 'react';

import { TransitionValue } from '../animation/TransitionValue';
import type { TransitionValueConfig, Length } from '../types';

/**
 * useTransitions hook for multiple values transition
 *
 * @param values - object with different keys
 * @param config - the config object for `TransitionValue`
 */
export const useTransitions = <T extends { [key: string]: Length }>(
  values: T,
  config?: TransitionValueConfig
): [
  { [key in keyof T]?: TransitionValue },
  (updateValues: Partial<T>, config?: TransitionValueConfig) => void
] => {
  const isInitialRender = useRef<boolean>(true);
  const transitions: { [key in keyof T]?: TransitionValue } = useMemo(
    () =>
      Object.keys(values).reduce(
        (acc, curr) => ({
          ...acc,
          [curr]: new TransitionValue(values[curr], config),
        }),
        {}
      ),
    []
  );

  const setTransitions = useCallback(
    (updateValues: Partial<T>, config?: TransitionValueConfig) => {
      Object.keys(updateValues).forEach((transitionKey) => {
        const updateValue = updateValues[transitionKey];
        if (updateValue !== null && updateValue !== undefined) {
          transitions[transitionKey]?.setValue({
            toValue: updateValue,
            config,
          });
        }
      });
    },
    [transitions]
  );

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
    } else {
      setTransitions(values);
    }
  }, [values]);

  return [transitions, setTransitions];
};
