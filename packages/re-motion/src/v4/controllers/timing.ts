import { EndResultType } from '../animations/FluidAnimation';
import { Timing, TimingConfig } from '../animations/Timing';
import { Fluid } from '../fluids/Fluid';
import { FluidTrack } from '../fluids/FluidTrack';
import { FluidValue } from '../fluids/FluidValue';

export const timing = (
  value: FluidValue,
  config: Omit<TimingConfig, 'toValue'> & { toValue: number | FluidValue },
  callback?: (value: EndResultType) => void
) => {
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
