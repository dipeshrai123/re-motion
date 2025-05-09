import { FluidValue, spring, fluid, combine } from '@raidipesh78/re-motion';
import * as React from 'react';

export default function New() {
  const y = React.useRef(new FluidValue(0)).current;

  const transform = combine([y], (x) => `translateY(${x}px) rotate(${x}deg)`);

  return (
    <div>
      <button
        onClick={() => {
          spring(y, { toValue: 0 }).start();
        }}
      >
        TO: 0
      </button>
      <button
        onClick={() => {
          spring(y, { toValue: 100 }).start();
        }}
      >
        TO: 100
      </button>

      <fluid.div
        style={{
          width: 100,
          height: 100,
          backgroundColor: 'red',
          position: 'relative',
          left: y,
          transform,
        }}
      ></fluid.div>
    </div>
  );
}
