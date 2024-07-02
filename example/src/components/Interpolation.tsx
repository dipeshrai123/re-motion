import { fluid, interpolate, useFluidValue } from '@raidipesh78/re-motion';

const App = () => {
  const [translateX, setTranslateX] = useFluidValue(0);

  return (
    <>
      <button onClick={() => setTranslateX({ toValue: 0 })}>
        ANIMATE LEFT
      </button>
      <button onClick={() => setTranslateX({ toValue: 200 })}>
        ANIMATE RIGHT
      </button>

      <fluid.div
        style={{
          width: interpolate(translateX, [0, 200], [100, 200]),
          height: 100,
          backgroundColor: interpolate(
            translateX,
            [0, 200],
            ['#3399ff', 'red']
          ),
          translateX,
        }}
      />
    </>
  );
};

export default App;
