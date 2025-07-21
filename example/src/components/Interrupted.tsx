import {
  createMotionValue,
  spring,
  timing,
  decay,
  sequence,
  repeat,
  motion,
} from '@raidipesh78/re-motion';
import { useRef } from 'react';

export default function Version5() {
  const x = useRef(createMotionValue(0)).current;

  return (
    <>
      <button
        onClick={() => {
          x.set(spring(400, { damping: 10 }));
        }}
      >
        Spring
      </button>
      <button
        onClick={() => {
          x.set(timing(0));
        }}
      >
        Timing
      </button>
      <button
        onClick={() => {
          x.set(decay({ velocity: 1 }));
        }}
      >
        Decay
      </button>
      <button
        onClick={() => {
          x.set(sequence([timing(100), spring(200)]));
        }}
      >
        Sequence
      </button>
      <button
        onClick={() => {
          x.set(repeat(spring(250), 5));
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
