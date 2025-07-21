import {
  decay,
  MotionValue,
  spring,
  timing,
  delay,
  sequence,
  repeat,
} from '@raidipesh78/re-motion';

import { clean, filterCallbackOptions } from './helpers';
import type { Primitive, Descriptor } from './types';

let onChangeSub: null | (() => void) = null;

function getAnimation(type: 'spring' | 'timing' | 'decay') {
  switch (type) {
    case 'spring':
      return spring;
    case 'timing':
      return timing;
    case 'decay':
      return decay;
    // case 'loop':
    //   return repeat
    // case 'sequence':
    //   return sequence
    // case 'delay':
    //   return delay
  }
}

export function buildAnimation(
  mv: MotionValue<Primitive>,
  { type, to, options = {} }: Descriptor
) {
  // onChangeSub?.();
  // const { onComplete, onStart, onChange, ...cleanOption } = clean(options);
  // if (onStart) onStart();
  // if (onChange) {
  //   onChangeSub = mv.onChange(onChange);
  // }
  // const cb = (finished: boolean) => finished && onComplete?.();

  const c = clean(options);
  switch (type) {
    case 'timing':
    case 'spring': {
      if (typeof to !== 'number') return;

      const a = getAnimation(type);
      mv.set(a(to, c as any));
      break;
    }
    case 'decay': {
      const a = getAnimation(type);
      mv.set(a(c as any));
      break;
    }
    case 'delay': {
      const a = getAnimation(c.descriptor.type as any);
      mv.set(
        delay(
          c.delay,
          a(c.descriptor.to as any, clean(c.descriptor.options) as any)
        )
      );
      break;
    }
  }
}

// if((type === 'spring' || type === 'timing' || type === 'decay') && typeof to === 'number') {
//   const a = getAnimation(mv, type, to);

//   mv.set(a())
// } else if(type === 'delay') {
//   mv.set()
// }
//   case 'sequence': {
//     const animations = options.animations ?? [];
//     const ctrls = animations.map((step) => buildAnimation(mv, step));
//     return sequence(ctrls, options);
//   }
//   case 'loop': {
//     const innerDesc = options.animation;

//     if (!innerDesc) {
//       console.warn('[buildAnimation] loop missing `animation` descriptor');
//       return { start() {}, pause() {}, resume() {}, cancel() {}, reset() {} };
//     }

//     const innerCtrl =
//       innerDesc.type === 'sequence'
//         ? sequence(
//             (innerDesc.options?.animations ?? []).map((s) =>
//               buildAnimation(mv, s)
//             ),
//             innerDesc.options
//           )
//         : buildAnimation(mv, innerDesc);

//     return loop(innerCtrl, options.iterations ?? 0, options);
//   }
// }

//   export function buildParallel(
//     mvMap: Record<string, MotionValue<Primitive>>,
//     step: Descriptor
//   ) {
//     const entries = Object.entries(mvMap).filter(([key]) => {
//       return (
//         step.type === 'decay' ||
//         step.type === 'delay' ||
//         (step.to as Record<string, Primitive>)[key] !== undefined
//       );
//     });

//     const ctrls = entries.map(([key, mv], idx) =>
//       buildAnimation(mv, {
//         type: step.type,
//         to:
//           step.type === 'decay' || step.type === 'delay'
//             ? (step.to as any)
//             : (step.to as Record<string, Primitive>)[key],
//         options: filterCallbackOptions(step.options, idx === 0),
//       })
//     );

//     return parallel(ctrls);
//   }
