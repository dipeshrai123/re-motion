import { EndResultType } from '../animations/FluidAnimation';
import { Decay, DecayConfig } from '../animations/Decay';
import { FluidValue } from '../fluids/FluidValue';

import type { ControllerAnimation } from './types';

export const decay = (
  value: FluidValue,
  config: DecayConfig
): ControllerAnimation => {
  const start = (callback?: (value: EndResultType) => void) => {
    value.stopTrack();
    value.animate(new Decay(config), callback);
  };

  const stop = () => {
    value.stopAnimation();
  };

  const reset = () => {
    value.resetAnimation();
  };

  return {
    start,
    stop,
    reset,
  };
};
