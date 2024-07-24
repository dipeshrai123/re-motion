import { useRef } from 'react';
import { v4 } from '@raidipesh78/re-motion';
import { useDrag } from '@use-gesture/react';

const { FluidValue, spring, fluid } = v4;

const App = () => {
  const x = useRef(new FluidValue(0)).current;
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
          spring(x, { toValue: 300 });
          spring(x1, { toValue: x });
        }}
      >
        RIGHT
      </button>

      <fluid.div
        {...bind()}
        style={{
          width: 100,
          height: 100,
          position: 'relative',
          translateX: x,
          backgroundColor: 'red',
        }}
      />
      <fluid.div
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
