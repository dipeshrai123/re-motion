import { v5 } from '@raidipesh78/re-motion';
import { useDrag } from '@use-gesture/react';
import { useState } from 'react';

const { motion, spring, timing, useFluidValue, interpolate, decay } = v5;

export default function Version5() {
  const [, setRe] = useState(0);
  const progress = useFluidValue(100);
  const x = useFluidValue(0);

  console.log('RE-RENDER');

  const bind: any = useDrag(({ offset: [mx] }) => {
    spring(x, mx);
  });

  return (
    <>
      <button onClick={() => spring(progress, 500)}>Spring</button>
      <button onClick={() => timing(progress, 100, { duration: 5000 })}>
        Timing
      </button>
      <button onClick={() => decay(progress, 20)}>Decay</button>
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
          height: x.to([0, 500], [100, 200]),
          transform: x.to([0, 500], [0, 360]).to((v) => `rotate(${v}deg)`),
          border: interpolate(
            x,
            [0, 500],
            ['0px solid red', '10px solid #3399ffff']
          ),
          backgroundColor: interpolate(x, [0, 500], ['#3399ff', 'yellow']),
          position: x.to((v) => (v > 100 ? 'absolute' : 'relative')),
          left: x,
        }}
      />
    </>
  );
}
