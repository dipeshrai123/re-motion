import { Timing, TimingConfig } from '../animations/Timing';
import { FluidValue } from '../fluids/FluidValue';

export const timing = (value: FluidValue, config: TimingConfig) => {
  value.animate(new Timing(config));
};
