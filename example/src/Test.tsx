import {
  fluid,
  FluidValue,
  spring,
  timing,
  native,
} from '@raidipesh78/re-motion';
import { useRef } from 'react';

export default function Test() {
  const position = useRef(new FluidValue('absolute')).current;
  const translateX = useRef(new FluidValue(0)).current;

  const animateLeft = () => {
    spring(translateX, { toValue: 0 }).start();
  };

  const animateRight = () => {
    timing(translateX, { toValue: 200, duration: 5000 }).start();
  };

  return (
    <div>
      <button onClick={animateLeft}>LEFT</button>
      <button onClick={animateRight}>RIGHT</button>
      <button onClick={() => translateX.resetAnimation()}>PAUSE</button>
      <button onClick={() => native(position, { toValue: 'relative' }).start()}>
        STRING
      </button>
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
