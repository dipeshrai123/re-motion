import type { EndCallback, EndResultType } from '../animations/FluidAnimation';
import type { ControllerAnimation } from './types';

type ParallelConfig = {
  stopTogether?: boolean;
};

export const parallel = function (
  animations: ControllerAnimation[],
  config?: ParallelConfig
): ControllerAnimation {
  const animationStatuses: { [key: number]: boolean } = {};
  const stopTogether = config?.stopTogether ?? true;
  let completedCount = 0;

  const start = (callback?: EndCallback) => {
    if (completedCount === animations.length) {
      callback && callback({ finished: true });

      return;
    }

    animations.forEach((animation, index) => {
      const cb = (endResult: EndResultType) => {
        animationStatuses[index] = true;
        completedCount++;

        if (completedCount === animations.length) {
          completedCount = 0;
          callback && callback(endResult);

          return;
        }

        if (!endResult.finished && stopTogether) {
          stop();
        }
      };

      if (!animation) {
        cb({ finished: true });
      } else {
        animation.start(cb);
      }
    });
  };

  const stop = () => {
    animations.forEach((animation, index) => {
      !animationStatuses[index] && animation.stop();
      animationStatuses[index] = true;
    });
  };

  const reset = () => {
    animations.forEach((animation, index) => {
      animation.reset();
      animationStatuses[index] = false;
      completedCount = 0;
    });
  };

  return { start, stop, reset };
};
