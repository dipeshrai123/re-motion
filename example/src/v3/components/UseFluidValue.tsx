import { Easing, fluid, useFluidValue } from '@raidipesh78/re-motion';

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
      <button onClick={() => setTranslateX({ toValue: 100 })}>
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
