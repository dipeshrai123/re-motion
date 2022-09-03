import { useState } from 'react';
import { useMounts, animated } from '@raidipesh78/re-motion';

const App = () => {
  const [open, setOpen] = useState(true);
  const mv = useMounts(open, {
    from: { width: 100 },
    enter: { width: 200 },
    exit: { width: 100 },
  });

  return (
    <>
      <button onClick={() => setOpen((curr) => !curr)}>TOGGLE</button>
      {mv(
        (animation, mounted) =>
          mounted && (
            <animated.div
              style={{
                width: animation.width,
                height: 100,
                backgroundColor: '#3399ff',
              }}
            />
          )
      )}
    </>
  );
};

export default App;
