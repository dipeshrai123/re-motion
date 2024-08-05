import { useLayoutEffect } from 'react';

import Test from './Test';

const App = () => {
  useDark();

  return <Test />;
};

function useDark() {
  useLayoutEffect(() => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (isDark) {
      document.body.style.backgroundColor = '#333';
    }
  }, []);
}

export default App;
