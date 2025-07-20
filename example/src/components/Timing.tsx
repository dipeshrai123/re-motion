import {
  createMotionValue,
  withTiming,
  motion,
  withSpring,
  withDecay,
  cancelAnimator,
  withRepeat,
  withSequence,
  withDelay,
} from '@raidipesh78/re-motion';
import { useRef } from 'react';

export default function Example() {
  const x = useRef(createMotionValue(0)).current;

  return (
    <>
      <button onClick={() => cancelAnimator(x)}>Cancel Animation</button>
      <button onClick={() => (x.value = 300)}>SET IMMEDIATE 300</button>
      <button onClick={() => (x.value = withTiming(100))}>TIMING to 100</button>
      <button onClick={() => (x.value = withSpring(0))}>SPRING to 0</button>
      <button onClick={() => (x.value = withRepeat(withSpring(200), 4, true))}>
        Loop 0 - 200
      </button>
      <button
        onClick={() =>
          (x.value = withSequence(
            withTiming(200),
            withSpring(50),
            withDecay({ velocity: 1 })
          ))
        }
      >
        Sequence
      </button>
      <button onClick={() => (x.value = withDecay({ velocity: 1 }))}>
        Decay
      </button>
      <button onClick={() => (x.value = withDelay(1000, withSpring(400)))}>
        Delay 200 then start spring
      </button>
      <motion.div
        style={{
          width: 100,
          height: 100,
          backgroundColor: x.to([0, 100], ['teal', 'red']),
          borderRadius: 4,
          translateX: x,
        }}
      />
    </>
  );
}
