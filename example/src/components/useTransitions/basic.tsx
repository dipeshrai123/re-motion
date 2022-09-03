import { useState } from 'react';
import { animated, useTransitions } from '@raidipesh78/re-motion';

const App = () => {
  const [open, setOpen] = useState(true);
  const [animation, setAnimation] = useTransitions(
    {
      width: open ? 300 : 100,
      translateX: open ? 100 : 0,
    },
    {
      tension: 300,
      friction: 20,
    }
  );

  return (
    <>
      <button onClick={() => setOpen((curr) => !curr)}>TOGGLE</button>
      <button
        onClick={() => setAnimation({ translateX: 500 }, { duration: 200 })}
      >
        ANIMATE
      </button>

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
