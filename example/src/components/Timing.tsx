import { __experimental__, Easing } from '@raidipesh78/re-motion';

const { createMotionValue, withTiming, createMotionComponent } =
  __experimental__;

const Div = createMotionComponent('div');

export default function Example() {
  const x = createMotionValue(0);

  return (
    <Div
      onClick={() =>
        (x.value = withTiming(100, {
          easing: Easing.elastic(1),
        }))
      }
      style={{
        width: 100,
        height: 100,
        backgroundColor: 'teal',
        borderRadius: 4,
        translateX: x,
      }}
    />
  );
}
