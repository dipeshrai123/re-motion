import { useCallback, useRef } from 'react';
import { FluidValue } from '../fluids/FluidValue';
import { isDefined } from '../helpers';
import { spring, timing, decay } from '../controllers';

type Fn<T, U> = (value: T) => U;

export interface UseFluidValueConfig {
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
  decay?: boolean;
  velocity?: number;
  deceleration?: number;
}

type UpdateValue = {
  toValue?: number;
  config?: UseFluidValueConfig;
};

export type AssignValue = UpdateValue | Fn<Fn<UpdateValue, Promise<any>>, void>;

export const useFluidValue = (
  value: number,
  defaultConfig?: UseFluidValueConfig
): [FluidValue, (updateValue: AssignValue, callback?: () => void) => void] => {
  const fluid = useRef(new FluidValue(value)).current;
  const listenerIdRef = useRef<string>();

  const runAnimation = useCallback(
    (updateValue: UpdateValue, onComplete?: () => void) => {
      const config = { ...defaultConfig, ...updateValue.config };

      fluid.removeAllListeners();
      config?.onStart && config.onStart(fluid.get());

      if (config?.onChange) {
        listenerIdRef.current = fluid.addListener((value) =>
          config?.onChange?.(value)
        );
      }

      const onRest = ({
        finished,
        value,
      }: {
        finished: boolean;
        value: number;
      }) => {
        if (finished) {
          config?.onRest?.(value);
          onComplete?.();
        }
      };

      if (isDefined(config?.duration) || config?.immediate) {
        if (!isDefined(updateValue.toValue)) {
          throw new Error('No `toValue` is defined');
        }

        const timingConfig = {
          toValue: updateValue.toValue,
          delay: config?.delay,
          duration: config?.immediate ? 0 : config?.duration,
          easing: config?.easing,
        };

        timing(fluid, timingConfig, onRest);
      } else if (config?.decay) {
        const decayConfig = {
          velocity: config?.velocity,
          deceleration: config?.deceleration,
          delay: config?.delay,
        };

        decay(fluid, decayConfig, onRest);
      } else {
        if (!isDefined(updateValue.toValue)) {
          throw new Error('No `toValue` is defined');
        }

        const springConfig = {
          toValue: updateValue.toValue,
          delay: config?.delay,
          mass: config?.mass,
          tension: config?.tension,
          friction: config?.friction,
          restDistance: config?.restDistance,
        };

        spring(fluid, springConfig, onRest);
      }
    },
    [defaultConfig]
  );

  const setFluid = useCallback(
    (updateValue: AssignValue, callback?: () => void) => {
      if (typeof updateValue === 'function') {
        updateValue((nextValue) => {
          return new Promise((resolve) => {
            runAnimation(nextValue, () => {
              resolve(nextValue);

              if (callback) {
                callback();
              }
            });
          });
        });
      } else {
        runAnimation(updateValue, () => callback?.());
      }
    },
    [defaultConfig]
  );

  return [fluid, setFluid];
};
