import { __experimental__, Easing } from '@raidipesh78/re-motion';
import { useRef } from 'react';

const { createMotionValue, withTiming, createMotionComponent, withSpring } =
  __experimental__;

const Div = createMotionComponent('div');

export default function Example() {
  const x = useRef(createMotionValue(0)).current;

  return (
    <>
      <button onClick={() => (x.value = withTiming(100))}>TIMING to 100</button>
      <button onClick={() => (x.value = withSpring(0))}>SPRING to 0</button>
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
