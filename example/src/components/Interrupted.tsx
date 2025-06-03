import {
  MotionValue,
  spring,
  timing,
  motion,
  sequence,
  decay,
  loop,
} from '@raidipesh78/re-motion';
import { useRef } from 'react';

export default function Version5() {
  const x = useRef(new MotionValue(0)).current;

  return (
    <>
      <button onClick={() => spring(x, 400, { damping: 10 }).start()}>
        Spring
      </button>
      <button onClick={() => timing(x, 0).start()}>Timing</button>
      <button onClick={() => decay(x, 1).start()}>Decay</button>
      <button
        onClick={() => sequence([timing(x, 100), spring(x, 200)]).start()}
      >
        Sequence
      </button>
      <button onClick={() => loop(spring(x, 250), 5).start()}>Loop</button>
      <motion.div
        style={{
          width: 100,
          height: 100,
          backgroundColor: 'teal',
          translateX: x.to([0, 100], [0, 100], { extrapolate: 'clamp' }),
        }}
      />
    </>
  );
}
