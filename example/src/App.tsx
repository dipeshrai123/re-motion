import { useLayoutEffect } from 'react';
import FluidValue from './v3/components/UseFluidValue';

// v4
import Example from './v4';

const App = () => {
  useLayoutEffect(() => {
    document.body.style.backgroundColor = '#333';
  }, []);

  return (
    <>
      <h2>V3</h2>
      <FluidValue />

      <h2>V4</h2>
      <Example />
    </>
  );
};

export default App;
