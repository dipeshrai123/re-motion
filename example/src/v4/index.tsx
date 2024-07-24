import { useRef } from 'react';
import { v4 } from '@raidipesh78/re-motion';

const { FluidValue, makeFluid, spring } = v4;

const FluidDiv = makeFluid('div');

const App = () => {
  const x = useRef(new FluidValue(0)).current;

  return (
    <>
      <button onClick={() => spring(x, { toValue: 0 })}>LEFT</button>

      <button
        onClick={() => {
          spring(x, { toValue: 300 });
        }}
      >
        RIGHT
      </button>

      <FluidDiv
        style={{
          width: 100,
          height: 100,
          position: 'relative',
          translateX: x,
          backgroundColor: 'red',
        }}
      />
    </>
  );
};

export default App;
