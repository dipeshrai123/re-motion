import { MotionValue, spring, motion, timing } from '@raidipesh78/re-motion';
import { useRef } from 'react';

export default function Example() {
  const borderValue = useRef(new MotionValue('10px solid black')).current;
  const boxShadowValue = useRef(
    new MotionValue('0px 0px 0px rgba(0,0,0,0)')
  ).current;
  const transformValue = useRef(
    new MotionValue('translateX(0px) scale(1)')
  ).current;

  return (
    <>
      <button onClick={() => spring(borderValue, '40px solid yellow').start()}>
        Border to dotted Yellow
      </button>

      <button
        onClick={() =>
          spring(borderValue, '20px solid #3399ff', {
            onComplete: () => {
              console.log('COMPLETED SPRING TO DASHED #3399ff');
            },
          }).start()
        }
      >
        Border to dashed #3399ff
      </button>

      <button
        onClick={() =>
          timing(borderValue, '60px solid rgb(0,0,0)', {
            duration: 3000,
          }).start()
        }
      >
        Border to solid rgb(0,0,0)
      </button>

      <button
        onClick={() =>
          spring(
            borderValue,
            '200px solid hsl(221.72185430463574, 65.36796536796537%, 45.294117647058826%)'
          ).start()
        }
      >
        Border to hsl(221,65%,45%)
      </button>

      <button
        onClick={() =>
          timing(boxShadowValue, '10px 10px 30px rgba(0,0,0,0.5)', {
            duration: 2000,
          }).start()
        }
      >
        BoxShadow to visible
      </button>

      <button
        onClick={() =>
          spring(transformValue, 'translateX(200px) scale(1.5)').start()
        }
      >
        Translate & Scale
      </button>

      <motion.div
        style={{
          width: 100,
          height: 100,
          backgroundColor: 'red',
          border: borderValue,
          boxShadow: boxShadowValue,
          transform: transformValue,
          marginTop: '20px',
        }}
      />
    </>
  );
}
