import { useMotionValue, timing, motion, spring } from '@raidipesh78/re-motion';

export default function Example() {
  const translateX = useMotionValue(0);

  return (
    <>
      <button onClick={() => timing(translateX, 0).start()}>
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
          translateX: translateX,
        }}
      />
    </>
  );
}
