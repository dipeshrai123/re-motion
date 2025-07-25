import { useLayoutEffect, useRef } from 'react';
import { motion, loop, MotionValue, timing } from '@raidipesh78/re-motion';

const ITEM_WIDTH = 200;
const GAP = 20;
const ITEMS = [
  'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?q=80&w=2076&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1472396961693-142e6e269027?q=80&w=952&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=988&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1433086966358-54859d0ed716?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1505142468610-359e7d316be0?q=80&w=926&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
];

export default function App() {
  const translateX = useRef(new MotionValue(0)).current;
  const ctrl = useRef(null);

  useLayoutEffect(() => {
    const finalPosition = -1 * (ITEM_WIDTH * ITEMS.length + GAP * ITEMS.length);
    ctrl.current = loop(
      timing(translateX, finalPosition, {
        duration: 10000,
      }),
      Infinity
    );

    ctrl.current.start();
  }, [translateX]);

  return (
    <div
      style={{
        overflow: 'hidden',
        marginTop: 20,
      }}
    >
      <motion.div
        style={{
          display: 'flex',
          translateX,
          gap: GAP,
        }}
      >
        {[...ITEMS, ...ITEMS].map((bgImage, i) => {
          return (
            <div
              key={i}
              style={{
                width: ITEM_WIDTH,
                height: ITEM_WIDTH,
                backgroundImage: `url(${bgImage})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                flexShrink: 0,
                borderRadius: 8,
              }}
            />
          );
        })}
      </motion.div>
    </div>
  );
}
