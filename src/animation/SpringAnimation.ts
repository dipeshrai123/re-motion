import { Animation } from './Animation';
import { ResultType } from './Types';
import {
  RequestAnimationFrame,
  CancelAnimationFrame,
} from './RequestAnimationFrame';
import { UseTransitionConfig } from '../react/useTransition';

/**
 * SpringAnimation class implements physics based spring animation
 */
export class SpringAnimation extends Animation {
  _overshootClamping: boolean;
  _restDisplacementThreshold: number;
  _restSpeedThreshold: number;
  _initialVelocity?: number;
  _lastVelocity: number;
  _startPosition: number;
  _position: number;
  _fromValue: number;
  _toValue: any;
  _mass: number;
  _tension: number;
  _friction: number;
  _lastTime: number;
  _onFrame: (value: number) => void;
  _animationFrame: any;
  _timeout: any;

  // Modifiers
  _delay: number;
  _onRest?: (value: ResultType) => void;
  _onChange?: (value: number) => void;

  constructor({
    initialPosition,
    config,
  }: {
    initialPosition: number;
    config?: Omit<UseTransitionConfig, 'duration' | 'easing'>;
  }) {
    super();

    this._overshootClamping = false;
    this._initialVelocity = 0;
    this._lastVelocity = 0;
    this._startPosition = initialPosition;
    this._position = this._startPosition;

    this._restDisplacementThreshold = config?.restDistance ?? 0.24;
    this._restSpeedThreshold = config?.restDistance ?? 0.24;
    this._mass = config?.mass ?? 1;
    this._tension = config?.tension ?? 170;
    this._friction = config?.friction ?? 26;
    this._delay = config?.delay ?? 0;

    this._onRest = config?.onRest;
    this._onChange = config?.onChange;
  }

  onChange(value: number) {
    this._onFrame(value);

    if (this._onChange) {
      this._onChange(value);
    }
  }

  onUpdate() {
    var position = this._position;
    var velocity = this._lastVelocity;

    var tempPosition = this._position;
    var tempVelocity = this._lastVelocity;

    var MAX_STEPS = 64;
    var now = Date.now();
    if (now > this._lastTime + MAX_STEPS) {
      now = this._lastTime + MAX_STEPS;
    }

    var TIMESTEP_MSEC = 1;
    var numSteps = Math.floor((now - this._lastTime) / TIMESTEP_MSEC);

    for (var i = 0; i < numSteps; ++i) {
      var step = TIMESTEP_MSEC / 1000;

      var aVelocity = velocity;
      var aAcceleration =
        this._tension * (this._toValue - tempPosition) -
        this._friction * tempVelocity;

      var bVelocity = tempVelocity;
      var bAcceleration =
        this._tension * (this._toValue - tempPosition) -
        this._friction * tempVelocity;
      tempPosition = position + (bVelocity * step) / 2;
      tempVelocity = velocity + (bAcceleration * step) / 2;

      var cVelocity = tempVelocity;
      var cAcceleration =
        this._tension * (this._toValue - tempPosition) -
        this._friction * tempVelocity;
      tempPosition = position + (cVelocity * step) / 2;
      tempVelocity = velocity + (cAcceleration * step) / 2;

      var dVelocity = tempVelocity;
      var dAcceleration =
        this._tension * (this._toValue - tempPosition) -
        this._friction * tempVelocity;
      tempPosition = position + (cVelocity * step) / 2;
      tempVelocity = velocity + (cAcceleration * step) / 2;

      var dxdt = (aVelocity + 2 * (bVelocity + cVelocity) + dVelocity) / 6;
      var dvdt =
        (aAcceleration + 2 * (bAcceleration + cAcceleration) + dAcceleration) /
        6;

      position += dxdt * step;
      velocity += dvdt * step;
    }

    this._lastTime = now;
    this._position = position;
    this._lastVelocity = velocity;

    this.onChange(position);

    if (!this._active) {
      return;
    }

    var isOvershooting = false;
    if (this._overshootClamping && this._tension !== 0) {
      if (this._startPosition < this._toValue) {
        isOvershooting = position > this._toValue;
      } else {
        isOvershooting = position < this._toValue;
      }
    }
    var isVelocity = Math.abs(velocity) <= this._restSpeedThreshold;
    var isDisplacement = true;
    if (this._tension !== 0) {
      isDisplacement =
        Math.abs(this._toValue - position) <= this._restDisplacementThreshold;
    }

    if (isOvershooting || (isVelocity && isDisplacement)) {
      if (this._tension !== 0) {
        this._lastVelocity = 0;
        this._position = this._toValue;

        this.onChange(this._toValue);
      }

      this._lastTime = 0; // reset time

      this._debounceOnEnd({ finished: true, value: this._toValue });
      return;
    }

    this._animationFrame = RequestAnimationFrame.current(
      this.onUpdate.bind(this)
    );
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
    this._lastTime = 0;
    this._lastVelocity = 0;
    this.onChange(toValue);
  }

  start({
    toValue,
    onFrame,
    previousAnimation,
    onEnd,
  }: {
    toValue: number;
    onFrame: (value: number) => void;
    previousAnimation?: SpringAnimation;
    onEnd?: (result: ResultType) => void;
  }) {
    const onStart: any = () => {
      this._onFrame = onFrame;
      this._active = true;
      this._toValue = toValue;
      this._onEnd = onEnd;

      const now = Date.now();

      if (previousAnimation instanceof SpringAnimation) {
        this._lastVelocity =
          previousAnimation._lastVelocity || this._lastVelocity || 0;
        this._lastTime = previousAnimation._lastTime || now;
      } else {
        this._lastTime = now;
      }

      this.onUpdate();
    };

    if (this._delay !== 0) {
      this._timeout = setTimeout(() => onStart(), this._delay);
    } else {
      onStart();
    }
  }
}
