import { EndCallback } from '../animations/FluidAnimation';

export type ControllerAnimation = {
  start: (callback?: EndCallback) => void;
  stop: () => void;
  reset: () => void;
};
