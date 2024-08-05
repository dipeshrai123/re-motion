import { FluidValue } from '../fluids/FluidValue';
import { timing } from './timing';

import type { ControllerAnimation } from './types';

export const delay = function (time: number): ControllerAnimation {
  return timing(new FluidValue(0), { toValue: 0, delay: time, duration: 0 });
};
