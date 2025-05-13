export type DriverConfig = {
  type: 'spring' | 'timing' | 'decay';
  to?: number;
  options?: {
    duration?: number;
    easing?: (t: number) => number;
    stiffness?: number;
    damping?: number;
    mass?: number;
    velocity?: number;
    onStart?: () => void;
    onChange?: (v: string | number) => void;
    onComplete?: () => void;
  };
};

export type ToValue<V> = DriverConfig | V;
