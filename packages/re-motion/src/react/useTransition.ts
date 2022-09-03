import React from 'react';

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
  const isInitial = React.useRef<boolean>(true);
  const transition = React.useRef(new TransitionValue(value, config)).current;

  /**
   * trigger animation on argument change
   * doesn't fire the setValue method on initial render
   */
  React.useEffect(() => {
    if (!isInitial.current) {
      transition.setValue({ toValue: value, config });
    }

    isInitial.current = false;
  }, [value]);

  return [transition, transition.setValue.bind(transition)];
};
