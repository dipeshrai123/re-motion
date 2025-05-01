import { v5 } from '@raidipesh78/re-motion';
import { useEffect, useMemo } from 'react';

const { withMotion, MotionValue } = v5;

const AnimatedDiv = withMotion('div');

const Child = () => {
  console.log('re-rendering child');
  return <div>CHILD</div>;
};

export default function New() {
  const progress = useMemo(() => new MotionValue(0), []);

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
      <AnimatedDiv
        onClick={() => progress.spring(100, { damping: 8 })}
        style={{
          width: progress.to([0, 100], [100, 200]),
          height: 100,
          position: 'relative',
          left: progress,
          backgroundColor: progress.to([0, 100], ['#000', '#f00']),
          border: progress.to(
            [0, 100],
            ['1px solid red', '10px solid #ff00ff']
          ),
          borderRadius: progress.to([0, 100], (v) => `${v}px`),
          textAlign: progress.to([0, 100], (v) => (v > 50 ? 'center' : 'left')),
        }}
      >
        <Child />
      </AnimatedDiv>

      <button onClick={() => progress.resume()}>Resume</button>
      <button onClick={() => progress.pause()}>Pause</button>
      <button onClick={() => progress.reverse()}>Reverse</button>
    </div>
  );
}
