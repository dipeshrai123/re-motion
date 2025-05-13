export type DriverConfig = {
  type: 'spring' | 'timing' | 'decay';
  to?: number;
  duration?: number;
  stiffness?: number;
  damping?: number;
  mass?: number;
  velocity?: number;
  options?: { onComplete?: () => void };
};

export type ToValue<V> = DriverConfig | V;
