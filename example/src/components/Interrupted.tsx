import {
  createMotionValue,
  withSpring,
  withTiming,
  withDecay,
  withSequence,
  withRepeat,
  motion,
} from '@raidipesh78/re-motion';
import { useRef } from 'react';

export default function Version5() {
  const x = useRef(createMotionValue(0)).current;

  return (
    <>
      <button
        onClick={() => {
          x.set(withSpring(400, { damping: 10 }));
        }}
      >
        Spring
      </button>
      <button
        onClick={() => {
          x.set(withTiming(0));
        }}
      >
        Timing
      </button>
      <button
        onClick={() => {
          x.set(withDecay({ velocity: 1 }));
        }}
      >
        Decay
      </button>
      <button
        onClick={() => {
          x.set(withSequence(withTiming(100), withSpring(200)));
        }}
      >
        Sequence
      </button>
      <button
        onClick={() => {
          x.set(withRepeat(withSpring(250), 5));
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
