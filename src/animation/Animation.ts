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
  _onRest?: any;

  _debounceOnEnd(result: ResultType) {
    const onEnd = this._onEnd;
    const onRest = this._onRest;
    this._onEnd = null;
    this._onRest = null;

    onRest && onRest(result);
    onEnd && onEnd(result);
  }

  stop() {}
}
