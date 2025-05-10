import { v5 } from '@raidipesh78/re-motion';
import { useDrag } from '@use-gesture/react';
import { useState } from 'react';

const { motion, spring, timing, useFluidValue, interpolate, decay, combine } =
  v5;

export default function Version5() {
  const [, setRe] = useState(0);
  const progress = useFluidValue(100);
  const x = useFluidValue(0);
  const position = useFluidValue<'relative' | 'absolute'>('relative');
  const obj = useFluidValue({ x: 10 });

  const bind: any = useDrag(({ offset: [mx] }) => {
    spring(x, mx);
  });

  return (
    <>
      <button onClick={() => setRe((p) => p + 1)}>Re-Render</button>
      <button
        onClick={() => {
          obj.set({ x: 200 });
          // console.log(obj);
        }}
      >
        Update object
      </button>
      <br />
      <button onClick={() => spring(progress, 500)}>Spring</button>
      <button onClick={() => timing(progress, 100, { duration: 5000 })}>
        Timing
      </button>
      <button onClick={() => decay(progress, 20)}>Decay</button>
      <motion.div
        style={{
          width: progress,
          height: 100,
          backgroundColor: 'red',
        }}
      />

      <button
        onClick={() => {
          position.set('absolute');
        }}
      >
        Make Absolute
      </button>

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
          // position: x.to((v) => (v > 100 ? 'absolute' : 'relative')), // conditional
          position,
          left: x,
        }}
      />

      <motion.div
        style={{
          width: 100,
          height: 100,
          backgroundColor: 'teal',
          // transform: combine([x], (x) => `translateX(${x}px)`),
          translateX: x,
          // translateY: x,
          rotateX: combine([x], (x) => `${x}deg`),
        }}
      >
        {/* FOLLOW {x.to((v) => `${v}px`)} */}
        FOLLOW
      </motion.div>
    </>
  );
}
