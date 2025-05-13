import { withSpring, withTiming } from './controllers';
import { useValue } from './hooks';
import { animate } from './animate';
import * as React from 'react';
import { useMount } from './UseMount';

export default function Example() {
  const x = useValue(0);
  const pos = useValue<'relative' | 'absolute'>('relative');

  const [open, setOpen] = React.useState(true);
  const mountedValue = useMount(open);

  return (
    <>
      <button onClick={() => (x.value = withSpring(100))}>
        ANIMATE SPRING
      </button>
      <button onClick={() => (x.value = withTiming(0))}>ANIMATE TIMING</button>
      <button
        onClick={() => {
          pos.value = pos.currentValue === 'relative' ? 'absolute' : 'relative';
        }}
      >
        MAKE ABSOLUTE
      </button>

      <animate.div
        style={{
          width: 100,
          height: 100,
          backgroundColor: x.value.to([0, 100], ['#3399ff', 'yellow']),
          translateX: x.value,
          position: pos.value,
        }}
      />

      <br />

      <button
        onClick={() => {
          setOpen((prev) => !prev);
        }}
      >
        ANIMATE ME
      </button>

      {mountedValue(
        (animation, mounted) =>
          mounted && (
            <>
              <animate.div
                style={{
                  width: 100,
                  height: 100,
                  opacity: animation.value,
                  backgroundColor: 'teal',
                  //   width: bInterpolate(animation.value, 100, 300),
                  //   height: bInterpolate(animation.value, 100, 200),
                  //   backgroundColor: bInterpolate(
                  //     animation.value,
                  //     'red',
                  //     '#3399ff'
                  //   ),
                  //   translateX: 45,
                }}
              />
              <animate.div
                style={{
                  width: 100,
                  height: 100,
                  opacity: animation.value,
                  backgroundColor: 'red',
                  //   width: bInterpolate(animation.value, 100, 400),
                  //   height: bInterpolate(animation.value, 100, 50),
                  //   border: '1px solid black',
                  //   backgroundColor: bInterpolate(
                  //     animation.value,
                  //     'red',
                  //     '#3399ff'
                  //   ),
                  //   translateX: 45,
                }}
              />
              <animate.div
                style={{
                  width: 100,
                  height: 100,
                  opacity: animation.value,
                  backgroundColor: 'yellow',
                  translateX: animation.value.to([0, 1], [0, 100]),
                  //   width: bInterpolate(animation.value, 100, 500),
                  //   height: 100,
                  //   backgroundColor: bInterpolate(
                  //     animation.value,
                  //     'red',
                  //     '#3399ff'
                  //   ),
                  //   translateX: 45,
                }}
              />
            </>
          )
      )}
    </>
  );
}
