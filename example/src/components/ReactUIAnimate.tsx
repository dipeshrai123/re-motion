import { useRef } from 'react';
import { motion } from '@raidipesh78/re-motion';
import { useValue } from '../react-ui-animate/useValue';
import {
  withSpring,
  withTiming,
  withDecay,
} from '../react-ui-animate/descriptors';

export default function Example() {
  const [x, setX] = useValue(0);

  return (
    <>
      <button onClick={() => setX(0)}>RESET</button>
      <button
        onClick={() =>
          setX(
            withSpring(100, {
              onStart() {
                console.log('started');
              },
              onChange(v) {
                console.log('updated', v);
              },
              onComplete() {
                console.log('complete');
              },
            })
          )
        }
      >
        Animate to Right
      </button>
      <button onClick={() => setX(withTiming(0))}>Animate to Left</button>
      <button
        onClick={() =>
          setX(
            withDecay({
              velocity: 1,
              onStart() {
                console.log('started');
              },
              onChange(v) {
                console.log('updated', v);
              },
              onComplete() {
                console.log('complete');
              },
            })
          )
        }
      >
        Decay
      </button>
      <button onClick={() => {}}>Sequence</button>
      {/* <button onClick={() => setX(withDelay(1000, withSpring(200)))}>
        Animate Right With Delay
      </button> */}
      <motion.div
        style={{
          width: 100,
          height: 100,
          backgroundColor: 'teal',
          borderRadius: 4,
          translateX: x,
        }}
      />
    </>
  );
}
