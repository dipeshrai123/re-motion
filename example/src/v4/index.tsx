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
            config: {
              onStart: (v) => {
                console.log('left start', v);
              },
              onChange: (v) => {
                console.log('left change', v);
              },
              onRest: (v) => {
                console.log('left end', v);
              },
            },
          })
        }
      >
        LEFT
      </button>

      <button
        onClick={() =>
          setTranslateX({
            // toValue: 300,
            config: {
              decay: true,
              velocity: 1,
              // onStart: (v) => {
              //   console.log('right start ', v);
              // },
              // onChange: (v) => {
              //   console.log('right change', v);
              // },
              // onRest: (v) => {
              //   console.log('right end', v);
              // },
            },
          })
        }
      >
        RIGHT
      </button>

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
