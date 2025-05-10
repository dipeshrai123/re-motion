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
  let isPaused = false;
  let isCancelled = false;
  let currentCtrl: AnimationController | null = null;
  let onSeqComplete: (() => void) | undefined;
  const initialMap = new Map<MotionValue<number>, number>();

  function runNext() {
    if (isPaused || isCancelled) return;

    const step = steps[idx++];
    if (!step) {
      onSeqComplete?.();
      return;
    }

    const { driver, mv } = step;

    const userOnComplete = (step.opts as any)?.onComplete as
      | (() => void)
      | undefined;

    const stepOnComplete = () => {
      userOnComplete?.();
      runNext();
    };

    if (driver === decay) {
      const { velocity, opts } = step as DecayStep;
      currentCtrl = driver(mv, velocity, {
        ...(opts ?? {}),
        onComplete: stepOnComplete,
      });
    } else {
      const { to, opts } = step as TimingStep | SpringStep;
      currentCtrl = driver(mv, to, {
        ...(opts ?? {}),
        onComplete: stepOnComplete,
      });
    }

    currentCtrl.start();
  }

  return {
    start() {
      initialMap.clear();
      for (const { mv } of steps) {
        initialMap.set(mv, mv.current);
      }

      isPaused = false;
      isCancelled = false;
      idx = 0;
      currentCtrl = null;
      runNext();
    },

    pause() {
      if (isCancelled) return;
      isPaused = true;
      currentCtrl?.pause();
    },

    resume() {
      if (isCancelled || !isPaused) return;
      isPaused = false;
      currentCtrl?.resume();
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
      isPaused = false;
      isCancelled = false;
    },

    setOnComplete(fn: () => void) {
      onSeqComplete = fn;
    },
  };
}
