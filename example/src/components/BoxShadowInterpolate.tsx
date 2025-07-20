import { createMotionValue, withSpring, motion } from '@raidipesh78/re-motion';
import { useRef } from 'react';

export default function BoxShadowInterpolate() {
  const progress = useRef(createMotionValue(0)).current;

  return (
    <div>
      <button onClick={() => (progress.value = withSpring(1))}>Animate</button>

      <motion.div
        style={{
          width: 100,
          height: 100,
          backgroundColor: 'teal',
          borderRadius: 4,
          boxShadow: progress.to(
            [0, 1],
            [
              '0px 0px 0px rgba(0, 0, 0, 0)',
              '10px 10px 20px rgba(0, 0, 0, 0.5)',
            ]
          ),
        }}
      />
    </div>
  );
}
