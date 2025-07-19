import { createAnimator } from '../core/animator';

export interface WithSpringConfig {
  stiffness?: number;
  damping?: number;
  mass?: number;
  velocity?: number;
}

export function withSpring(
  target: number,
  userConfig?: WithSpringConfig,
  callback?: (finished: boolean) => void
) {
  return createAnimator(() => {
    const defaultConfig: Required<WithSpringConfig> = {
      stiffness: 100,
      damping: 10,
      mass: 1,
      velocity: 0,
    };

    const config = {
      ...defaultConfig,
      ...userConfig,
    };

    function start(
      animator: any,
      value: number,
      now: number,
      previous: any
    ): void {
      animator.current = value;

      if (previous && previous.type === 'spring') {
        animator.velocity = previous.velocity;
      } else {
        animator.velocity = config.velocity || 0;
      }

      animator.lastTimestamp = previous?.lastTimestamp || now;
    }

    function step(animation: any, now: number): boolean {
      const dt = Math.min(now - animation.lastTimestamp, 64);
      animation.lastTimestamp = now;

      const t = dt / 1000;
      const c = config.damping;
      const m = config.mass;
      const k = config.stiffness;
      const v0 = animation.velocity;
      const x0 = animation.current - animation.target;

      const zeta = c / (2 * Math.sqrt(k * m));
      const omega0 = Math.sqrt(k / m);
      const omega1 = omega0 * Math.sqrt(1 - zeta * zeta);

      let nextPos: number, nextVel: number;
      if (zeta < 1) {
        const env = Math.exp(-zeta * omega0 * t);
        const frag =
          env *
          (Math.sin(omega1 * t) * ((-v0 + zeta * omega0 * x0) / omega1) +
            Math.cos(omega1 * t) * x0);
        nextPos = animation.target + frag;
        nextVel =
          zeta * omega0 * frag -
          env *
            (Math.cos(omega1 * t) * (-v0 + zeta * omega0 * x0) -
              omega1 * x0 * Math.sin(omega1 * t));
      } else {
        const env = Math.exp(-omega0 * t);
        nextPos = animation.target + env * (x0 + (-v0 + omega0 * x0) * t);
        nextVel = env * (-v0 * (omega0 * t - 1) - t * x0 * omega0 * omega0);
      }

      animation.current = nextPos;
      animation.velocity = nextVel;

      const isRestV = Math.abs(nextVel) < 0.001;
      const isRestX = Math.abs(animation.target - nextPos) < 0.001;

      if (isRestV && isRestX) {
        animation.current = animation.target;
        animation.velocity = 0;
        return true;
      }

      return false;
    }

    return {
      type: 'spring',
      start,
      step,
      target,
      current: target,
      velocity: config.velocity || 0,
      callback,
      lastTimestamp: 0,
      origin: 0,
    };
  });
}
