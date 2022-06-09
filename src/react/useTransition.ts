import React from 'react';
import { TransitionValue } from '../animation/TransitionValue';
import type { TransitionValueConfig, OnUpdateFn } from '../types';

/**
 * Transition hook
 *
 * @param initialValue - initial value
 * @param config - the config object for `TransitionValue`
 */
export function useTransition(
  initialValue: number | string,
  config?: TransitionValueConfig
): [TransitionValue, OnUpdateFn] {
  const transition = React.useRef(
    new TransitionValue(initialValue, config)
  ).current;
  return [transition, transition.setValue.bind(transition)];
}
