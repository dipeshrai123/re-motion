import type { AnimationController } from './AnimationController';

export function sequence(
  controllers: Array<AnimationController>
): AnimationController {
  let idx = 0;
  let isPaused = false;
  let isCancelled = false;
  let current: AnimationController | null = null;
  let onAllDone: (() => void) | undefined;

  function runNext() {
    if (isCancelled || isPaused) return;

    const ctrl = controllers[idx++];
    if (!ctrl) {
      onAllDone?.();
      return;
    }

    current = ctrl;
    ctrl.setOnComplete?.(() => {
      runNext();
    });

    ctrl.start();
  }

  return {
    start() {
      idx = 0;
      isPaused = false;
      isCancelled = false;
      runNext();
    },
    pause() {
      if (isCancelled) return;
      isPaused = true;
      current?.pause();
    },
    resume() {
      if (isCancelled || !isPaused) return;
      isPaused = false;
      current?.resume();
    },
    cancel() {
      isCancelled = true;
      current?.cancel();
    },
    reset() {
      isCancelled = false;
      isPaused = false;
      idx = 0;
      controllers.forEach((c) => c.reset?.());
    },
    setOnComplete(fn: () => void) {
      onAllDone = fn;
    },
  };
}
