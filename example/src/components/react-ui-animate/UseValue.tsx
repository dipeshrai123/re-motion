import {
  motion,
  spring,
  timing,
  useMotionValue,
  type MotionValue,
} from '@raidipesh78/re-motion';

import { useCallback } from 'react';

const animated = motion;

export function useValue(initialValue: number | string) {
  // Create (or reuse) a MotionValue under the hood
  const animation = useMotionValue<number | string>(initialValue);

  // This is the same updater you had before
  const updateValue = useCallback(
    (to: any) => {
      // const { controller, callback } = getToValue(to)(animation);
      // controller.start(callback);
      if (to.type === 'spring' && typeof to.to === 'number') {
        spring(animation as MotionValue<number>, to.to).start();
      } else if (to.type === 'timing' && typeof to.to === 'number') {
        timing(animation as MotionValue<number>, to.to).start();
      } else if (typeof to === 'string') {
        animation.set(to);
      }
    },
    [animation]
  );

  return {
    // When you write `width.value = ...`, we kick off an animation
    set value(to: any) {
      updateValue(to);
    },

    // When you read `width.value`, you get the raw MotionValue
    get value() {
      return animation as any;
    },

    // And here's the current numeric/string value
    get currentValue(): number | string {
      return animation.current; // MotionValue.current :contentReference[oaicite:2]{index=2}:contentReference[oaicite:3]{index=3}
    },
  };
}

const withSpring = (value: number) => {
  return {
    type: 'spring',
    stiffness: 100,
    damping: 10,
    mass: 1,
    to: value,
  };
};

const withTiming = (value: number) => {
  return {
    type: 'timing',
    duration: 500,
    to: value,
  };
};

export default function Example() {
  const x = useValue(0);
  const position = useValue('relative');

  return (
    <>
      <button onClick={() => (x.value = withSpring(100))}>
        ANIMATE SPRING
      </button>
      <button onClick={() => (x.value = withTiming(0))}>ANIMATE TIMING</button>
      <button onClick={() => (position.value = 'absolute')}>
        MAKE ABSOLUTE
      </button>
      <animated.div
        style={{
          width: 100,
          height: 100,
          backgroundColor: 'teal',
          translateX: x.value,
          position: position.value,
        }}
      />
    </>
  );
}
