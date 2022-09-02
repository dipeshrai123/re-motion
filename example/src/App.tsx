import { useTransition, animated } from '@raidipesh78/re-motion';

const App = () => {
  const [translateX, setTranslateX] = useTransition(0);
  return (
    <animated.div
      style={{
        width: 100,
        height: 100,
        backgroundColor: '#3399ff',
        translateX,
      }}
      onClick={() => setTranslateX({ toValue: 100 })}
    />
  );
};

export default App;
