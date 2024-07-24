import { EndResultType } from '../animations/FluidAnimation';
import { Timing, TimingConfig } from '../animations/Timing';
import { FluidValue } from '../fluids/FluidValue';

export const timing = (
  value: FluidValue,
  config: TimingConfig,
  callback?: (value: EndResultType) => void
) => {
  value.animate(new Timing(config), callback);
};
