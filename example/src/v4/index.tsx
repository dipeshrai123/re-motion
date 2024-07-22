import { v4 } from '@raidipesh78/re-motion';
import { useRef } from 'react';

const { FluidValue, Timing } = v4;

const App = () => {
  const x = useRef(new FluidValue(0)).current;

  return (
    <>
      <button onClick={() => x.animate(new Timing({ toValue: 100 }))}>
        Click Me
      </button>
    </>
  );
};

export default App;
