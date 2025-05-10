import { __experimental__v5 } from '@raidipesh78/re-motion';
import { useDrag } from '@use-gesture/react';
// import { useMemo, useState } from 'react';

const { useMotionValue, spring, timing, motion, sequence, decay, combine } =
  __experimental__v5;

export default function Version5() {
  // const [, setRe] = useState(0);
  // const position = useMotionValue<'relative' | 'absolute'>('relative');
  // const obj = useMotionValue({ x: 10 });
  const moveX = useMotionValue(0);

  const bind: any = useDrag(({ offset: [mx] }) => {
    const ctrl = spring(moveX, mx);

    if (mx > 200) {
      ctrl.pause();
    }
  });
  // const progress = useMotionValue(100);
  const x = useMotionValue(0);

  return (
    <>
      {/* <button onClick={() => spring(progress, 500)}>Spring</button>
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
      /> */}

      {/* <button onClick={() => setRe((p) => p + 1)}>Re-Render</button> */}
      {/* <button
        onClick={() => {
          obj.set({ x: 200 });
          // console.log(obj);
        }}
      >
        Update object
      </button>
      <br />
      

      <button
        onClick={() => {
          position.set('absolute');
        }}
      >
        Make Absolute
      </button> */}

      {/* <motion.div
        {...bind()}
        style={{
          width: 100,
          height: x.to([0, 500], [100, 200]),
          // transform: x.to([0, 500], [0, 360]).to((v) => `rotate(${v}deg)`),
          border: interpolate(
            x,
            [0, 500],
            ['0px solid red', '10px solid #3399ffff']
          ),
          backgroundColor: interpolate(x, [0, 500], ['#3399ff', 'yellow']),
          // position: x.to((v) => (v > 100 ? 'absolute' : 'relative')), // conditional
          position,
          left: x,
          rotate: x.to([0, 500], [0, 360]),
        }}
      /> */}

      {/* <button onClick={() => spring(x, 0)}>Click</button>

       */}

      <motion.div
        {...bind()}
        style={{
          width: 100,
          height: 100,
          backgroundColor: 'red',
          // transform: combine([x], (x) => `translateX(${x}px)`),
          translateX: moveX,
          // translateY: x,
          rotateZ: combine([moveX], (moveX) => `${moveX}deg`),
        }}
      />

      <button
        onClick={() => {
          sequence([
            { driver: spring, mv: x, to: 300, opts: { damping: 10 } },
            { driver: timing, mv: x, to: 100 },
            { driver: decay, mv: x, velocity: 40 },
          ]);
        }}
      >
        RUN ANIMATION
      </button>

      <motion.div
        style={{
          width: 100,
          height: 100,
          backgroundColor: 'teal',
          translateX: x,
        }}
      >
        FOLLOW
      </motion.div>
    </>
  );
}
