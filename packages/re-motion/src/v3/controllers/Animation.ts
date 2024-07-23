import type { ResultType } from '../types/animation';

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
