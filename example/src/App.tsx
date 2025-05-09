import { useLayoutEffect } from 'react';

import Stagger from './Stagger';

const App = () => {
  useDark();

  return <Stagger />;
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
