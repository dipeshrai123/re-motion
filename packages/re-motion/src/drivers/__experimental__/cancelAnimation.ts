import { MotionValue } from './MotionValue';

export function cancelAnimation<T>(mv: MotionValue<T>) {
  mv.value = mv.value;
}
