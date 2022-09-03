import { animated, useTransition } from '@raidipesh78/re-motion';

const App = () => {
  const [translateX, setTranslateX] = useTransition(0);

  return (
    <>
      <button onClick={() => setTranslateX({ toValue: 200 })}>
        ANIMATE LEFT
      </button>
      <button
        onClick={() =>
          setTranslateX({
            toValue: 10,
            config: {
              onRest: () => console.log('FINISHED'),
            },
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

      <div style={{ height: 1000 }} />
    </>
  );
};

export default App;
