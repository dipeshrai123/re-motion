export { FluidValue } from './fluids/FluidValue';
export { makeFluid } from './fluids/makeFluid';
export { fluid } from './fluids/tags';
export { Easing } from './easing/Easing';
export { interpolate } from './controllers/interpolate';

// animation controllers
export { timing, spring, decay } from './controllers';

// hooks
export { useFluidValue } from './hooks/useFluidValue';
export { useMount } from './hooks/useMount';

// types
export type { UseFluidValueConfig } from './hooks/useFluidValue';
export type { UseMountConfig } from './hooks/useMount';
export type { ExtrapolateConfig } from './controllers/interpolate';
