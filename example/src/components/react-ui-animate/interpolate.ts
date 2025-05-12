import { MotionValue } from '@raidipesh78/re-motion';

export function bInterpolate(
  input: MotionValue<number>,
  outMin: number,
  outMax: number
): MotionValue<number>;
export function bInterpolate(
  input: MotionValue<number>,
  outMin: string,
  outMax: string
): MotionValue<string>;
export function bInterpolate(
  input: MotionValue<number>,
  outMin: number | string,
  outMax: number | string
): MotionValue<number> | MotionValue<string> {
  if (typeof outMin === 'number' && typeof outMax === 'number') {
    return input.to([0, 1], [outMin, outMax]);
  } else if (typeof outMin === 'string' && typeof outMax === 'string') {
    return input.to([0, 1], [outMin, outMax]);
  }
  throw new Error(
    'bInterpolate: outMin and outMax must be both numbers or both strings'
  );
}
