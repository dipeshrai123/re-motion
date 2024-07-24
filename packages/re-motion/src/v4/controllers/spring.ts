import { EndResultType } from '../animations/FluidAnimation';
import { Spring, SpringConfig } from '../animations/Spring';
import { FluidValue } from '../fluids/FluidValue';

export const spring = (
  value: FluidValue,
  config: SpringConfig,
  callback?: (value: EndResultType) => void
) => {
  value.animate(new Spring(config), callback);
};
