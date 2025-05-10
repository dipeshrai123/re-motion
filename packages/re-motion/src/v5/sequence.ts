import { MotionValue } from './MotionValue';
import { spring, timing, decay, type AnimationController } from './drivers';

type TimingStep = {
  driver: typeof timing;
  mv: MotionValue<number>;
  to: number;
  opts?: Parameters<typeof timing>['2'];
};

type SpringStep = {
  driver: typeof spring;
  mv: MotionValue<number>;
  to: number;
  opts?: Parameters<typeof spring>[2];
};

type DecayStep = {
  driver: typeof decay;
  mv: MotionValue<number>;
  velocity: number;
  opts?: Parameters<typeof decay>[2];
};

export type Step = TimingStep | SpringStep | DecayStep;

export function sequence(steps: Step[]): {
  start(): void;
  pause(): void;
  resume(): void;
  cancel(): void;
} {
  let idx = 0;
  let isCancelled = false;
  let currentCtrl: AnimationController | null = null;

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
  };
}
