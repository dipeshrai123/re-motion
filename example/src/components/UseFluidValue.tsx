import { Easing, fluid, useFluidValue } from '@raidipesh78/re-motion';

const App = () => {
  const [translateX, setTranslateX] = useFluidValue([0, 100, 200]);

  return (
    <>
      <button
        onClick={() =>
          setTranslateX([
            { toValue: 0 },
            { toValue: 0 },
            { toValue: 0, config: { friction: 8 } },
          ])
        }
      >
        ANIMATE LEFT
      </button>
      <button
        onClick={() =>
          setTranslateX([
            { toValue: 100 },
            { toValue: 300, config: { friction: 10 } },
            { toValue: 500, config: { duration: 500, easing: Easing.bounce } },
          ])
        }
      >
        ANIMATE RIGHT
      </button>

      {translateX.map((t, i) => (
        <fluid.div
          key={i}
          style={{
            width: 100,
            height: 100,
            backgroundColor: '#3399ff',
            translateX: t,
          }}
        />
      ))}
    </>
  );
};

export default App;
