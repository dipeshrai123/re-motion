import { useLayoutEffect } from 'react';

import Example from './components/Shake';

const App = () => {
  useDark();

  return <Example />;
};

function useDark() {
  useLayoutEffect(() => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (isDark) {
      document.body.style.backgroundColor = '#333';
      document.body.style.color = '#fff';
    }
  }, []);
}

export default App;
