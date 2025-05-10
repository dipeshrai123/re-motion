import { MotionValue } from './value';
import { timing, spring, decay } from './drivers';

type TimingStep = {
  driver: typeof timing;
  mv: MotionValue<number>;
  to: number;
  opts?: any;
};

type SpringStep = {
  driver: typeof spring;
  mv: MotionValue<number>;
  to: number;
  opts?: any;
};

type DecayStep = {
  driver: typeof decay;
  mv: MotionValue<number>;
  velocity: number;
  opts?: any;
};

export type Step = TimingStep | SpringStep | DecayStep;

export function sequence(steps: Step[]): { cancel(): void } {
  let idx = 0;
  let isCancelled = false;

  function runNext() {
    if (isCancelled) return;
    const step = steps[idx++];
    if (!step) return;

    const { driver, mv } = step;

    const onComplete = () => {
      if (!isCancelled) runNext();
    };

    if (driver === decay) {
      const { velocity, opts } = step as DecayStep;
      driver(mv, velocity, { ...(opts ?? {}), onComplete });
    } else {
      const { to, opts } = step as TimingStep | SpringStep;
      driver(mv, to, { ...(opts ?? {}), onComplete });
    }
  }

  runNext();

  return {
    cancel() {
      isCancelled = true;
    },
  };
}
