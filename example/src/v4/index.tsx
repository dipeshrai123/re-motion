import { useRef, useState } from 'react';
import { v4 } from '@raidipesh78/re-motion';
import { useDrag } from '@use-gesture/react';

const { FluidValue, makeFluid, spring } = v4;

const FluidDiv = makeFluid('div');

const App = () => {
  const [a, setA] = useState(0);
  const x = useRef(new FluidValue(100)).current;
  const x1 = useRef(new FluidValue(0)).current;

  const bind = useDrag(({ offset: [ox] }) => {
    spring(x, { toValue: ox });
    spring(x1, { toValue: x });
  });

  return (
    <>
      <button onClick={() => spring(x, { toValue: 0 })}>LEFT</button>

      <button
        onClick={() => {
          setA((p) => p + 1);
          spring(x, { toValue: 300 });
          spring(x1, { toValue: x });
        }}
      >
        RIGHT
      </button>

      <FluidDiv
        {...bind()}
        style={{
          width: 100,
          height: 100,
          position: 'relative',
          translateX: x,
          backgroundColor: 'red',
        }}
      />
      <FluidDiv
        data-a={a}
        style={{
          width: 100,
          height: 100,
          position: 'relative',
          translateX: x1,
          backgroundColor: 'yellow',
        }}
      />
    </>
  );
};

export default App;
