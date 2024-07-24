import { useLayoutEffect } from 'react';
import SharedElement from './examples/SharedElement';

const App = () => {
  useLayoutEffect(() => {
    document.body.style.backgroundColor = '#333';
  }, []);

  return (
    <>
      <SharedElement />
    </>
  );
};

export default App;
