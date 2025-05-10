import type { AnimationController } from './AnimationController';

export function loop(
  driver: AnimationController,
  iterations: number
): AnimationController {
  let count = 0;
  let cancelled = false;

  function runAnimation() {
    if (cancelled || count >= iterations) return;
    count++;

    driver.setOnComplete?.(() => {
      if (count !== iterations) {
        driver.reset();
      }

      runAnimation();
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
      driver.reset();
    },
    cancel() {
      cancelled = true;
      driver.cancel();
    },
  };
}
