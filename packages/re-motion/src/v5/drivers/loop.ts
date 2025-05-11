import type { AnimationController } from './AnimationController';

class LoopController implements AnimationController {
  private count = 0;
  private isCancelled = false;
  private isPaused = false;
  private onAllDone?: () => void;

  constructor(
    private driver: AnimationController,
    private iterations: number
  ) {}

  private handleIterationComplete = () => {
    this.count++;

    if (this.count < this.iterations) {
      this.driver.reset?.();
      this.runOne();
    } else {
      this.onAllDone?.();
    }
  };

  private runOne() {
    if (this.isCancelled || this.isPaused) return;

    this.driver.setOnComplete?.(this.handleIterationComplete);
    this.driver.start();
  }

  start() {
    this.isCancelled = false;
    this.isPaused = false;
    this.count = 0;
    this.runOne();
  }

  pause() {
    this.isPaused = true;
    this.driver.pause();
  }

  resume() {
    if (this.isCancelled || !this.isPaused) return;
    this.isPaused = false;
    this.driver.resume();
  }

  cancel() {
    this.isCancelled = true;
    this.driver.cancel();
  }

  reset() {
    this.isCancelled = false;
    this.isPaused = false;
    this.count = 0;
    this.driver.reset?.();
  }

  setOnComplete(fn: () => void) {
    this.onAllDone = fn;
  }
}

export function loop(
  controller: AnimationController,
  iterations: number
): AnimationController {
  return new LoopController(controller, iterations);
}
