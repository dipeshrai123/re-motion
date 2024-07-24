import { v4 } from '@raidipesh78/re-motion';

const { useFluidValue, Easing, fluid } = v4;

const App = () => {
  const [translateX, setTranslateX] = useFluidValue(0, {
    duration: 1000,
    easing: Easing.bounce,
  });

  return (
    <>
      <button onClick={() => setTranslateX({ toValue: 0 })}>
        ANIMATE LEFT
      </button>
      <button
        onClick={() =>
          setTranslateX(async (next) => {
            await next({ toValue: 100 });
            await next({
              toValue: 300,
              config: { duration: 5000, easing: Easing.elastic(1) },
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
