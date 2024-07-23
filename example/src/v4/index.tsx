import { useRef } from 'react';
import { v4 } from '@raidipesh78/re-motion';

const { FluidValue, makeFluid, timing } = v4;

const FluidDiv = makeFluid('div');

const App = () => {
  const x = useRef(new FluidValue(0)).current;

  return (
    <>
      <button onClick={() => timing(x, { toValue: 300 })}>Click Me</button>

      <FluidDiv
        x={x}
        style={{
          width: 100,
          height: 100,
          backgroundColor: x.interpolate([0, 100], ['red', 'green']),
          position: 'relative',
          translateX: x,
        }}
      />
    </>
  );
};

export default App;
