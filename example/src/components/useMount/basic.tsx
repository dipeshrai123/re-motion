import { useState } from 'react';
import { useMount, animated } from '@raidipesh78/re-motion';

const App = () => {
  const [open, setOpen] = useState(false);
  const mv = useMount(open, {
    from: 0,
    enter: async (next) => {
      await next({ toValue: 100 });
      await next({ toValue: 500 });
    },
    exit: 0,
  });

  return (
    <>
      <button onClick={() => setOpen((curr) => !curr)}>Animate</button>
      {mv(
        (animation, mounted) =>
          mounted && (
            <animated.div
              style={{
                width: 100,
                height: 100,
                backgroundColor: '#3399ff',
                translateX: animation,
              }}
            />
          )
      )}
    </>
  );
};

export default App;
