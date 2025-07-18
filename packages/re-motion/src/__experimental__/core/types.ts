export interface Animator<T> {
  current: T;
  target?: T;
  origin?: T;
  finished?: boolean;
  cancelled?: boolean;
  wrapper?: boolean;
  callback?(finished: boolean): void;
  start(animator: this, from: T, now: number, previous?: this | null): void;
  step(animator: this, now: number): boolean;
}
