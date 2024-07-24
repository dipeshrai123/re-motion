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
  onChange?: Fn<number, void>;
  onRest?: Fn<number, void>;
  onStart?: Fn<number, void>;
  //   decay?: boolean;
  //   velocity?: number;
  //   deceleration?: number;
}

export const useFluidValue = (
  value: number,
  defaultConfig?: FluidValueConfig
): [
  FluidValue,
  (updateValue: { toValue: number; config?: FluidValueConfig }) => void
] => {
  const fluid = useRef(new FluidValue(value)).current;

  const setFluid = useCallback(
    (updateValue: { toValue: number; config?: FluidValueConfig }) => {
      const config = { ...defaultConfig, ...updateValue.config };

      config?.onStart && config.onStart(fluid.get());

      if (config?.onChange) {
        fluid.addListener((value) => config?.onChange?.(value));
      }

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
    [defaultConfig]
  );

  return [fluid, setFluid];
};