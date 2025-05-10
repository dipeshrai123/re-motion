import { useLayoutEffect } from 'react';

import Version5 from './Version5';

const App = () => {
  useDark();

  return <Version5 />;
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
