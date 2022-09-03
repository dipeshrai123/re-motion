import { animated, useTransitions } from '@raidipesh78/re-motion';

const App = () => {
  const [animation, setAnimation] = useTransitions({
    width: 100,
    translateX: 0,
  });

  return (
    <>
      <button onClick={() => setAnimation({ width: 100, translateX: 0 })}>
        ANIMATE LEFT
      </button>
      <button
        onClick={() =>
          setAnimation({
            width: async (next) => {
              await next(200);
              await next(600);
            },
            translateX: 500,
          })
        }
      >
        ANIMATE RIGHT
      </button>

      <animated.div
        style={{
          height: 100,
          backgroundColor: '#3399ff',
          ...animation,
        }}
      />
    </>
  );
};

export default App;
