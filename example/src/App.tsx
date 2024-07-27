import { useLayoutEffect } from 'react';
// import SharedElement from './examples/SharedElement';

// import Example from './components/Decay';
// import Example from './components/Interpolation';
// import Example from './components/SequenceTransition';
import Example from './components/UseFluidValue';
// import Example from './components/UseMount';

const App = () => {
  useLayoutEffect(() => {
    document.body.style.backgroundColor = '#333';
  }, []);

  return (
    <>
      <Example />
    </>
  );
};

export default App;
