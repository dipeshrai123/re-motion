import { MotionValue, spring, motion } from '@raidipesh78/re-motion';
import { useDrag } from '@use-gesture/react';
import { useRef } from 'react';

export default function Drag() {
  const translateX = useRef(new MotionValue(0)).current;

  const bind: any = useDrag(({ offset: [ox] }) => {
    spring(translateX, ox).start();
  });

  return (
    <motion.div
      {...bind()}
      style={{
        width: 100,
        height: 100,
        backgroundColor: 'red',
        translateX: translateX,
      }}
    />
  );
}
