import { v5 } from '@raidipesh78/re-motion';

const { fluidValue, motion, spring } = v5;

export default function Version5() {
  const progress = fluidValue(0);

  return (
    <motion.div
      onClick={() => spring(progress, 100)}
      style={{
        width: progress,
        height: 100,
        backgroundColor: 'red',
      }}
    ></motion.div>
  );
}
