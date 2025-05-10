import { MotionValue } from './value';
import {
  timing,
  spring,
  decay,
  TimingOpts,
  SpringOpts,
  DecayOpts,
} from './drivers';

type TimingStep = {
  driver: typeof timing;
  mv: MotionValue<number>;
  to: number;
  opts?: Omit<TimingOpts, 'onComplete'>;
};

type SpringStep = {
  driver: typeof spring;
  mv: MotionValue<number>;
  to: number;
  opts?: Omit<SpringOpts, 'onComplete'>;
};

type DecayStep = {
  driver: typeof decay;
  mv: MotionValue<number>;
  velocity: number;
  opts?: Omit<DecayOpts, 'onComplete'>;
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

  // kick off
  runNext();

  return {
    cancel() {
      isCancelled = true;
    },
  };
}
