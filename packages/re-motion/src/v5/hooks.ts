import { useRef } from 'react';
import { fluidValue, FluidValue } from './value';

export function useFluidValue<T = number>(initial: T): FluidValue<T> {
  const ref = useRef<FluidValue<T> | null>(null);
  if (ref.current === null) ref.current = fluidValue(initial);
  return ref.current;
}
