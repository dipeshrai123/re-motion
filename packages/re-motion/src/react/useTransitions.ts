import { useCallback, useMemo } from 'react';

import { TransitionValue } from '../animation/TransitionValue';
import { Length } from '../types';

export const useTransitions = <T extends { [key: string]: Length }>(
  values: T
): [
  { [key in keyof T]?: TransitionValue },
  (updateValues: Partial<T>) => void
] => {
  const transitions: { [key in keyof T]?: TransitionValue } = useMemo(
    () =>
      Object.keys(values).reduce(
        (acc, curr) => ({ ...acc, [curr]: new TransitionValue(values[curr]) }),
        {}
      ),
    [values]
  );

  const setTransitions = useCallback(
    (updateValues: Partial<T>) => {
      Object.keys(updateValues).forEach((transitionKey) => {
        const updateValue = updateValues[transitionKey];
        if (updateValue) {
          transitions[transitionKey]?.setValue({ toValue: updateValue });
        }
      });
    },
    [transitions]
  );

  return [transitions, setTransitions];
};
