import {
  createMotionValue,
  timing,
  motion,
  spring,
  decay,
  cancelMotionValue,
  repeat,
  sequence,
  delay,
} from '@raidipesh78/re-motion';
import { useRef } from 'react';

export default function Example() {
  const x = useRef(createMotionValue(0)).current;

  return (
    <>
      <button onClick={() => cancelMotionValue(x)}>Cancel Animation</button>
      <button onClick={() => x.set(300)}>SET IMMEDIATE 300</button>
      <button onClick={() => x.set(timing(100))}>TIMING to 100</button>
      <button onClick={() => x.set(spring(0))}>SPRING to 0</button>
      <button onClick={() => x.set(repeat(spring(200), 4, true))}>
        Loop 0 - 200
      </button>
      <button
        onClick={() =>
          x.set(sequence(timing(200), spring(50), decay({ velocity: 1 })))
        }
      >
        Sequence
      </button>
      <button onClick={() => x.set(decay({ velocity: 1 }))}>Decay</button>
      <button onClick={() => x.set(delay(1000, spring(400)))}>
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
