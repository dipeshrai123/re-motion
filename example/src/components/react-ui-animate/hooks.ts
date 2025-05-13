import {
  decay,
  MotionValue,
  spring,
  timing,
  useMotionValue,
} from '@raidipesh78/re-motion';
import { useCallback, useEffect, useRef } from 'react';
import { DriverConfig, ToValue } from './types';

export function useValue<V extends number | string>(initialValue: V) {
  const animation = useMotionValue<V>(initialValue);
  const previousTo = useRef<number | string | null>(null);
  const unsubscribeRef = useRef<() => void>();

  const doSet = useCallback(
    (u: ToValue<V>) => {
      unsubscribeRef.current?.();
      unsubscribeRef.current = undefined;

      if (u !== null && typeof u === 'object') {
        const { type, to, options } = u as DriverConfig;

        const { onChange, ...restOptions } = options;

        if (typeof onChange === 'function') {
          unsubscribeRef.current = animation.subscribe(onChange);
        }

        if (previousTo.current !== to) {
          if (type === 'spring') {
            spring(animation as MotionValue<number>, to, restOptions).start();
          } else if (type === 'timing') {
            timing(animation as MotionValue<number>, to, restOptions).start();
          } else if (type === 'decay') {
            const { velocity, ...rest } = restOptions;
            decay(animation as MotionValue<number>, velocity, rest).start();
          }

          previousTo.current = to;
        }
      } else {
        animation.set(u as V);
        previousTo.current = u as number | string;
      }
    },
    [animation]
  );

  useEffect(() => {
    return () => {
      unsubscribeRef.current?.();
      unsubscribeRef.current = undefined;
    };
  }, []);

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
