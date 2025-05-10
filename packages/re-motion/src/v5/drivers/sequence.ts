import { MotionValue } from '../MotionValue';
import { spring, timing, decay } from '.';

import type { AnimationController, TimingOpts, SpringOpts, DecayOpts } from '.';

type TimingStep = {
  driver: typeof timing;
  mv: MotionValue<number>;
  to: number;
  opts?: TimingOpts;
};

type SpringStep = {
  driver: typeof spring;
  mv: MotionValue<number>;
  to: number;
  opts?: SpringOpts;
};

type DecayStep = {
  driver: typeof decay;
  mv: MotionValue<number>;
  velocity: number;
  opts?: DecayOpts;
};

export type Step = TimingStep | SpringStep | DecayStep;

export function sequence(steps: Step[]): AnimationController {
  let idx = 0;
  let isCancelled = false;
  let currentCtrl: AnimationController | null = null;
  const initialMap = new Map<MotionValue<number>, number>();

  function runNext() {
    if (isCancelled) return;
    const step = steps[idx++];
    if (!step) return;

    const { driver, mv } = step;

    const userOnComplete = (step.opts as any)?.onComplete as
      | (() => void)
      | undefined;

    const onComplete = () => {
      if (userOnComplete) userOnComplete();
      if (!isCancelled) runNext();
    };

    if (driver === decay) {
      const { velocity, opts } = step as DecayStep;
      currentCtrl = driver(mv, velocity, { ...(opts ?? {}), onComplete });
    } else {
      const { to, opts } = step as TimingStep | SpringStep;
      currentCtrl = driver(mv, to, { ...(opts ?? {}), onComplete });
    }

    currentCtrl.start();
  }

  return {
    start() {
      initialMap.clear();
      for (const { mv } of steps) {
        initialMap.set(mv, mv.current);
      }

      isCancelled = false;
      idx = 0;
      currentCtrl = null;
      runNext();
    },
    pause() {
      if (!isCancelled) currentCtrl?.pause();
    },
    resume() {
      if (!isCancelled) currentCtrl?.resume();
    },
    cancel() {
      isCancelled = true;
      currentCtrl?.cancel();
    },
    reset() {
      isCancelled = true;
      currentCtrl?.cancel();

      for (const [mv, val] of initialMap) {
        mv.set(val);
      }

      idx = 0;
    },
  };
}
