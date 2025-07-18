export interface AnimationObject<T> {
  current: T;
  callback?(finished: boolean): void;
  toValue?: AnimationObject<T>['current'];
  startValue?: AnimationObject<T>['current'];
  finished?: boolean;
  cancelled?: boolean;
  isHigherOrder?: boolean;
  onStart(
    anim: this,
    value: T,
    timestamp: number,
    previous?: this | null
  ): void;
  onFrame(anim: this, timestamp: number): boolean;
}
