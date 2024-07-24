import { FluidValue } from '../fluids/FluidValue';

type ExtrapolateType = 'extend' | 'identity' | 'clamp';

type ExtrapolateConfig = {
  extrapolate?: ExtrapolateType;
  extrapolateLeft?: ExtrapolateType;
  extrapolateRight?: ExtrapolateType;
};

export const interpolate = (
  value: FluidValue,
  inputRange: Array<number>,
  outputRange: Array<number> | Array<string>,
  extrapolateConfig?: ExtrapolateConfig
) => value.interpolate(inputRange, outputRange, extrapolateConfig);
