import type { EndCallback, EndResultType } from '../animations/FluidAnimation';
import type { ControllerAnimation } from './types';

export type LoopConfig = {
  iterations?: number;
};

export const loop = function (
  animation: ControllerAnimation,
  config?: LoopConfig
): ControllerAnimation {
  const iterations = config?.iterations ?? -1;
  let hasEnded = false;
  let currentIteration = 0;

  const start = (callback?: EndCallback) => {
    const restart = (result: EndResultType = { finished: true }) => {
      if (
        hasEnded ||
        currentIteration === iterations ||
        result.finished === false
      ) {
        callback && callback(result);
      } else {
        currentIteration++;
        animation.reset();
        animation.start(restart);
      }
    };

    if (!animation || iterations === 0) {
      callback && callback({ finished: true });
    } else {
      restart();
    }
  };

  const stop = () => {
    hasEnded = true;
    animation.stop();
  };

  const reset = () => {
    currentIteration = 0;
    hasEnded = false;
    animation.reset();
  };

  return { start, stop, reset };
};
