import { v5 } from '@raidipesh78/re-motion';
import { useMemo } from 'react';
import { useDrag } from '@use-gesture/react';

const { withMotion, MotionValue, interpolateNumber, interpolateColor } = v5;

const AnimatedDiv = withMotion('div');

const Child = () => {
  console.log('re-rendering child');
  return <div>CHILD</div>;
};

export default function New() {
  const progress = useMemo(() => new MotionValue(0), []);
  const bind = useDrag(({ movement: [mx] }) => {
    progress.spring(mx);
  });

  const width = interpolateNumber(progress, [0, 100], [100, 500]);
  const bg = interpolateColor(progress, [0, 100], '#000', '#f00');

  return (
    <div>
      <AnimatedDiv
        {...bind()}
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
