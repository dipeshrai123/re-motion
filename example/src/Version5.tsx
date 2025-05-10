import { __experimental__v5 } from '@raidipesh78/re-motion';

const { useMotionValue, spring, timing, motion, sequence, decay, combine } =
  __experimental__v5;

export default function Version5() {
  // const position = useMotionValue<'relative' | 'absolute'>('relative');
  // const obj = useMotionValue({ x: 10 });

  const springX = useMotionValue(0);
  const springMove = spring(springX, 500, {
    damping: 8,
    stiffness: 200,
    onStart: () => console.log('SPRING ONLY START'),
    onPause: () => console.log('SPRING ONLY PAUSE'),
    onResume: () => console.log('SPRING ONLY RESUME'),
    onComplete: () => console.log('SPRING ONLY COMPLETE'),
  });

  const timingX = useMotionValue(0);
  const timingMove = timing(timingX, 500, {
    duration: 5000,
    onStart: () => console.log('TIMING ONLY START'),
    onPause: () => console.log('TIMING ONLY PAUSE'),
    onResume: () => console.log('TIMING ONLY RESUME'),
    onComplete: () => console.log('TIMING ONLY COMPLETE'),
  });

  const sequenceX = useMotionValue(0);
  const sequenceMove = sequence([
    {
      driver: spring,
      mv: sequenceX,
      to: 300,
      opts: {
        damping: 8,
        stiffness: 200,
        onComplete: () => console.log('SPRING DONE'),
      },
    },
    {
      driver: timing,
      mv: sequenceX,
      to: 100,
      opts: {
        onStart: () => console.log('TIMING STARTED'),
        onComplete: () => console.log('TIMING DONE'),
      },
    },
    {
      driver: decay,
      mv: sequenceX,
      velocity: 40,
      opts: { onComplete: () => console.log('Finally complete with Decay') },
    },
  ]);

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

      <div>
        <h2>Spring Controls</h2>
        <button onClick={() => springMove.start()}>Start</button>
        <button onClick={() => springMove.pause()}>Pause</button>
        <button onClick={() => springMove.resume()}>Resume</button>
        <button onClick={() => springMove.cancel()}>Cancel</button>
        <motion.div
          style={{
            width: 100,
            height: 100,
            backgroundColor: 'teal',
            translateX: springX,
          }}
        />
      </div>

      <div>
        <h2>Timing Controls</h2>
        <button onClick={() => timingMove.start()}>Start</button>
        <button onClick={() => timingMove.pause()}>Pause</button>
        <button onClick={() => timingMove.resume()}>Resume</button>
        <button onClick={() => timingMove.cancel()}>Cancel</button>
        <motion.div
          style={{
            width: 100,
            height: 100,
            backgroundColor: 'red',
            translateX: timingX,
            rotateZ: combine([timingX], (moveX) => `${moveX}deg`),
          }}
        />
      </div>

      <div>
        <h2>Sequence ( with controls )</h2>
        <button onClick={() => sequenceMove.start()}>Start</button>
        <button onClick={() => sequenceMove.pause()}>Pause</button>
        <button onClick={() => sequenceMove.resume()}>Resume</button>
        <button onClick={() => sequenceMove.cancel()}>Cancel</button>
        <motion.div
          style={{
            width: 100,
            height: 100,
            backgroundColor: 'teal',
            translateX: sequenceX,
          }}
        />
      </div>
    </>
  );
}
