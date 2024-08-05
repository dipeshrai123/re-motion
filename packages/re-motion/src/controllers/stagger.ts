import { delay } from './delay';
import { parallel } from './parallel';
import { sequence } from './sequence';

import type { ControllerAnimation } from './types';

export const stagger = function (
  time: number,
  animations: ControllerAnimation[]
): ControllerAnimation {
  return parallel(
    animations.map((animation, i) => {
      return sequence([delay(time * i), animation]);
    })
  );
};
