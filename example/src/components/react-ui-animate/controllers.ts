import { DriverConfig } from './types';

export const withSpring = (
  to: number,
  options?: DriverConfig['options']
): DriverConfig => {
  return {
    type: 'spring',
    to,
    options: {
      stiffness: options?.stiffness ?? 100,
      damping: options?.damping ?? 10,
      mass: options?.mass ?? 1,
      onComplete: options?.onComplete,
    },
  };
};

export const withTiming = (
  to: number,
  options?: DriverConfig['options']
): DriverConfig => ({
  type: 'timing',
  to,
  options: {
    duration: options?.duration ?? 300,
    onComplete: options?.onComplete,
  },
});

export const withDecay = (options?: DriverConfig['options']): DriverConfig => ({
  type: 'decay',
  options: {
    velocity: options?.velocity ?? 0,
    onComplete: options?.onComplete,
  },
});
