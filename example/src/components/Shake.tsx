import {
  motion,
  sequence,
  MotionValue,
  timing,
  loop,
} from '@raidipesh78/re-motion';
import { useEffect, useRef } from 'react';

const duration = 1000;

export default function Example() {
  const rotate = useRef(new MotionValue(-20)).current;

  useEffect(() => {
    rotate.set(0);
  }, [rotate])

  return (
    <>
      <button
        onClick={() => {
          sequence([
            timing(rotate, -20, { duration }),
            loop(
              sequence([
                timing(rotate, 20, { duration }),
                timing(rotate, -20, { duration }),
              ]),
              4
            ),
            timing(rotate, 0, { duration }),
          ]).start();
        }}
      >
        Shake
      </button>
      <motion.div
        style={{
          width: 100,
          height: 100,
          backgroundColor: 'red',
          rotate,
        }}
      />
    </>
  );
}
