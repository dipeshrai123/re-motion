import { spring, timing } from '@raidipesh78/re-motion';
import { DriverConfig } from './types';

export const withSpring = (to: number): DriverConfig => ({
  driver: spring,
  to,
  stiffness: 100,
  damping: 10,
  mass: 1,
});

export const withTiming = (to: number): DriverConfig => ({
  driver: timing,
  to,
  duration: 500,
});
