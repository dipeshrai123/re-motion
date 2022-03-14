/**
 * Result on debounce
 */
export type ResultType = { finished: boolean; value: number };

/**
 * Base Animation class
 */
export class Animation {
  _active: boolean;
  _onEnd: any;

  _debounceOnEnd(result: ResultType) {
    const onEnd = this._onEnd;
    this._onEnd = null;
    onEnd && onEnd(result);
  }

  stop() {}
}
