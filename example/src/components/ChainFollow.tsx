import { spring, motion, MotionValue } from '@raidipesh78/re-motion';
import { useDrag } from '@use-gesture/react';
import { useEffect, useRef } from 'react';

/**
 * Wire up mvs[1] to follow mvs[0], mvs[2] to follow mvs[1], ...
 * Returns a cleanup fn.
 */
export function chainFollow(mvs: any[]): () => void {
  const unsubscribers: Array<() => void> = [];

  for (let i = 1; i < mvs.length; i++) {
    const leader = mvs[i - 1];
    const follower = mvs[i];

    // whenever the leader changes, re-start a spring on the follower
    const unsub = leader.subscribe((latest: any) => {
      spring(follower, latest).start();
    });

    unsubscribers.push(unsub);
  }

  // return a single cleanup that tears down all subs
  return () => unsubscribers.forEach((unsub) => unsub());
}

export default function Example() {
  const xs = useRef(Array.from({ length: 4 }, () => new MotionValue(0)));
  const ys = useRef(Array.from({ length: 4 }, () => new MotionValue(0)));
  const bind: any = useDrag(({ offset: [mx, my] }) => {
    spring(xs.current[0], mx).start();
    spring(ys.current[0], my).start();
  });

  useEffect(() => {
    const cleanup1 = chainFollow(xs.current);
    const cleanup2 = chainFollow(ys.current);
    return () => {
      cleanup1();
      cleanup2();
    };
  }, [xs]);

  return (
    <>
      {xs.current
        .map((x, i) => {
          const s = {
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: 'red',
            translateX: x,
            translateY: ys.current[i],
            position: 'absolute' as React.CSSProperties['position'],
            left: 0,
            top: 0,
          };
          return i === 0 ? (
            <motion.div key={i} {...bind()} style={s} />
          ) : (
            <motion.div key={i} style={s} />
          );
        })
        .reverse()}
    </>
  );
}
