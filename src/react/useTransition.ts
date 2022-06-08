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
  restDistance?: number; // minimum distance the animation should stop
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
export type FluidValue = {
  _subscribe: (
    onUpdate: SubscriptionValue,
    property: string,
    uuid: number
  ) => void; // defines the subscription for any animatable key
  _value: number | string; // initial value
  _currentValue: React.MutableRefObject<number | string>; // current updated value
  get: () => number | string; // function to get the current value
  _config?: UseTransitionConfig; // animation config
};

/**
 * useTransition return type
 */
export type UseTransitionReturn = [FluidValue, SubscriptionValue];

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
  const _isInitial = React.useRef<boolean>(true);
  const subscriptions = React.useRef<
    Map<{ uuid: number; property: string }, SubscriptionValue>
  >(new Map());
  const _currentValue = React.useRef<number | string>(initialValue);

  // subscriber value
  const value = React.useMemo(() => {
    return {
      _subscribe: function (
        onUpdate: SubscriptionValue,
        property: string,
        uuid: number
      ) {
        subscriptions.current.set({ uuid, property }, onUpdate);

        return () => {
          subscriptions.current.delete({ uuid, property });
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

  /**
   * trigger animation on argument change
   * doesn't fire the setValue method on initial render
   */
  React.useEffect(() => {
    if (!_isInitial.current) {
      setValue({ toValue: initialValue, config });
    }

    _isInitial.current = false;
  }, [initialValue]);

  return [value, setValue];
}
