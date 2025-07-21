import {
  decay,
  DecayConfig,
  sequence,
  spring,
  SpringConfig,
  timing,
  TimingConfig,
} from '@raidipesh78/re-motion';
import type { Callbacks } from './types';

export const withSpring = (
  target: number,
  option?: SpringConfig & Callbacks
) => {
  const { onStart, onChange, onComplete, ...rest } = option || {};
  return {
    ctrl: spring(target, rest, (f) => f && onComplete?.()),
    cbs: {
      onStart,
      onChange,
    },
  };
};

export const withTiming = (
  target: number,
  option?: TimingConfig & Callbacks
) => {
  const { onStart, onChange, onComplete, ...rest } = option || {};
  return {
    ctrl: timing(target, rest, (f) => f && onComplete?.()),
    cbs: {
      onStart,
      onChange,
    },
  };
};

export const withDecay = (option?: DecayConfig & Callbacks) => {
  const { onStart, onChange, onComplete, ...rest } = option || {};
  return {
    ctrl: decay(rest, (f) => f && onComplete?.()),
    cbs: {
      onStart,
      onChange,
    },
  };
};

// export const withSequence = (option?: Callbacks) => {
//   const { onStart, onChange, onComplete } = option || {};

//   return {
//     ctrl: sequence(rest, (f) => f && onComplete?.()),
//     cbs: {
//       onStart,
//       onChange,
//     },
//   };
// }
