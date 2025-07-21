import {
  createMotionValue,
  motion,
  spring,
  timing,
  sequence,
  decay,
  combine,
  repeat,
  delay,
  cancelMotionValue,
} from '@raidipesh78/re-motion';
import { useState, useRef } from 'react';

export default function Version5() {
  const [, setRe] = useState(0);

  const timingX = useRef(createMotionValue(0)).current;
  const springX = useRef(createMotionValue(0)).current;
  const decayX = useRef(createMotionValue(0)).current;
  const sequenceX = useRef(createMotionValue(0)).current;
  const loopX = useRef(createMotionValue(0)).current;
  const loopSequenceX = useRef(createMotionValue(0)).current;
  const sequenceLoopX = useRef(createMotionValue(0)).current;

  return (
    <>
      <div style={{ position: 'fixed', right: 0, top: 0 }}>
        <button onClick={() => setRe((p) => p + 1)}>Re Render</button>
      </div>

      <div>
        <h4>Timing</h4>
        <button
          onClick={() => {
            timingX.set(timing(500, { duration: 5000 }));
          }}
        >
          Start
        </button>
        <button onClick={() => cancelMotionValue(timingX)}>Cancel</button>
        <button onClick={() => timingX.set(0)}>Reset</button>
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
        <button
          onClick={() => {
            springX.set(spring(500));
          }}
        >
          Start
        </button>
        <button onClick={() => cancelMotionValue(springX)}>Cancel</button>
        <button onClick={() => springX.set(0)}>Reset</button>
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
        <button
          onClick={() => {
            decayX.set(decay({ velocity: 1 }));
          }}
        >
          Start
        </button>
        <button onClick={() => cancelMotionValue(decayX)}>Cancel</button>
        <button onClick={() => decayX.set(0)}>Reset</button>
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
        <button
          onClick={() => {
            sequenceX.set(
              sequence([spring(300), timing(200), decay({ velocity: 1 })])
            );
          }}
        >
          Start
        </button>
        <button onClick={() => cancelMotionValue(sequenceX)}>Cancel</button>
        <button onClick={() => sequenceX.set(0)}>Reset</button>
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
        <h4>Repeat</h4>
        <button
          onClick={() => {
            loopX.set(repeat(timing(500, { duration: 1000 }), 5));
          }}
        >
          Start
        </button>
        <button onClick={() => cancelMotionValue(loopX)}>Cancel</button>
        <button onClick={() => loopX.set(0)}>Reset</button>
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
        <h4>Sequence inside repeat</h4>
        <button
          onClick={() => {
            loopSequenceX.set(repeat(sequence([timing(200), timing(0)]), 5));
          }}
        >
          Start
        </button>
        <button onClick={() => cancelMotionValue(loopSequenceX)}>Cancel</button>
        <button onClick={() => loopSequenceX.set(0)}>Reset</button>
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
        <h4>Repeat inside sequence</h4>
        <button
          onClick={() => {
            sequenceLoopX.set(
              sequence([
                repeat(spring(200), 5),
                timing(300, { duration: 5000 }),
                delay(3000, spring(400, { damping: 8 })),
              ])
            );
          }}
        >
          Start
        </button>
        <button onClick={() => cancelMotionValue(sequenceLoopX)}>Cancel</button>
        <button onClick={() => sequenceLoopX.set(0)}>Reset</button>
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
