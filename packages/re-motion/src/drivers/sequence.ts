import type { AnimationController } from './AnimationController';

class SequenceController implements AnimationController {
  private idx = 0;
  private isPaused = false;
  private isCancelled = false;
  private current: AnimationController | null = null;
  private onAllDone?: () => void;
  private driverOnCompletes: Array<(() => void) | undefined>;

  constructor(private controllers: AnimationController[]) {
    this.driverOnCompletes = controllers.map((ctrl) => {
      return (ctrl as any)?.hooks?.onComplete;
    });
  }

  private runNext() {
    if (this.isCancelled || this.isPaused) return;

    const i = this.idx++;
    const ctrl = this.controllers[i];

    if (!ctrl) {
      this.onAllDone?.();
      return;
    }

    this.current = ctrl;
    const orig = this.driverOnCompletes[i];

    ctrl.setOnComplete?.(() => {
      orig?.();
      this.runNext();
    });

    ctrl.start();
  }

  start() {
    this.idx = 0;
    this.isPaused = false;
    this.isCancelled = false;
    this.runNext();
  }

  pause() {
    if (this.isCancelled) return;
    this.isPaused = true;
    this.current?.pause();
  }

  resume() {
    if (this.isCancelled || !this.isPaused) return;
    this.isPaused = false;
    this.current?.resume();
  }

  cancel() {
    this.isCancelled = true;
    this.current?.cancel();
  }

  reset() {
    this.isCancelled = false;
    this.isPaused = false;
    this.idx = 0;
    this.controllers.forEach((c) => c.reset?.());
  }

  setOnComplete(fn: () => void) {
    this.onAllDone = fn;
  }
}

export function sequence(
  controllers: AnimationController[]
): AnimationController {
  return new SequenceController(controllers);
}
