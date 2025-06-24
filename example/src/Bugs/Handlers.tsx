import { motion } from '@raidipesh78/re-motion';
import { useLayoutEffect, useRef, useState } from 'react';

export default function Example() {
  const ref = useRef<HTMLDivElement>(null);
  const [, reRender] = useState(0);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) {
      return () => {};
    }

    const handleMouseEnter = () => {
      console.log('Mouse entered');
      reRender((prev) => prev + 1);
    };

    const handleMouseLeave = () => {
      console.log('Mouse left');
      reRender((prev) => prev + 1);
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  //   const handleMouseEnter = () => {
  //     console.log('Mouse entered');
  //     reRender((prev) => prev + 1);
  //   };

  //   const handleMouseLeave = () => {
  //     console.log('Mouse left');
  //     reRender((prev) => prev + 1);
  //   };

  return (
    <>
      <motion.div
        ref={ref}
        // onMouseEnter={handleMouseEnter}
        // onMouseLeave={handleMouseLeave}
        style={{
          width: 100,
          height: 100,
          backgroundColor: 'red',
        }}
      />
    </>
  );
}
