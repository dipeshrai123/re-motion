export type DriverConfig = {
  type: 'spring' | 'timing' | 'decay' | 'sequence' | 'delay' | 'loop';
  to?: number;
  options?: {
    controller?: DriverConfig;
    iterations?: number;
    delay?: number;
    duration?: number;
    easing?: (t: number) => number;
    stiffness?: number;
    damping?: number;
    mass?: number;
    velocity?: number;
    steps?: DriverConfig[];
    onStart?: () => void;
    onChange?: (v: string | number) => void;
    onComplete?: () => void;
  };
};

export type ToValue<V> = DriverConfig | V;
