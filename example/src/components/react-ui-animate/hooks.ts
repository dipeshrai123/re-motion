import {
  decay,
  delay,
  loop,
  MotionValue,
  sequence,
  spring,
  timing,
  useMotionValue,
} from '@raidipesh78/re-motion';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { DriverConfig, ToValue } from './types';
import { withSpring } from './controllers';

export function useValue<V extends number | string>(initialValue: V) {
  const animation = useMotionValue<V>(initialValue);
  const unsubscribeRef = useRef<() => void>();

  const doSet = useCallback(
    (u: ToValue<V>) => {
      unsubscribeRef.current?.();
      unsubscribeRef.current = undefined;

      if (u && typeof u === 'object') {
        const { type, to, options } = u;
        const { onChange, ...restOptions } = options;

        if (onChange) {
          unsubscribeRef.current = animation.subscribe(onChange);
        }

        if (type === 'sequence') {
          const { steps } = restOptions;

          const controllers = steps.map((step) => {
            if (step.type === 'decay') {
              return decay(
                animation as MotionValue<number>,
                step.options.velocity,
                step.options
              );
            }

            if (step.type === 'delay') {
              return delay(step.options.delay);
            }

            const driver = step.type === 'spring' ? spring : timing;
            return driver(
              animation as MotionValue<number>,
              step.to,
              step.options
            );
          });

          const seqCtrl = sequence(controllers);
          seqCtrl.start();

          return;
        }

        if (type === 'loop') {
          const { controller: innerCfg, iterations } = options;

          const buildInner = (cfg: DriverConfig) => {
            if (cfg.type === 'decay') {
              return decay(
                animation as MotionValue<number>,
                cfg.options.velocity,
                cfg.options
              );
            }

            if (cfg.type === 'spring') {
              return spring(
                animation as MotionValue<number>,
                cfg.to,
                cfg.options
              );
            }

            if (cfg.type === 'timing') {
              return timing(
                animation as MotionValue<number>,
                cfg.to,
                cfg.options
              );
            }

            if (cfg.type === 'sequence') {
              return sequence((cfg.options as any).steps.map(buildInner));
            }

            if (cfg.type === 'delay') {
              return delay((cfg.options as any).ms);
            }

            throw new Error(`Unsupported driver type "${cfg.type}" in loop()`);
          };

          const innerCtrl = buildInner(innerCfg as DriverConfig);
          const loopCtrl = loop(innerCtrl, iterations as number);
          loopCtrl.start();

          return;
        }

        if (type === 'spring') {
          spring(animation as MotionValue<number>, to, restOptions).start();
        } else if (type === 'timing') {
          timing(animation as MotionValue<number>, to, restOptions).start();
        } else if (type === 'decay') {
          decay(
            animation as MotionValue<number>,
            options.velocity,
            restOptions
          ).start();
        }
        return;
      } else {
        animation.set(u as V);
      }
    },
    [animation]
  );

  useEffect(() => {
    return () => {
      unsubscribeRef.current?.();
      unsubscribeRef.current = undefined;
    };
  }, []);

  return {
    get value(): MotionValue<V> {
      return animation;
    },
    set value(u: MotionValue<V> | ToValue<V>) {
      if (u instanceof MotionValue) return;
      doSet(u);
    },
    get currentValue(): V {
      return animation.current;
    },
  };
}

export interface UseMountConfig {
  from?: number;
  enter?: DriverConfig;
  exit?: DriverConfig;
}

export const useMount = (state: boolean, config?: UseMountConfig) => {
  const [mounted, setMounted] = useState(state);
  const animationConfig = useRef({
    from: config?.from ?? 0,
    enter: config?.enter ?? withSpring(1),
    exit: config?.exit ?? withSpring(0),
  }).current;

  const animation = useValue(animationConfig.from);
  const enterAnimation = animationConfig.enter;
  const exitAnimation = animationConfig.exit;

  useLayoutEffect(() => {
    if (state) {
      setMounted(true);
      queueMicrotask(() => {
        animation.value = enterAnimation;
      });
    } else {
      queueMicrotask(() => {
        animation.value = {
          ...exitAnimation,
          options: {
            ...exitAnimation.options,
            onComplete: () => {
              setMounted(false);
              exitAnimation.options.onComplete?.();
              animation.value.destroy(); // HACK - destroy the subscriptions to avoid exponential subscription growth
            },
          },
        };
      });
    }
  }, [state, enterAnimation, exitAnimation, animation]);

  return function (
    fn: (animation: { value: MotionValue }, mounted: boolean) => React.ReactNode
  ) {
    return fn({ value: animation.value }, mounted);
  };
};
