import { useCallback, useRef } from 'react';
import { FluidValue } from '../fluids/FluidValue';
import { isDefined } from '../helpers';
import { spring, timing } from '../controllers';

type Fn<T, U> = (value: T) => U;

interface FluidValueConfig {
  mass?: number;
  tension?: number;
  friction?: number;
  duration?: number;
  easing?: Fn<number, number>;
  immediate?: boolean;
  delay?: number;
  restDistance?: number;
  //   onChange?: Fn<number, void>;
  onRest?: Fn<number, void>;
  //   onStart?: Fn<number, void>;
  //   decay?: boolean;
  //   velocity?: number;
  //   deceleration?: number;
}

export const useFluidValue = (value: number, config?: FluidValueConfig) => {
  const fluid = useRef(new FluidValue(value)).current;

  const setFluid = useCallback(
    (updateValue: { toValue: number; config?: FluidValueConfig }) => {
      if (isDefined(config?.duration) || config?.immediate) {
        const timingConfig = {
          toValue: updateValue.toValue,
          delay: config?.delay,
          duration: config?.duration,
          easing: config?.easing,
        };
        timing(
          fluid,
          timingConfig,
          ({ finished, value }) => finished && config?.onRest?.(value)
        );
      } else {
        const springConfig = {
          toValue: updateValue.toValue,
          delay: config?.delay,
          mass: config?.mass,
          tension: config?.tension,
          friction: config?.friction,
          restDistance: config?.restDistance,
        };
        spring(
          fluid,
          springConfig,
          ({ finished, value }) => finished && config?.onRest?.(value)
        );
      }
    },
    [config]
  );

  return [fluid, setFluid];
};
