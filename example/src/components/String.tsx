import { __experimental__ } from '@raidipesh78/re-motion';
import { useRef } from 'react';

const { createMotionValue, motion } = __experimental__;

export default function Example() {
  const position = useRef(createMotionValue('relative')).current;

  return (
    <>
      <button
        onClick={() => {
          position.value = 'absolute';
        }}
      >
        POSITION
      </button>

      <motion.div
        style={{
          width: 100,
          height: 100,
          backgroundColor: 'red',
          position: position,
          marginTop: '20px',
        }}
      />
    </>
  );
}
