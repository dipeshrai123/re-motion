import { v5, FluidValue, makeFluid, spring, timing } from '@raidipesh78/re-motion';
import { useEffect, useMemo } from 'react';

const { withMotion, MotionValue } = v5;

const AnimatedDiv = withMotion('div');
const FluidDiv = makeFluid('div');

export default function New() {
  const progress = useMemo(() => new MotionValue(0), []);
  const fluidProgress = useMemo(() => new FluidValue(0), []);

  useEffect(() => {
    const unsubscribe = progress.onChange((v) => {
      if (v > 50 && v < 60) {
        console.log('halfway there');

        unsubscribe();
      }
    });
  }, [progress]);

  return (
    <div>
      <button onClick={() => progress.tween(0, 5000)}>TO: 0</button>
      <button onClick={() => progress.spring(100)}>TO: 100</button>
      <AnimatedDiv
        style={{
          width: progress.to([0, 100], [100, 200]),
          height: 100,
          position: 'relative',
          left: progress,
          backgroundColor: progress.to([0, 100], ['red', '#f00']),
          border: progress.to(
            [0, 100],
            ['1px solid red', '10px solid #ff00ff']
          ),
          borderRadius: progress.to([0, 100], (v) => `${v}px`),
          textAlign: progress.to([0, 100], (v) => (v > 50 ? 'center' : 'left')),
        }}
      >
        {progress.to([0, 100], (v) => 'value: ' + v)}
      </AnimatedDiv>

      <button onClick={() => timing(fluidProgress, {toValue: 0, duration: 5000}).start()}>TO: 0</button>
      <button onClick={() => spring(fluidProgress, {toValue: 100}).start()}>TO: 100</button>
      <FluidDiv
        style={{
          width: 100,
          height: 100,
          position: 'relative',
          background: 'red',
          left: fluidProgress,
        }}
      >
      </FluidDiv>
    </div>
  );
}
