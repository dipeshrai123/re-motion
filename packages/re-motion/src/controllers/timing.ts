import { EndResultType } from '../animations/FluidAnimation';
import { Timing, TimingConfig } from '../animations/Timing';
import { Fluid } from '../fluids/Fluid';
import { FluidTrack } from '../fluids/FluidTrack';
import { FluidValue } from '../fluids/FluidValue';

import type { ControllerAnimation } from './types';

export const timing = (
  value: FluidValue,
  config: Omit<TimingConfig, 'toValue'> & { toValue: number | FluidValue }
): ControllerAnimation => {
  const start = (callback?: (value: EndResultType) => void) => {
    value.stopTrack();
    if (config.toValue instanceof Fluid) {
      value.startTrack(
        new FluidTrack(value, config.toValue, Timing, config, callback)
      );
    } else {
      value.animate(
        new Timing({
          ...config,
          toValue: config.toValue,
        }),
        callback
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
