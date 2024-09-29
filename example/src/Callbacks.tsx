import { useRef } from 'react';
import {
  fluid,
  FluidValue,
  sequence,
  timing,
  spring,
  decay,
  loop,
  native,
} from '@raidipesh78/re-motion';

export default function Callbacks() {
  // const [, setOpen] = useState(false);

  const animation = useRef(new FluidValue(0)).current;

  // useLayoutEffect(() => {
  //   if (open) {
  //     timing(animation, {
  //       toValue: 200,
  //       onStart: (value) => console.log('start open', value),
  //       onChange: (value) => console.log('change open', value),
  //       onRest: (value) => console.log('rest open', value),
  //     }).start();
  //   } else {
  //     timing(animation, {
  //       toValue: 100,
  //       onStart: (value) => console.log('start close', value),
  //       onChange: (value) => console.log('change close', value),
  //       onRest: (value) => console.log('rest close', value),
  //     }).start();
  //   }
  // }, [open, animation]);

  return (
    <div>
      <button
        onClick={() =>
          loop(
            sequence([
              timing(animation, {
                toValue: 100,
                onStart: (value) => console.log('start timing', value),
                onChange: (value) => console.log('change timing', value),
                onRest: (value) => console.log('rest timing', value),
              }),
              spring(animation, {
                toValue: 200,
                onStart: (value) => console.log('start spring', value),
                onChange: (value) => console.log('change spring', value),
                onRest: (value) => console.log('rest spring', value),
              }),
              decay(animation, {
                velocity: 1,
                onStart: (value) => console.log('start decay', value),
                onChange: (value) => console.log('change decay', value),
                onRest: (value) => console.log('rest decay', value),
              }),
            ]),
            { iterations: 4 }
          ).start()
        }
      >
        Toggle
      </button>

      <button onClick={() => native(animation, { toValue: 300 }).start()}>
        Native
      </button>

      <fluid.div
        style={{
          width: 100,
          height: 100,
          backgroundColor: 'red',
          translateX: animation,
        }}
      />
    </div>
  );
}
