import {
  AssignValue,
  SubscriptionValue,
  UseTransitionConfig,
} from '../react/useTransition';
import { ResultType } from './Types';

export class TransitionValue {
  subscriptions: Map<{ uuid: number; property: string }, SubscriptionValue>;

  _subscribe: (
    onUpdate: SubscriptionValue,
    property: string,
    uuid: number
  ) => void;
  _value: number | string;
  _config?: UseTransitionConfig;
  _currentValue: any;
  get: () => number | string;

  constructor(initialValue: number | string, config?: UseTransitionConfig) {
    this.subscriptions = new Map();
    this._currentValue = { current: initialValue };

    this._subscribe = (
      onUpdate: SubscriptionValue,
      property: string,
      uuid: number
    ) => {
      this.subscriptions.set({ uuid, property }, onUpdate);

      return () => {
        this.subscriptions.delete({ uuid, property });
      };
    };
    this._value = initialValue;
    this._config = config;
    this.get = () => {
      return this._currentValue.current;
    };
  }

  setValue(updatedValue: AssignValue, callback?: (result: ResultType) => void) {
    if (typeof updatedValue === 'function') {
      // for multi stage transition
      updatedValue((nextValue) => {
        const multiStagePromise = new Promise((resolve) => {
          for (const subscriptionKey of this.subscriptions.keys()) {
            const updater = this.subscriptions.get(subscriptionKey);

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
    for (const subscriptionKey of this.subscriptions.keys()) {
      const updater = this.subscriptions.get(subscriptionKey);

      updater && updater(updatedValue, callback);
    }
  }
}
