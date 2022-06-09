import React from 'react';

import type {
  ResultType,
  TransitionValueConfig,
  FluidValue,
  OnUpdateFn,
  AssignValue,
} from '../types';

/**
 * Transition hook
 *
 * @param initialValue - initial value
 * @param config - the config object for `TransitionValue`
 */
export function useTransition(
  initialValue: number | string,
  config?: TransitionValueConfig
): [FluidValue, OnUpdateFn] {
  // using map instead of array to reduce the duplication of subscriptions
  const _isInitial = React.useRef<boolean>(true);
  const subscriptions = React.useRef<
    Map<{ uuid: number; property: string }, OnUpdateFn>
  >(new Map());
  const _currentValue = React.useRef<number | string>(initialValue);

  // subscriber value
  const value = React.useMemo(() => {
    return {
      _subscribe: function (
        onUpdate: OnUpdateFn,
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
