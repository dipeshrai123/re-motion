export type DriverConfig = {
  type: 'spring' | 'timing' | 'decay' | 'sequence' | 'delay';
  to?: number;
  options?: {
    delay?: number;
    duration?: number;
    easing?: (t: number) => number;
    stiffness?: number;
    damping?: number;
    mass?: number;
    velocity?: number;
    onStart?: () => void;
    onChange?: (v: string | number) => void;
    onComplete?: () => void;
    steps?: DriverConfig[];
  };
};

export type ToValue<V> = DriverConfig | V;
