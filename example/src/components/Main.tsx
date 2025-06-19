import {
  MotionValue,
  spring,
  timing,
  motion,
  sequence,
  decay,
  combine,
  loop,
  delay,
  parallel,
} from '@raidipesh78/re-motion';
import { useState, useRef } from 'react';

export default function Version5() {
  const [, setRe] = useState(0);
  // const position = useMotionValue<'relative' | 'absolute'>('relative');
  // const obj = useMotionValue({ x: 10 });

  const timingX = useRef(new MotionValue(0)).current;
  const timingMove = timing(timingX, 500, {
    duration: 5000,
    onStart: () => console.log('TIMING ONLY START'),
    onPause: () => console.log('TIMING ONLY PAUSE'),
    onResume: () => console.log('TIMING ONLY RESUME'),
    onComplete: () => console.log('TIMING ONLY COMPLETE'),
    onChange: (value) => {
      console.log('TIMING ONLY CHANGE', value);
    },
  });

  const springX = useRef(new MotionValue(0)).current;
  const springMove = spring(springX, 500, {
    onStart: () => console.log('SPRING ONLY START'),
    onPause: () => console.log('SPRING ONLY PAUSE'),
    onResume: () => console.log('SPRING ONLY RESUME'),
    onComplete: () => console.log('SPRING ONLY COMPLETE'),
    onChange: (value) => {
      console.log('SPRING ONLY CHANGE', value);
    },
  });

  const decayX = useRef(new MotionValue(0)).current;
  const decayMove = decay(decayX, 1, {
    onStart: () => console.log('DECAY ONLY START'),
    onPause: () => console.log('DECAY ONLY PAUSE'),
    onResume: () => console.log('DECAY ONLY RESUME'),
    onComplete: () => console.log('DECAY ONLY COMPLETE'),
    clamp: [0, 400],
    onChange: (value) => {
      console.log('DECAY ONLY CHANGE', value);
    },
  });

  const sequenceX = useRef(new MotionValue(0)).current;
  const sequenceMove = sequence(
    [
      spring(sequenceX, 300),
      timing(sequenceX, 200),
      decay(sequenceX, 1, {
        onStart: () => {
          console.log('DECAY START');
        },
        onComplete: () => {
          console.log('COMPELTE');
        },
      }),
    ],
    {
      onStart: () => console.log('SEQUENCE START'),
      onPause: () => console.log('SEQUENCE PAUSE'),
      onResume: () => console.log('SEQUENCE RESUME'),
      onComplete: () => console.log('SEQUENCE COMPLETE'),
    }
  );

  const parallelX = useRef(
    Array.from({ length: 5 }).map(() => new MotionValue(0))
  ).current;
  const parallelMove = parallel(
    [
      timing(parallelX[0], 500, { duration: 1000 }),
      spring(parallelX[1], 300, { damping: 20 }),
      decay(parallelX[2], 1, { clamp: [0, 400] }),
      timing(parallelX[3], 200, { duration: 500 }),
      spring(parallelX[4], 400, { damping: 10 }),
    ],
    {
      onStart: () => console.log('PARALLEL START'),
      onPause: () => console.log('PARALLEL PAUSE'),
      onResume: () => console.log('PARALLEL RESUME'),
      onComplete: () => console.log('PARALLEL COMPLETE'),
    }
  );

  const loopX = useRef(new MotionValue(0)).current;
  const loopMove = loop(timing(loopX, 500, { duration: 1000 }), 5, {
    onStart: () => console.log('LOOP START'),
    onPause: () => console.log('LOOP PAUSE'),
    onResume: () => console.log('LOOP RESUME'),
    onComplete: () => console.log('LOOP COMPLETE'),
  });

  const loopSequenceX = useRef(new MotionValue(0)).current;
  const loopSequenceMove = loop(
    sequence([timing(loopSequenceX, 200), timing(loopSequenceX, 0)]),
    5
  );

  const sequenceLoopX = useRef(new MotionValue(0)).current;
  const sequenceLoopMove = sequence([
    loop(
      spring(sequenceLoopX, 200, {
        onComplete: () => {
          console.log('SPRING ON LOOP INSIDE SEQUENCE DONE');
        },
      }),
      5
    ),
    timing(sequenceLoopX, 300, {
      duration: 5000,
      onComplete: () => {
        console.log('TIMING ON SEQUENCE DONE');
      },
    }),
    delay(3000),
    spring(sequenceLoopX, 400, {
      damping: 8,
      onComplete: () => {
        console.log('SPRING ON SEQUENCE DONE');
      },
    }),
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

      <div style={{ position: 'fixed', right: 0, top: 0 }}>
        <button onClick={() => setRe((p) => p + 1)}>Re Render</button>
      </div>

      <div>
        <h4>Timing</h4>
        <button onClick={() => timingMove.start()}>Start</button>
        <button onClick={() => timingMove.pause()}>Pause</button>
        <button onClick={() => timingMove.resume()}>Resume</button>
        <button onClick={() => timingMove.cancel()}>Cancel</button>
        <button onClick={() => timingMove.reset()}>Reset</button>
        <motion.div
          style={{
            width: 50,
            height: 50,
            backgroundColor: 'red',
            translateX: timingX,
            rotateX: timingX.to([0, 300], [0, 360]),
            rotateZ: combine([timingX], (moveX) => `${moveX}deg`),
          }}
        />
      </div>

      <div>
        <h4>Spring</h4>
        <button onClick={() => springMove.start()}>Start</button>
        <button onClick={() => springMove.pause()}>Pause</button>
        <button onClick={() => springMove.resume()}>Resume</button>
        <button onClick={() => springMove.cancel()}>Cancel</button>
        <button onClick={() => springMove.reset()}>Reset</button>
        <motion.div
          style={{
            width: 50,
            height: 50,
            backgroundColor: 'teal',
            translateX: springX,
          }}
        />
      </div>

      <div>
        <h4>Decay</h4>
        <button onClick={() => decayMove.start()}>Start</button>
        <button onClick={() => decayMove.pause()}>Pause</button>
        <button onClick={() => decayMove.resume()}>Resume</button>
        <button onClick={() => decayMove.cancel()}>Cancel</button>
        <button onClick={() => decayMove.reset()}>Reset</button>
        <motion.div
          style={{
            width: 50,
            height: 50,
            backgroundColor: 'tomato',
            translateX: decayX,
          }}
        />
      </div>

      <div>
        <h4>Sequence</h4>
        <button onClick={() => sequenceMove.start()}>Start</button>
        <button onClick={() => sequenceMove.pause()}>Pause</button>
        <button onClick={() => sequenceMove.resume()}>Resume</button>
        <button onClick={() => sequenceMove.cancel()}>Cancel</button>
        <button onClick={() => sequenceMove.reset()}>Reset</button>
        <motion.div
          style={{
            width: 50,
            height: 50,
            backgroundColor: 'teal',
            translateX: sequenceX,
          }}
        />
      </div>

      <div>
        <h4>Parallel</h4>
        <button onClick={() => parallelMove.start()}>Start</button>
        <button onClick={() => parallelMove.pause()}>Pause</button>
        <button onClick={() => parallelMove.resume()}>Resume</button>
        <button onClick={() => parallelMove.cancel()}>Cancel</button>
        <button onClick={() => parallelMove.reset()}>Reset</button>

        {parallelX.map((x, i) => (
          <motion.div
            key={i}
            style={{
              width: 50,
              height: 50,
              backgroundColor: `hsl(${i * 60}, 70%, 50%)`,
              translateX: x,
              marginBottom: 10,
            }}
          />
        ))}
      </div>

      <div>
        <h4>Loop</h4>
        <button onClick={() => loopMove.start()}>Start</button>
        <button onClick={() => loopMove.pause()}>Pause</button>
        <button onClick={() => loopMove.resume()}>Resume</button>
        <button onClick={() => loopMove.cancel()}>Cancel</button>
        <button onClick={() => loopMove.reset()}>Reset</button>
        <motion.div
          style={{
            width: 50,
            height: 50,
            backgroundColor: '#3399ff',
            translateX: loopX,
          }}
        />
      </div>

      <div>
        <h4>Loop with sequence</h4>
        <button onClick={() => loopSequenceMove.start()}>Start</button>
        <button onClick={() => loopSequenceMove.pause()}>Pause</button>
        <button onClick={() => loopSequenceMove.resume()}>Resume</button>
        <button onClick={() => loopSequenceMove.cancel()}>Cancel</button>
        <button onClick={() => loopSequenceMove.reset()}>Reset</button>
        <motion.div
          style={{
            width: 50,
            height: 50,
            backgroundColor: '#b9d141',
            translateX: loopSequenceX,
          }}
        />
      </div>

      <div>
        <h4>Sequence with loop inside</h4>
        <button onClick={() => sequenceLoopMove.start()}>Start</button>
        <button onClick={() => sequenceLoopMove.pause()}>Pause</button>
        <button onClick={() => sequenceLoopMove.resume()}>Resume</button>
        <button onClick={() => sequenceLoopMove.cancel()}>Cancel</button>
        <button onClick={() => sequenceLoopMove.reset()}>Reset</button>
        <motion.div
          style={{
            width: 50,
            height: 50,
            backgroundColor: 'tomato',
            translateX: sequenceLoopX,
          }}
        />
      </div>
    </>
  );
}
