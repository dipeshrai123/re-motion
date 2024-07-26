import { useState } from 'react';
import { useMount, fluid, interpolate } from '@raidipesh78/re-motion';

const App = () => {
  const [open, setOpen] = useState(false);
  const mv = useMount(open, {
    from: 0,
    enter: 1,
    exit: 0,
  });

  return (
    <>
      <button onClick={() => setOpen((curr) => !curr)}>TOGGLE</button>
      {mv(
        (animation, mounted) =>
          mounted && (
            <fluid.div
              style={{
                width: interpolate(animation, [0, 1], [100, 200]),
                height: interpolate(animation, [0, 1], [100, 200]),
                backgroundColor: '#3399ff',
                translateX: interpolate(animation, [0, 1], [0, 100]),
                opacity: animation,
              }}
            />
          )
      )}
      <div style={{ height: 10, backgroundColor: 'red' }} />
    </>
  );
};

export default App;
