import { EndResultType } from '../animations/FluidAnimation';
import { Spring, SpringConfig } from '../animations/Spring';
import { Fluid } from '../fluids/Fluid';
import { FluidTrack } from '../fluids/FluidTrack';
import { FluidValue } from '../fluids/FluidValue';

import type { ControllerAnimation } from './types';

export const spring = (
  value: FluidValue,
  config: Omit<SpringConfig, 'toValue'> & {
    toValue: number | FluidValue;
    onStart?: (value: number | string) => void;
    onChange?: (value: number | string) => void;
    onRest?: (value: number | string) => void;
  }
): ControllerAnimation => {
  const start = (callback?: (value: EndResultType) => void) => {
    const handlers = {
      onStart: config?.onStart,
      onChange: config?.onChange,
      onRest: config?.onRest,
    };

    value.stopTrack();
    if (config.toValue instanceof Fluid) {
      value.startTrack(
        new FluidTrack(value, config.toValue, Spring, config, callback)
      );
    } else {
      value.animate(
        new Spring({
          ...config,
          toValue: config.toValue,
        }),
        callback,
        handlers
      );
    }
  };

  const stop = () => {
    value.stopAnimation();
  };

  const reset = () => {
    value.resetAnimation();
  };

  return { start, stop, reset };
};
