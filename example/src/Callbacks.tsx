import { useState, useRef, useLayoutEffect } from 'react';
import { fluid, FluidValue, spring } from '@raidipesh78/re-motion';

export default function Callbacks() {
  const [open, setOpen] = useState(false);

  const animation = useRef(new FluidValue(100)).current;

  useLayoutEffect(() => {
    if (open) {
      spring(animation, {
        toValue: 200,
        onStart: (value) => console.log('start open', value),
        onChange: (value) => console.log('change open', value),
        onRest: (value) => console.log('rest open', value),
      }).start();
    } else {
      spring(animation, {
        toValue: 100,
        onStart: (value) => console.log('start close', value),
        onChange: (value) => console.log('change close', value),
        onRest: (value) => console.log('rest close', value),
      }).start();
    }
  }, [open, animation]);

  return (
    <div>
      <button onClick={() => setOpen((p) => !p)}>Toggle</button>

      <fluid.div
        style={{
          width: animation,
          height: 100,
          backgroundColor: 'red',
        }}
      />
    </div>
  );
}
