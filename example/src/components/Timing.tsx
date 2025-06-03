import { Easing, motion, spring, MotionValue } from '@raidipesh78/re-motion';
import { useRef } from 'react';

export default function Example() {
  const translateX = useRef(new MotionValue(0)).current;

  return (
    <>
      <button onClick={() => spring(translateX, 0).start()}>
        Animate left
      </button>
      <button onClick={() => spring(translateX, 300).start()}>
        Animate right
      </button>
      <motion.div
        style={{
          width: 100,
          height: 100,
          backgroundColor: 'red',
          translateX: translateX.to([0, 300], ['0px', '300px'], {
            easing: Easing.bounce,
          }),
        }}
      />
    </>
  );
}
