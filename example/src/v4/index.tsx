import { v4 } from '@raidipesh78/re-motion';

const { fluid, useFluidValue } = v4;

const App = () => {
  const [translateX, setTranslateX] = useFluidValue(0);

  return (
    <>
      <button
        onClick={() =>
          setTranslateX({
            toValue: 0,
            config: { onRest: (value) => console.log(value) },
          })
        }
      >
        LEFT
      </button>

      <button onClick={() => setTranslateX({ toValue: 300 })}>RIGHT</button>

      <fluid.div
        style={{
          width: 100,
          height: 100,
          position: 'relative',
          translateX: translateX,
          backgroundColor: 'red',
        }}
      />
    </>
  );
};

export default App;
