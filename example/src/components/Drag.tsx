import { useMotionValue, spring, motion } from '@raidipesh78/re-motion';
import { useDrag } from '@use-gesture/react';

export default function Drag() {
  const translateX = useMotionValue(0);

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
