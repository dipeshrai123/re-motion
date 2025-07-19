export interface Animator<T> {
  current: T;
  target?: T;
  origin?: T;
  finished?: boolean;
  cancelled?: boolean;
  wrapper?: boolean;
  callback?(finished: boolean): void;
  start(
    animator: Animator<T>,
    from: T,
    now: number,
    previous?: Animator<T> | null
  ): void;
  step(animator: Animator<T>, now: number): boolean;
}
