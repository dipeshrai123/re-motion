import {
  createMotionValue,
  withTiming,
  withRepeat,
  withSequence,
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
          progress.value = withSequence(
            withTiming(-20, { duration: 100, easing: EASING }),
            withRepeat(
              withTiming(20, { duration: 100, easing: EASING }),
              6,
              true
            ),
            withTiming(0, { duration: 100, easing: EASING })
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
