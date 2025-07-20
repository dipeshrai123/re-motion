import { useDrag } from '@use-gesture/react';
import { useRef } from 'react';
import { createMotionValue, spring, motion } from '@raidipesh78/re-motion';

export default function Drag() {
  const translateX = useRef(createMotionValue(0)).current;

  const bind: any = useDrag(({ offset: [ox] }) => {
    translateX.set(spring(ox));
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
