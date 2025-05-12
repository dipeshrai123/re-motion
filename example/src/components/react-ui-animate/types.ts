import { MotionValue } from '@raidipesh78/re-motion';

export type DriverConfig = {
  driver: (
    mv: MotionValue<number>,
    to: number,
    opts?: any
  ) => { start(): void };
  to: number;
  duration?: number;
  stiffness?: number;
  damping?: number;
  mass?: number;
};

export type ToValue<V> = DriverConfig | V;
