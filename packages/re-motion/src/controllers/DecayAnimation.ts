import { Animation } from './Animation';
import {
  RequestAnimationFrame,
  CancelAnimationFrame,
} from './RequestAnimationFrame';

import type { FluidValueConfig, ResultType } from '../types/animation';

export class DecayAnimation extends Animation {
  _startTime: number;
  _fromValue: number;
  _velocity: number;
  _deceleration: number;
  _onFrame: (value: number) => void;
  _animationFrame: any;
  _timeout: any;
  _lastPosition: number;
  _position: number;

  _delay: number;
  _onRest?: (value: ResultType) => void;
  _onChange?: (value: number) => void;

  constructor({
    initialPosition,
    config,
  }: {
    initialPosition: number;
    config?: Pick<
      FluidValueConfig,
      'velocity' | 'deceleration' | 'onStart' | 'onRest' | 'onChange' | 'delay'
    >;
  }) {
    super();

    this._fromValue = initialPosition;
    this._position = this._fromValue;
    this._velocity = config?.velocity ?? 0;
    this._deceleration = config?.deceleration ?? 0.998;

    this._delay = config?.delay ?? 0;
    this._onRest = config?.onRest;
    this._onChange = config?.onChange;
  }

  onChange(value: number) {
    this._onFrame(value);

    if (this._lastPosition !== value) {
      if (this._onChange) this._onChange(value);
    }

    this._lastPosition = value;
  }

  onUpdate() {
    const now = Date.now();

    this._position =
      this._fromValue +
      (this._velocity / (1 - this._deceleration)) *
        (1 - Math.exp(-(1 - this._deceleration) * (now - this._startTime)));

    if (Math.abs(this._lastPosition - this._position) < 0.1) {
      this._debounceOnEnd({ finished: true, value: this._position });
      return;
    }

    this.onChange(this._position);

    this._animationFrame = RequestAnimationFrame.current(
      this.onUpdate.bind(this)
    );
  }

  stop() {
    this._active = false;
    CancelAnimationFrame.current(this._animationFrame);
    this._debounceOnEnd({ finished: false, value: this._position });
  }

  set(toValue: number) {
    this.stop();
    this._position = toValue;
    this.onChange(toValue);
  }

  start = ({
    onFrame,
    previousAnimation,
    onEnd,
  }: {
    onFrame: (value: number) => void;
    previousAnimation?: DecayAnimation;
    onEnd?: (result: ResultType) => void;
  }): void => {
    const onStart = () => {
      this._active = true;
      this._onFrame = onFrame;
      this._onEnd = onEnd;

      const now = Date.now();

      this._startTime = now;

      if (previousAnimation instanceof DecayAnimation) {
        this._velocity = previousAnimation._velocity || this._velocity || 0;
        this._deceleration =
          previousAnimation._deceleration || this._deceleration || 0.998;
      }

      this._animationFrame = RequestAnimationFrame.current(
        this.onUpdate.bind(this)
      );
    };

    if (this._delay !== 0) {
      this._timeout = setTimeout(() => onStart(), this._delay);
    } else {
      onStart();
    }
  };
}
