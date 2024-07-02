import { useState } from 'react';
import { useMount, fluid } from '@raidipesh78/re-motion';

const App = () => {
  const [open, setOpen] = useState(true);
  const mv = useMount(open, {
    from: 0,
    enter: 100,
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
                width: 100,
                height: 100,
                backgroundColor: '#3399ff',
                translateX: animation,
              }}
            />
          )
      )}
      <div style={{ height: 10, backgroundColor: 'red' }} />
    </>
  );
};

export default App;
