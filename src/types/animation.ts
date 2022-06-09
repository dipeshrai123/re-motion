/**
 * Generic function type
 */
export type Fn<T, U> = (value: T) => U;

/**
 * Base unit which is accepted by `TransitionValue`
 */
export type Length = number | string;

/**
 * Object passed as an argument on `onRest` function
 */
export type ResultType = { finished: boolean; value: number };

/**
 * Function read by `animated` hoc to determine whether it
 * can be animated or not
 */
export type SubscribeFn = (
  onUpdate: OnUpdateFn,
  property: string,
  uuid: number
) => void;

/**
 * Configuration object for `TransitionValue`
 */
export interface TransitionValueConfig {
  mass?: number;
  tension?: number;
  friction?: number;
  duration?: number;
  easing?: Fn<number, number>;
  immediate?: boolean;
  delay?: number;
  restDistance?: number;
  onChange?: Fn<number, void>;
  onRest?: Fn<ResultType, void>;
  onStart?: Fn<number, void>;
}

/**
 * FluidValue
 */
export type FluidValue = {
  _subscribe: SubscribeFn;
  _value: Length;
  _currentValue: { current: Length };
  _config?: TransitionValueConfig;
  get: () => Length;
};

export type UpdateValue = {
  toValue: Length;
  config?: TransitionValueConfig;
};

/**
 * Object which can be assigned to animate
 */
export type AssignValue =
  | UpdateValue
  | ((next: (updateValue: UpdateValue) => Promise<any>) => void);

/**
 * Function to start the animation (it starts the already subscribed animation)
 */
export type OnUpdateFn = (
  updatedValue: AssignValue,
  callback?: (result: ResultType) => void
) => void;
