import { Easing, fluid, useFluidValue } from '@raidipesh78/re-motion';

const App = () => {
  const [translateX, setTranslateX] = useFluidValue(0, {
    tension: 250,
    friction: 18,
  });

  return (
    <>
      <button
        onClick={() =>
          setTranslateX(async (next) => {
            await next({ toValue: 100 });
            await next({ toValue: 0, config: { duration: 2000 } });
          })
        }
      >
        ANIMATE LEFT
      </button>
      <button
        onClick={() =>
          setTranslateX(async (next) => {
            await next({
              toValue: 100,
              config: { duration: 1000, easing: Easing.elastic() },
            });
            await next({
              toValue: 500,
              config: { friction: 13, tension: 200 },
            });
          })
        }
      >
        ANIMATE RIGHT
      </button>

      <fluid.div
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
