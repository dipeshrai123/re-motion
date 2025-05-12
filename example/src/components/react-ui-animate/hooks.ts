import { MotionValue, useMotionValue } from '@raidipesh78/re-motion';
import { useCallback, useRef } from 'react';
import { DriverConfig, ToValue } from './types';

export function useValue<V extends number | string>(initialValue: V) {
  const animation = useMotionValue<V>(initialValue);
  const previousTo = useRef<number | string | null>(null);

  const doSet = useCallback(
    (u: ToValue<V>) => {
      if (
        u !== null &&
        typeof u === 'object' &&
        'driver' in u &&
        typeof u.to === 'number'
      ) {
        const { driver, to, ...cfg } = u as DriverConfig;
        if (previousTo.current !== to) {
          driver(animation as MotionValue<number>, to, cfg).start();
          previousTo.current = to;
        }
      } else {
        animation.set(u as V);
        previousTo.current = u as number | string;
      }
    },
    [animation]
  );

  return {
    get value(): MotionValue<V> {
      return animation;
    },
    set value(u: MotionValue<V> | ToValue<V>) {
      if (u instanceof MotionValue) return;
      doSet(u);
    },
    get currentValue(): V {
      return animation.current;
    },
  };
}
