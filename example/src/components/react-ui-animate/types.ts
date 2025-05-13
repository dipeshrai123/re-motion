export type DriverConfig = {
  type: 'spring' | 'timing' | 'decay';
  to?: number;
  options?: {
    duration?: number;
    stiffness?: number;
    damping?: number;
    mass?: number;
    velocity?: number;
    onComplete?: () => void;
  };
};

export type ToValue<V> = DriverConfig | V;
