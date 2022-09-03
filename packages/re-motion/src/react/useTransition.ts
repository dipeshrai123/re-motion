import { useEffect, useRef } from 'react';

import { TransitionValue } from '../animation/TransitionValue';
import type { TransitionValueConfig, OnUpdateFn, Length } from '../types';

/**
 * useTransition
 *
 * @param value - initial value
 * @param config - the config object for `TransitionValue`
 */
export const useTransition = (
  value: Length,
  config?: TransitionValueConfig
): [TransitionValue, OnUpdateFn] => {
  const isInitial = useRef<boolean>(true);
  const transition = useRef(new TransitionValue(value, config)).current;

  useEffect(() => {
    if (isInitial.current) {
      isInitial.current = false;
    } else {
      transition.setValue({ toValue: value, config });
    }
  }, [value]);

  return [transition, transition.setValue.bind(transition)];
};
