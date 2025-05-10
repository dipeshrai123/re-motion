import { MotionValue } from './value';

export function isMotionValue(v: any): v is MotionValue<any> {
  return v != null && typeof v.subscribe === 'function';
}
