import React from 'react';
import { TransitionValue } from '../animation/TransitionValue';
import type { TransitionValueConfig, OnUpdateFn, Length } from '../types';

/**
 * Transition hook
 *
 * @param initialValue - initial value
 * @param config - the config object for `TransitionValue`
 */
export function useTransition(
  initialValue: Length,
  config?: TransitionValueConfig
): [TransitionValue, OnUpdateFn] {
  const isInitial = React.useRef<boolean>(true);
  const transition = React.useRef(
    new TransitionValue(initialValue, config)
  ).current;

  /**
   * trigger animation on argument change
   * doesn't fire the setValue method on initial render
   */
  React.useEffect(() => {
    if (!isInitial.current) {
      transition.setValue({ toValue: initialValue, config });
    }

    isInitial.current = false;
  }, [initialValue]);

  return [transition, transition.setValue.bind(transition)];
}
