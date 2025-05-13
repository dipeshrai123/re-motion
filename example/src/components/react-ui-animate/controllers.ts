import { DriverConfig } from './types';

export const withSpring = (
  to: number,
  options?: { onComplete?: () => void }
): DriverConfig => ({
  type: 'spring',
  to,
  stiffness: 100,
  damping: 10,
  mass: 1,
  options,
});

export const withTiming = (
  to: number,
  options?: { onComplete?: () => void }
): DriverConfig => ({
  type: 'timing',
  to,
  duration: 500,
  options,
});

export const withDecay = (options?: {
  onComplete?: () => void;
}): DriverConfig => ({
  type: 'decay',
  velocity: 20,
  options,
});
