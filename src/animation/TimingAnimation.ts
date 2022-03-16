import { Animation } from './Animation';
import { ResultType } from './Types';
import {
  RequestAnimationFrame,
  CancelAnimationFrame,
} from './RequestAnimationFrame';
import { UseTransitionConfig } from '../react/useTransition';
import { Easing } from '../easing/Easing';

/**
 * TimingAnimation class implements duration based spring animation
 */
export class TimingAnimation extends Animation {
  _startTime: number;
  _fromValue: number;
  _toValue: any;
  _duration: number;
  _easing: (value: number) => number;
  _onFrame: (value: number) => void;
  _animationFrame: any;
  _timeout: any;
  _position: number;

  // Modifiers
  _delay: number;
  _tempDuration: number;
  _onRest?: (value: ResultType) => void;

  constructor({
    initialPosition,
    config,
  }: {
    initialPosition: number;
    config?: Omit<UseTransitionConfig, 'mass' | 'friction' | 'tension'>;
  }) {
    super();

    this._fromValue = initialPosition;
    this._position = this._fromValue;
    this._easing = config?.easing ?? Easing.linear;
    this._duration = config?.duration ?? 500;
    this._tempDuration = this._duration;

    // Modifiers
    // here immediate acts like duration: 0
    if (config?.immediate) {
      this._duration = 0;
    }

    this._delay = config?.delay ?? 0;
    this._onRest = config?.onRest;
  }

  onUpdate() {
    var now = Date.now();
    if (now >= this._startTime + this._duration) {
      if (this._duration === 0) {
        this._position = this._toValue;
        this._onFrame(this._position);
      } else {
        this._position =
          this._fromValue + this._easing(1) * (this._toValue - this._fromValue);
        this._onFrame(this._position);
      }
      this._debounceOnEnd({ finished: true, value: this._position });
      return;
    }

    this._position =
      this._fromValue +
      this._easing((now - this._startTime) / this._duration) *
        (this._toValue - this._fromValue);
    this._onFrame(this._position);

    if (this._active) {
      this._animationFrame = RequestAnimationFrame.current(
        this.onUpdate.bind(this)
      );
    }
  }

  stop() {
    this._active = false;
    clearTimeout(this._timeout);
    CancelAnimationFrame.current(this._animationFrame);
    this._debounceOnEnd({ finished: false, value: this._position });
  }

  // Set value
  set(toValue: number) {
    this.stop();
    this._position = toValue;
    this._onFrame(toValue);
  }

  start({
    toValue,
    onFrame,
    onEnd,
  }: {
    toValue: number;
    onFrame: (value: number) => void;
    onEnd?: (result: ResultType) => void;
  }) {
    const onStart: any = () => {
      this._onFrame = onFrame;
      this._active = true;
      this._onEnd = onEnd;

      this._fromValue = this._position; // animate from lastly animated position to new toValue
      this._toValue = toValue;

      this._startTime = Date.now();
      this._animationFrame = RequestAnimationFrame.current(
        this.onUpdate.bind(this)
      );
    };

    if (this._delay !== 0) {
      this._timeout = setTimeout(() => onStart(), this._delay);
    } else {
      onStart();
    }
  }
}
