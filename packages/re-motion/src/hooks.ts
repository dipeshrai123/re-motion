import { useRef } from 'react';

import { MotionValue } from './MotionValue';

export function useMotionValue<T = number>(initial: T): MotionValue<T> {
  const ref = useRef<MotionValue<T> | null>(null);
  if (ref.current === null) ref.current = new MotionValue(initial);
  return ref.current;
}
