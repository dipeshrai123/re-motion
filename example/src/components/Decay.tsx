import { fluid, useFluidValue } from '@raidipesh78/re-motion';

const App = () => {
  const [translateX, setTranslateX] = useFluidValue(0);

  return (
    <>
      <button onClick={() => setTranslateX({ toValue: 0 })}>
        ANIMATE LEFT
      </button>
      <button
        onClick={() => setTranslateX({ config: { decay: true, velocity: 1 } })}
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
