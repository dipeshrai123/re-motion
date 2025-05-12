import {
  MotionValue,
  spring,
  timing,
  useMotionValue,
  motion,
} from '@raidipesh78/re-motion';
import { useCallback, useRef } from 'react';

type DriverConfig = {
  driver: (
    mv: MotionValue<number>,
    to: number,
    opts?: any
  ) => { start(): void };
  to: number;
  duration?: number;
  stiffness?: number;
  damping?: number;
  mass?: number;
};

type ToValue<V> = DriverConfig | V;

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

const withSpring = (to: number): DriverConfig => ({
  driver: spring,
  to,
  stiffness: 100,
  damping: 10,
  mass: 1,
});

const withTiming = (to: number): DriverConfig => ({
  driver: timing,
  to,
  duration: 500,
});

export default function Example() {
  const x = useValue(0);
  const pos = useValue<'relative' | 'absolute'>('relative');

  return (
    <>
      <button onClick={() => (x.value = withSpring(100))}>
        ANIMATE SPRING
      </button>
      <button onClick={() => (x.value = withTiming(0))}>ANIMATE TIMING</button>
      <button
        onClick={() => {
          pos.value = pos.currentValue === 'relative' ? 'absolute' : 'relative';
        }}
      >
        MAKE ABSOLUTE
      </button>

      <motion.div
        style={{
          width: 100,
          height: 100,
          backgroundColor: 'teal',
          translateX: x.value,
          position: pos.value,
        }}
      />
    </>
  );
}
