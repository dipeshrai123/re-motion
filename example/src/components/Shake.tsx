import {
  createMotionValue,
  timing,
  repeat,
  sequence,
  motion,
  Easing,
} from '@raidipesh78/re-motion';
import { useRef } from 'react';

const EASING = Easing.elastic(1.5);

export default function Example() {
  const progress = useRef(createMotionValue(0)).current;

  return (
    <div>
      <button
        onClick={() => {
          progress.set(
            sequence([
              timing(-20, { duration: 100, easing: EASING }),
              repeat(timing(20, { duration: 100, easing: EASING }), 6, true),
              timing(0, { duration: 100, easing: EASING }),
            ])
          );
        }}
      >
        Animate
      </button>

      <motion.div
        style={{
          width: 100,
          height: 100,
          backgroundColor: 'teal',
          borderRadius: 4,
          rotate: progress,
        }}
      />
    </div>
  );
}
