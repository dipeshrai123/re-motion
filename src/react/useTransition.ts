import * as React from 'react';

import { ResultType } from '../animation/Types';

/**
 * UseTransitionConfig for useTransition config
 */
export interface UseTransitionConfig {
  mass?: number;
  tension?: number;
  friction?: number;
  duration?: number;
  easing?: (t: number) => number;
  immediate?: boolean;
  delay?: number;
  restVelocity?: number;
  onChange?: (value: number) => void;
  onRest?: (value: ResultType) => void;
  onStart?: (value: number) => void;
}

export type UpdateValue = {
  toValue: number | string;
  config?: UseTransitionConfig;
};

/**
 * Assign value object to set animation
 */
export type AssignValue =
  | UpdateValue
  | ((next: (updateValue: UpdateValue) => Promise<any>) => void);

export type SubscriptionValue = (
  updatedValue: AssignValue,
  callback?: (result: ResultType) => void
) => void;

/**
 * useTransition returns TransitionValue object
 */
export type TransitionValue = {
  _subscribe: (onUpdate: SubscriptionValue, property: string) => void; // defines the subscription for any animatable key
  _value: number | string; // initial value
  _currentValue: React.MutableRefObject<number | string>; // current updated value
  get: () => number | string; // function to get the current value
  _config?: UseTransitionConfig; // animation config
};

/**
 * useTransition return type
 */
export type UseTransitionReturn = [TransitionValue, SubscriptionValue];

/**
 * useTransition() hook for time and spring based animations
 * @param initialValue numbers are animatable and strings are non-animatable
 * @param config
 * @returns [value, setValue]
 */
export function useTransition(
  initialValue: number | string,
  config?: UseTransitionConfig
): UseTransitionReturn {
  // using map instead of array to reduce the duplication of subscriptions
  const subscriptions = React.useRef<Map<string, SubscriptionValue>>(new Map());
  const _currentValue = React.useRef<number | string>(initialValue);

  // subscriber value
  const value = React.useMemo(() => {
    return {
      _subscribe: function (onUpdate: SubscriptionValue, property: string) {
        subscriptions.current.set(property, onUpdate);

        return () => {
          subscriptions.current.delete(property);
        };
      },
      _value: initialValue,
      _config: config,
      _currentValue,
      get: function () {
        return _currentValue.current;
      },
    };
  }, [initialValue, config]);

  // trigger animation method
  const setValue = (
    updatedValue: AssignValue,
    callback?: (result: ResultType) => void
  ) => {
    if (typeof updatedValue === 'function') {
      // for multi stage transition
      updatedValue((nextValue) => {
        const multiStagePromise = new Promise(function (resolve) {
          for (const subscriptionKey of subscriptions.current.keys()) {
            const updater = subscriptions.current.get(subscriptionKey);

            if (updater) {
              updater(nextValue, function (result) {
                if (result.finished) {
                  resolve(nextValue);
                }

                if (callback) {
                  callback(result);
                }
              });
            }
          }
        });

        return multiStagePromise;
      });

      return;
    }

    // single stage transition
    for (const subscriptionKey of subscriptions.current.keys()) {
      const updater = subscriptions.current.get(subscriptionKey);

      updater && updater(updatedValue, callback);
    }
  };

  // trigger animation on argument change
  React.useEffect(() => {
    setValue({ toValue: initialValue, config });
  }, [initialValue]);

  return [value, setValue];
}
