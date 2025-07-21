import { useMemo } from 'react';
import { createMotionValue, MotionValue } from '@raidipesh78/re-motion';

import type { Primitive } from './types';

type Widen<T> = T extends number ? number : T extends string ? string : T;

type ValueReturn<T> = T extends Primitive
  ? MotionValue<Widen<T>>
  : T extends Primitive[]
  ? MotionValue<Widen<Primitive>>[]
  : { [K in keyof T]: MotionValue<Widen<T[K]>> };

type Base = Primitive | Primitive[] | Record<string, Primitive>;

export function useValue<T extends Base>(
  initial: T
): [ValueReturn<T>, (to: any) => void] {
  const value = useMemo(() => {
    if (Array.isArray(initial)) {
      return initial.map((v) => createMotionValue(v));
    }

    if (typeof initial === 'object') {
      return Object.fromEntries(
        Object.entries(initial).map(([k, v]) => [k, createMotionValue(v)])
      );
    }

    return createMotionValue(initial);
  }, [initial]) as ValueReturn<T>;

  function set(to: any) {
    if (Array.isArray(initial)) {
    } else if (typeof initial === 'object') {
    } else {
      handlePrimitive(value as MotionValue<Primitive>, to as any);
    }
  }

  return [value, set] as any;
}

let subs: any;

function handlePrimitive(mv: MotionValue<Primitive>, to: any) {
  subs?.();
  to.cbs?.onStart?.();
  subs = mv.onChange((v) => to.cbs?.onChange?.(v));
  mv.set(to.ctrl);
}
