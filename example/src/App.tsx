import { useLayoutEffect } from 'react';

import Callbacks from './Callbacks';

const App = () => {
  useDark();

  return <Callbacks />;
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
