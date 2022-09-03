import { animated, useTransition } from '@raidipesh78/re-motion';

const App = () => {
  const [translateX, setTranslateX] = useTransition(0, {
    tension: 250,
    friction: 18,
  });

  return (
    <>
      <button onClick={() => setTranslateX(0)}>ANIMATE LEFT</button>
      <button
        onClick={() =>
          setTranslateX(async (next) => {
            await next(100, { duration: 4000 });
            await next(200);
          })
        }
      >
        ANIMATE RIGHT
      </button>

      <animated.div
        style={{
          width: 100,
          height: 100,
          backgroundColor: '#3399ff',
          translateX,
        }}
      />
    </>
  );
};

export default App;
