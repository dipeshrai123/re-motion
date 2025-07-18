import { MotionValue } from './MotionValue';

export function cancelAnimator<T>(mv: MotionValue<T>) {
  mv.value = mv.value;
}
