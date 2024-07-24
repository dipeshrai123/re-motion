import { EndResultType } from '../animations/FluidAnimation';
import { Decay, DecayConfig } from '../animations/Decay';
import { FluidValue } from '../fluids/FluidValue';

export const decay = (
  value: FluidValue,
  config: DecayConfig,
  callback?: (value: EndResultType) => void
) => {
  value.stopTrack();
  value.animate(new Decay(config), callback);
};
