import { __experimental__ } from '@raidipesh78/re-motion';
import { useRef } from 'react';

const {
  createMotionValue,
  withSpring,
  withTiming,
  withDecay,
  withSequence,
  withRepeat,
  motion,
} = __experimental__;

export default function Version5() {
  const x = useRef(createMotionValue(0)).current;

  return (
    <>
      <button
        onClick={() => {
          x.value = withSpring(400, { damping: 10 });
        }}
      >
        Spring
      </button>
      <button
        onClick={() => {
          x.value = withTiming(0);
        }}
      >
        Timing
      </button>
      <button
        onClick={() => {
          x.value = withDecay({ velocity: 1 });
        }}
      >
        Decay
      </button>
      <button
        onClick={() => {
          x.value = withSequence(withTiming(100), withSpring(200));
        }}
      >
        Sequence
      </button>
      <button
        onClick={() => {
          x.value = withRepeat(withSpring(250), 5);
        }}
      >
        Loop
      </button>
      <motion.div
        style={{
          width: 100,
          height: 100,
          backgroundColor: 'teal',
          translateX: x,
        }}
      />
    </>
  );
}
