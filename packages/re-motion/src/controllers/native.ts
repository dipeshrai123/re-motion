import { EndResultType, FluidAnimation } from '../animations/FluidAnimation';
import { FluidValue } from '../fluids/FluidValue';

import type { ControllerAnimation } from './types';

type NativeConfig = { toValue: string; delay?: number };

export const native = (
  value: FluidValue,
  config: NativeConfig
): ControllerAnimation => {
  const start = (callback?: (value: EndResultType) => void) => {
    class NativeValue extends FluidAnimation {
      private fromValue: string;
      private toValue: string;
      private delay: number;
      private timeout: any;
      private onFrame: (value: string) => void;

      constructor(config: NativeConfig) {
        super();
        this.toValue = config.toValue;
        this.delay = config.delay ?? 0;
      }

      start(
        value: string,
        onFrame: (value: string) => void,
        onEnd: (result: EndResultType) => void | null
      ) {
        const onStart = () => {
          this.fromValue = value;
          this.onFrame = onFrame;
          this.onEnd = onEnd;

          requestAnimationFrame(this.onUpdate.bind(this));

          void this.fromValue;
        };

        if (this.delay !== 0) {
          this.timeout = setTimeout(() => onStart(), this.delay);
        } else {
          onStart();
        }
      }

      stop() {
        clearTimeout(this.timeout);
        this.debouncedOnEnd({ finished: false, value: this.toValue });
      }

      onUpdate() {
        this.debouncedOnEnd({ finished: true, value: this.toValue });
        this.onFrame(this.toValue);
      }
    }

    value.animate(new NativeValue(config), callback);
  };

  const stop = () => {
    value.stopAnimation();
  };

  const reset = () => {
    value.resetAnimation();
  };

  return { start, stop, reset };
};
