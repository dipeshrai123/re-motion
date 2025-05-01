import { v5 } from '@raidipesh78/re-motion';
import { useEffect, useMemo } from 'react';

const { withMotion, MotionValue, interpolate } = v5;

const AnimatedDiv = withMotion('div');

const Child = () => {
  console.log('re-rendering child');
  return <div>CHILD</div>;
};

export default function New() {
  const progress = useMemo(() => new MotionValue(0), []);

  const width = interpolate(progress, [0, 100], [100, 500]);
  const bg = interpolate(progress, [0, 100], ['#000', '#f00']);

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
        onClick={() => progress.spring(100, { damping: 10 })}
        style={{
          width: width,
          height: 100,
          position: 'relative',
          left: progress,
          backgroundColor: bg,
        }}
      >
        <Child />
      </AnimatedDiv>
    </div>
  );
}
