import { useMotionValue, Easing, motion, spring } from '@raidipesh78/re-motion';

export default function Example() {
  const translateX = useMotionValue(0);

  return (
    <>
      <button onClick={() => spring(translateX, 0).start()}>
        Animate left
      </button>
      <button onClick={() => spring(translateX, 300).start()}>
        Animate right
      </button>
      <motion.div
        style={{
          width: 100,
          height: 100,
          backgroundColor: 'red',
          translateX: translateX.to([0, 300], ['0px', '300px'], {
            easing: Easing.bounce,
          }),
        }}
      />
    </>
  );
}
