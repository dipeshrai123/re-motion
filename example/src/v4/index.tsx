import { useRef } from 'react';
import { v4 } from '@raidipesh78/re-motion';

const { FluidValue, makeFluid, timing, Easing, Spring } = v4;

const FluidDiv = makeFluid('div');

const App = () => {
  const x = useRef(new FluidValue(0)).current;

  return (
    <>
      <button
        onClick={() => x.animate(new Spring({ toValue: 0, friction: 10 }))}
      >
        Spring
      </button>

      <button
        onClick={() =>
          timing(x, { toValue: 300, duration: 500, easing: Easing.bounce })
        }
      >
        Timing
      </button>

      <FluidDiv
        x={x}
        style={{
          width: 100,
          height: 100,
          backgroundColor: 'red',
          position: 'relative',
          translateX: x,
        }}
      />
    </>
  );
};

export default App;
