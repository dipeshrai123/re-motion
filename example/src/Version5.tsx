import { __experimental__v5 } from '@raidipesh78/re-motion';
import { useDrag } from '@use-gesture/react';
import { useEffect, useRef, useState } from 'react';

const {
  useMotionValue,
  spring,
  timing,
  motion,
  sequence,
  decay,
  combine,
  loop,
  delay,
  MotionValue,
} = __experimental__v5;

/**
 * Wire up mvs[1] to follow mvs[0], mvs[2] to follow mvs[1], ...
 * Returns a cleanup fn.
 */
export function chainFollow(mvs: any[]): () => void {
  const unsubscribers: Array<() => void> = [];

  for (let i = 1; i < mvs.length; i++) {
    const leader = mvs[i - 1];
    const follower = mvs[i];

    // whenever the leader changes, re-start a spring on the follower
    const unsub = leader.subscribe((latest: any) => {
      spring(follower, latest).start();
    });

    unsubscribers.push(unsub);
  }

  // return a single cleanup that tears down all subs
  return () => unsubscribers.forEach((unsub) => unsub());
}

export default function Version5() {
  const [, setRe] = useState(0);
  // const position = useMotionValue<'relative' | 'absolute'>('relative');
  // const obj = useMotionValue({ x: 10 });

  const timingX = useMotionValue(0);
  const timingMove = timing(timingX, 500, {
    duration: 5000,
    onStart: () => console.log('TIMING ONLY START'),
    onPause: () => console.log('TIMING ONLY PAUSE'),
    onResume: () => console.log('TIMING ONLY RESUME'),
    onComplete: () => console.log('TIMING ONLY COMPLETE'),
  });

  const springX = useMotionValue(0);
  const springMove = spring(springX, 500, {
    damping: 8,
    stiffness: 200,
    onStart: () => console.log('SPRING ONLY START'),
    onPause: () => console.log('SPRING ONLY PAUSE'),
    onResume: () => console.log('SPRING ONLY RESUME'),
    onComplete: () => console.log('SPRING ONLY COMPLETE'),
  });

  const decayX = useMotionValue(0);
  const decayMove = decay(decayX, 20, {
    onStart: () => console.log('DECAY ONLY START'),
    onPause: () => console.log('DECAY ONLY PAUSE'),
    onResume: () => console.log('DECAY ONLY RESUME'),
    onComplete: () => console.log('DECAY ONLY COMPLETE'),
  });

  const sequenceX = useMotionValue(0);
  const sequenceMove = sequence([
    spring(sequenceX, 300),
    timing(sequenceX, 200),
    decay(sequenceX, 20),
  ]);

  const loopX = useMotionValue(0);
  const loopMove = loop(timing(loopX, 500), 5);

  const loopSequenceX = useMotionValue(0);
  const loopSequenceMove = loop(
    sequence([timing(loopSequenceX, 200), timing(loopSequenceX, 0)]),
    5
  );

  const sequenceLoopX = useMotionValue(0);
  const sequenceLoopMove = sequence([
    loop(spring(sequenceLoopX, 200), 5),
    timing(sequenceLoopX, 300, { duration: 5000 }),
    delay(3000),
    spring(sequenceLoopX, 400, { damping: 8 }),
  ]);

  const xs = useRef(Array.from({ length: 4 }, () => new MotionValue(0)));
  const ys = useRef(Array.from({ length: 4 }, () => new MotionValue(0)));
  const bind: any = useDrag(({ offset: [mx, my] }) => {
    spring(xs.current[0], mx).start();
    spring(ys.current[0], my).start();
  });

  useEffect(() => {
    const cleanup1 = chainFollow(xs.current);
    const cleanup2 = chainFollow(ys.current);
    return () => {
      cleanup1();
      cleanup2();
    };
  }, [xs]);

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

      {xs.current
        .map((x, i) => {
          const s = {
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: 'red',
            translateX: x,
            translateY: ys.current[i],
            position: 'absolute',
            left: 0,
            top: 0,
          };
          return i === 0 ? (
            <motion.div key={i} {...bind()} style={s} />
          ) : (
            <motion.div key={i} style={s} />
          );
        })
        .reverse()}

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
