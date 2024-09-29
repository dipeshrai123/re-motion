import { EndResultType } from '../animations/FluidAnimation';
import { Decay, DecayConfig } from '../animations/Decay';
import { FluidValue } from '../fluids/FluidValue';

import type { ControllerAnimation } from './types';

export const decay = (
  value: FluidValue,
  config: DecayConfig & {
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
    value.animate(new Decay(config), callback, handlers);
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
