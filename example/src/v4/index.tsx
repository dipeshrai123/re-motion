import { useRef } from 'react';
import { v4 } from '@raidipesh78/re-motion';

const { FluidValue, Timing, makeFluid } = v4;

const FluidDiv = makeFluid('div');

const App = () => {
  const x = useRef(new FluidValue(50)).current;

  return (
    <>
      <button onClick={() => x.animate(new Timing({ toValue: 100 }))}>
        Click Me
      </button>

      <FluidDiv
        x={x}
        style={{
          width: 100,
          height: 100,
          backgroundColor: x.interpolate([50, 100], ['red', 'green']),
          position: 'relative',
          translateX: x,
        }}
      />
    </>
  );
};

export default App;
