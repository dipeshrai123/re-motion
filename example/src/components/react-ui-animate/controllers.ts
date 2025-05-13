import { DriverConfig } from './types';

interface WithSpringOptions {
  mass?: number;
  stiffness?: number;
  damping?: number;
  onComplete?: () => void;
}

export const withSpring = (
  to: number,
  options?: WithSpringOptions
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

interface WithTimingOptions {
  duration?: number;
  onComplete?: () => void;
}

export const withTiming = (
  to: number,
  options?: WithTimingOptions
): DriverConfig => ({
  type: 'timing',
  to,
  options: {
    duration: options?.duration ?? 300,
    onComplete: options?.onComplete,
  },
});

interface WithDecayOptions {
  velocity: number;
  onComplete?: () => void;
}

export const withDecay = (options: WithDecayOptions): DriverConfig => ({
  type: 'decay',
  options: {
    velocity: options.velocity,
    onComplete: options?.onComplete,
  },
});
