import {
  useMotionValue,
  spring,
  timing,
  motion,
  sequence,
  decay,
  loop,
} from '@raidipesh78/re-motion';

export default function Version5() {
  const x = useMotionValue(0);

  return (
    <>
      <button onClick={() => timing(x, 400).start()}>Timing</button>
      <button onClick={() => spring(x, 0).start()}>Spring</button>
      <button onClick={() => decay(x, 1).start()}>Decay</button>
      <button
        onClick={() => sequence([timing(x, 100), spring(x, 200)]).start()}
      >
        Sequence
      </button>
      <button onClick={() => loop(spring(x, 250), 5).start()}>Loop</button>
      <motion.div
        style={{
          width: 100,
          height: 100,
          backgroundColor: 'teal',
          // translateX: x,
          transform: x.to([0, 100], ['translateY(0px)', 'translateY(100px)']),
          translateX: x,
          rotate: x.to([0, 100], ['0deg', '360deg']),
        }}
      />
    </>
  );
}
