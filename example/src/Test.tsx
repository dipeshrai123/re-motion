import { fluid, FluidValue } from '@raidipesh78/re-motion';
import { useRef } from 'react';

export default function Test() {
  const position = useRef(new FluidValue('absolute')).current;
  const translateX = useRef(new FluidValue(0)).current;

  const animateLeft = () => {
    translateX.spring({ toValue: 0 }).start();
  };

  const animateRight = () => {
    translateX.timing({ toValue: 200, duration: 5000, delay: 50 }).start();
  };

  return (
    <div>
      <button onClick={animateLeft}>LEFT</button>
      <button onClick={animateRight}>RIGHT</button>
      <button onClick={() => translateX.resetAnimation()}>PAUSE</button>
      <fluid.div
        style={{
          backgroundColor: 'red',
          width: 100,
          height: 100,
          translateX,
          position,
        }}
      />
    </div>
  );
}
