import { EndResultType } from '../animations/FluidAnimation';
import { Spring, SpringConfig } from '../animations/Spring';
import { FluidTrack } from '../fluids/FluidTrack';
import { FluidValue } from '../fluids/FluidValue';

export const spring = (
  value: FluidValue,
  config: Omit<SpringConfig, 'toValue'> & { toValue: number | FluidValue },
  callback?: (value: EndResultType) => void
) => {
  value.stopTrack();
  if (config.toValue instanceof FluidValue) {
    value.startTrack(
      new FluidTrack(value, config.toValue, Spring, config, callback)
    );
  } else {
    value.animate(
      new Spring({
        ...config,
        toValue: config.toValue,
      }),
      callback
    );
  }
};
