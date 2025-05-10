import { v5 } from '@raidipesh78/re-motion';
import { useDrag } from '@use-gesture/react';
import { useState } from 'react';

const { motion, spring, timing, useFluidValue, interpolate } = v5;

export default function Version5() {
  const [, setRe] = useState(0);
  const progress = useFluidValue(100);
  const x = useFluidValue(0);

  console.log('RE-RENDER');

  const bind: any = useDrag(({ movement: [mx] }) => {
    spring(x, mx);
  });

  return (
    <>
      <button onClick={() => spring(progress, 500)}>INCREASE</button>
      <button onClick={() => timing(progress, 100, { duration: 5000 })}>
        DECREASE
      </button>
      <button onClick={() => setRe((p) => p + 1)}>Re-Render</button>
      <motion.div
        style={{
          width: progress,
          height: 100,
          backgroundColor: 'red',
        }}
      />

      <motion.div
        {...bind()}
        style={{
          width: 100,
          height: 100,
          backgroundColor: interpolate(x, [0, 500], ['red', 'blue']),
          border: '0px solid purple',
          borderWidth: interpolate(x, [0, 500], [0, 10]),
          position: 'relative',
          left: x,
        }}
      />
    </>
  );
}
