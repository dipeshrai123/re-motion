export interface AnimationObject<T> {
  current: T;
  onStart(
    anim: this,
    value: T,
    timestamp: number,
    previous?: this | null
  ): void;
  onFrame(anim: this, timestamp: number): boolean;
  callback?(finished: boolean): void;
  /** optional flags: */
  cancelled?: boolean;
  isHigherOrder?: boolean;
}
