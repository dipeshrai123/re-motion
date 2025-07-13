import { MotionValue, spring, motion, timing } from '@raidipesh78/re-motion';
import { useRef } from 'react';

export default function Example() {
  const translateX = useRef(new MotionValue(0)).current;

  return (
    <>
      <button onClick={() => timing(translateX, 100).start()}>TO 100</button>
      <button onClick={() => timing(translateX, 0).start()}>TO 0</button>
      <button onClick={() => spring(translateX, 200, { from: 50 }).start()}>
        FROM 50 TO 200
      </button>

      <motion.div
        style={{
          width: 100,
          height: 100,
          borderRadius: 4,
          backgroundColor: 'teal',
          translateX,
        }}
      />
    </>
  );
}
