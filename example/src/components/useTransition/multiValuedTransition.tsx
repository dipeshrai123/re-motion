import { useState } from 'react';
import { animated, useTransitions } from '@raidipesh78/re-motion';

const App = () => {
  const [open, setOpen] = useState(false);
  const [animation] = useTransitions({
    width: open ? 300 : 100,
    translateX: open ? 100 : 0,
  });

  return (
    <>
      <button onClick={() => setOpen((curr) => !curr)}>ANIMATE</button>

      <animated.div
        style={{
          height: 100,
          backgroundColor: '#3399ff',
          ...animation,
        }}
      />

      <div style={{ height: 1000 }} />
    </>
  );
};

export default App;
