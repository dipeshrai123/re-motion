import { useState, useLayoutEffect, useRef } from 'react';
import { MotionValue } from '@raidipesh78/re-motion';

import { useValue } from './hooks';
import { DriverConfig } from './types';
import { withSpring } from './controllers';

export interface UseMountConfig {
  from?: number;
  enter?: DriverConfig;
  exit?: DriverConfig;
}

export const useMount = (state: boolean, config?: UseMountConfig) => {
  const [mounted, setMounted] = useState(state);
  const animationConfig = useRef({
    from: config?.from ?? 0,
    enter: config?.enter ?? withSpring(1),
    exit: config?.exit ?? withSpring(0),
  }).current;

  const animation = useValue(animationConfig.from);
  const enterAnimation = animationConfig.enter;
  const exitAnimation = animationConfig.exit;

  useLayoutEffect(() => {
    if (state) {
      setMounted(true);
      queueMicrotask(() => {
        animation.value = enterAnimation;
      });
    } else {
      queueMicrotask(() => {
        animation.value = exitAnimation;

        console.log(exitAnimation);
        // (animation.value as any).currentController.setOnComplete(() => {
        //   setMounted(false);
        // });
      });
    }
  }, [state, enterAnimation, exitAnimation, animation]);

  return function (
    fn: (animation: { value: MotionValue }, mounted: boolean) => React.ReactNode
  ) {
    return fn({ value: animation.value }, mounted);
  };
};
