import { useLayoutEffect } from 'react';

const App = () => {
  useLayoutEffect(() => {
    document.body.style.backgroundColor = '#333';
  }, []);

  return <>APP COMPONENT</>;
};

export default App;
