import { useMotionValue, spring, motion, timing } from '@raidipesh78/re-motion';

export default function Example() {
  const b = useMotionValue('10px solid black');

  return (
    <>
      <button onClick={() => spring(b, '40px solid yellow').start()}>
        TO YELLOW
      </button>
      <button
        onClick={() =>
          spring(b, '20px solid #3399ff', {
            onComplete: () => {
              console.log('COMPLETED SPRING TO #3399ff');
            },
          }).start()
        }
      >
        TO #3399ff
      </button>
      <button
        onClick={() =>
          timing(b, '60px solid rgb(0,0,0)', { duration: 3000 }).start()
        }
      >
        TO rgb(0,0,0)
      </button>
      <motion.div
        style={{
          width: 100,
          height: 100,
          backgroundColor: 'red',
          border: b,
        }}
      />
    </>
  );
}
