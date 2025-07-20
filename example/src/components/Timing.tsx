import {
  createMotionValue,
  withTiming,
  motion,
  withSpring,
  withDecay,
  cancelMotionValue,
  withRepeat,
  withSequence,
  withDelay,
} from '@raidipesh78/re-motion';
import { useRef } from 'react';

export default function Example() {
  const x = useRef(createMotionValue(0)).current;

  return (
    <>
      <button onClick={() => cancelMotionValue(x)}>Cancel Animation</button>
      <button onClick={() => x.set(300)}>SET IMMEDIATE 300</button>
      <button onClick={() => x.set(withTiming(100))}>TIMING to 100</button>
      <button onClick={() => x.set(withSpring(0))}>SPRING to 0</button>
      <button onClick={() => x.set(withRepeat(withSpring(200), 4, true))}>
        Loop 0 - 200
      </button>
      <button
        onClick={() =>
          x.set(
            withSequence(
              withTiming(200),
              withSpring(50),
              withDecay({ velocity: 1 })
            )
          )
        }
      >
        Sequence
      </button>
      <button onClick={() => x.set(withDecay({ velocity: 1 }))}>Decay</button>
      <button onClick={() => x.set(withDelay(1000, withSpring(400)))}>
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
