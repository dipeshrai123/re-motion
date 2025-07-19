import { MotionValue } from './MotionValue';

export function isMotionValue<T>(v: any): v is MotionValue<T> {
  return v != null && typeof (v as MotionValue<T>).onChange === 'function';
}
