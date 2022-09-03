import { useState } from 'react';
import { useMounts, animated } from '@raidipesh78/re-motion';

const App = () => {
  const [open, setOpen] = useState(true);
  const mv = useMounts(open, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    exit: { opacity: 0 },
  });

  return (
    <>
      <button onClick={() => setOpen((curr) => !curr)}>TOGGLE</button>
      {mv(
        (animation, mounted) =>
          mounted && (
            <animated.div
              style={{
                width: 100,
                height: 100,
                backgroundColor: '#3399ff',
                opacity: animation.opacity,
              }}
            />
          )
      )}
    </>
  );
};

export default App;
