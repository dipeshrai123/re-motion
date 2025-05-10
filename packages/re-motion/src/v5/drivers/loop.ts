import type { AnimationController } from './AnimationController';

export function loop(
  driver: AnimationController,
  iterations: number
): AnimationController {
  let count = 0;
  let cancelled = false;
  const originalOnComplete = (driver as any).hooks?.onComplete as
    | (() => void)
    | undefined;

  function runAnimation() {
    if (cancelled || (iterations !== Infinity && count >= iterations)) return;

    driver.setOnComplete?.(() => {
      originalOnComplete?.();

      count++;

      if (count < iterations) {
        driver.reset();
        runAnimation();
      }
    });

    driver.start();
  }

  return {
    start() {
      cancelled = false;
      count = 0;
      runAnimation();
    },
    pause() {
      driver.pause();
    },
    resume() {
      driver.resume();
    },
    reset() {
      count = 0;
      driver.reset();
    },
    cancel() {
      cancelled = true;
      driver.cancel();
    },
  };
}
