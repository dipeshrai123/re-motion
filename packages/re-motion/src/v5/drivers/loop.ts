import type { AnimationController } from './AnimationController';

export function loop(
  controller: AnimationController,
  iterations: number
): AnimationController {
  let count = 0;
  let cancelled = false;
  let isPaused = false;
  let onAllDone: (() => void) | undefined;

  function runOne() {
    if (cancelled || isPaused) return;

    if (iterations !== Infinity && count >= iterations) {
      onAllDone?.();
      return;
    }

    controller.setOnComplete?.(() => {
      count++;
      controller.reset();
      runOne();
    });

    controller.start();
  }

  return {
    start() {
      cancelled = false;
      isPaused = false;
      count = 0;
      runOne();
    },

    pause() {
      isPaused = true;
      controller.pause();
    },

    resume() {
      if (cancelled || !isPaused) return;
      isPaused = false;
      controller.resume();
      runOne();
    },

    cancel() {
      cancelled = true;
      controller.cancel();
    },

    reset() {
      cancelled = false;
      isPaused = false;
      count = 0;
      controller.reset?.();
    },

    setOnComplete(fn: () => void) {
      onAllDone = fn;
    },
  };
}
