import type { EndCallback, EndResultType } from '../animations/FluidAnimation';
import type { ControllerAnimation } from './types';

export const sequence = function (
  animations: ControllerAnimation[]
): ControllerAnimation {
  let currentIteration = 0;

  const start = (callback?: EndCallback) => {
    const onComplete = function (result: EndResultType) {
      if (!result.finished) {
        callback && callback(result);

        return;
      }

      currentIteration++;
      if (currentIteration === animations.length) {
        callback && callback(result);

        return;
      }

      animations[currentIteration].start(onComplete);
    };

    if (animations.length === 0) {
      callback && callback({ finished: true });
    } else {
      animations[currentIteration].start(onComplete);
    }
  };

  const stop = () => {
    if (currentIteration < animations.length) {
      animations[currentIteration].stop();
    }
  };

  const reset = () => {
    animations.forEach((animation, idx) => {
      if (idx <= currentIteration) {
        animation.reset();
      }
    });
    currentIteration = 0;
  };

  return { start, stop, reset };
};
