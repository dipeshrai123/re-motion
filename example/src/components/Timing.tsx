import { __experimental__ } from '@raidipesh78/re-motion';
import { useRef } from 'react';

const {
  createMotionValue,
  withTiming,
  createMotionComponent,
  withSpring,
  withDecay,
  cancelAnimation,
  withRepeat,
  withSequence,
  withDelay,
} = __experimental__;

const Div = createMotionComponent('div');

export default function Example() {
  const x = useRef(createMotionValue(0)).current;

  return (
    <>
      <button onClick={() => cancelAnimation(x)}>Cancel Animation</button>
      <button onClick={() => (x.value = withTiming(100))}>TIMING to 100</button>
      <button onClick={() => (x.value = withSpring(0))}>SPRING to 0</button>
      <button onClick={() => (x.value = withRepeat(withTiming(200), 2, true))}>
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
      <Div
        style={{
          width: 100,
          height: 100,
          backgroundColor: 'teal',
          borderRadius: 4,
          translateX: x,
        }}
      />
    </>
  );
}
