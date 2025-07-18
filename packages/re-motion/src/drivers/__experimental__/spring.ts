// withSpring.ts
import { defineAnimation } from './defineAnimation';

export interface SpringConfig {
  stiffness?: number;
  damping?: number;
  mass?: number;
  velocity?: number;
}

export function withSpring(
  toValue: number,
  userConfig?: SpringConfig,
  callback?: (finished: boolean) => void
) {
  return defineAnimation(() => {
    const defaultConfig: SpringConfig = {
      stiffness: 100,
      damping: 10,
      mass: 1,
      velocity: 0,
    } as const;

    const config = {
      ...defaultConfig,
      ...userConfig,
    };

    function onFrame(animation: any, now: number): boolean {
      const { toValue: target, current } = animation;

      // cap dt at 64ms to avoid huge jumps
      const dtMs = Math.min(now - animation.lastTimestamp, 64);
      animation.lastTimestamp = now;

      const t = dtMs / 1000;
      const v0 = animation.velocity as number;
      const x0 = current - (target as number);
      const { zeta, omega0, omega1 } = animation;

      const { position: nextPos, velocity: nextVel } =
        zeta < 1
          ? underDampedSpringCalculations(animation, {
              zeta,
              v0,
              x0,
              omega0,
              omega1,
              t,
            })
          : criticallyDampedSpringCalculations(animation, {
              v0,
              x0,
              omega0,
              t,
            });

      animation.current = nextPos;
      animation.velocity = nextVel;

      if (isAnimationTerminatingCalculation(animation, config)) {
        animation.velocity = 0;
        animation.current = target as any;
        animation.lastTimestamp = 0;
        return true;
      }
      return false;
    }

    // 3) onStart: initialize thresholds, continuity, damping/omega, etc.
    function onStart(
      animation: any,
      value: number,
      now: number,
      previousAnimation?: any
    ): void {
      animation.current = value;

      const triggeredTwice =
        previousAnimation?.startTimestamp &&
        previousAnimation.toValue === animation.toValue;

      // Compute initial displacement x0
      const x0 = triggeredTwice
        ? (previousAnimation!.startValue as number)
        : value - (animation.toValue as number);

      animation.startValue = x0;

      // Carry over or reset velocity
      animation.velocity = triggeredTwice
        ? previousAnimation!.velocity
        : (previousAnimation?.velocity || 0) + config.velocity;

      // Compute zeta, omega0, omega1
      if (triggeredTwice) {
        animation.zeta = previousAnimation!.zeta;
        animation.omega0 = previousAnimation!.omega0;
        animation.omega1 = previousAnimation!.omega1;
      } else {
        const { zeta, omega0, omega1 } = initialCalculations(config);
        animation.zeta = zeta;
        animation.omega0 = omega0;
        animation.omega1 = omega1;
      }

      // Store energy, timestamps
      animation.initialEnergy = getEnergy(
        x0,
        config.velocity!,
        config.stiffness!,
        config.mass!
      );
      animation.lastTimestamp = previousAnimation?.lastTimestamp || now;
      animation.startTimestamp = triggeredTwice
        ? previousAnimation!.startTimestamp
        : now;
    }

    // 4) return your SpringAnimation object
    return {
      type: 'spring',
      onStart,
      onFrame,
      toValue,
      current: toValue,
      startValue: 0,
      velocity: config.velocity || 0,
      callback,
      lastTimestamp: 0,
      startTimestamp: 0,
      zeta: 0,
      omega0: 0,
      omega1: 0,
      initialEnergy: 0,
    };
  });
}

export function underDampedSpringCalculations(
  animation: any,
  precalculatedValues: {
    zeta: number;
    v0: number;
    x0: number;
    omega0: number;
    omega1: number;
    t: number;
  }
): { position: number; velocity: number } {
  const { toValue } = animation;

  const { zeta, t, omega0, omega1, x0, v0 } = precalculatedValues;

  const sin1 = Math.sin(omega1 * t);
  const cos1 = Math.cos(omega1 * t);

  // under damped
  const underDampedEnvelope = Math.exp(-zeta * omega0 * t);
  const underDampedFrag1 =
    underDampedEnvelope *
    (sin1 * ((v0 + zeta * omega0 * x0) / omega1) + x0 * cos1);

  const underDampedPosition = toValue + underDampedFrag1;
  // This looks crazy -- it's actually just the derivative of the oscillation function
  const underDampedVelocity =
    -zeta * omega0 * underDampedFrag1 +
    underDampedEnvelope *
      (cos1 * (v0 + zeta * omega0 * x0) - omega1 * x0 * sin1);

  return { position: underDampedPosition, velocity: underDampedVelocity };
}

export function initialCalculations(config: any): {
  zeta: number;
  omega0: number;
  omega1: number;
} {
  const { damping: c, mass: m, stiffness: k } = config;

  const zeta = c / (2 * Math.sqrt(k * m)); // damping ratio
  const omega0 = Math.sqrt(k / m); // undamped angular frequency of the oscillator (rad/ms)
  const omega1 = omega0 * Math.sqrt(1 - zeta ** 2); // exponential decay

  return { zeta, omega0, omega1 };
}

export function getEnergy(
  displacement: number,
  velocity: number,
  stiffness: number,
  mass: number
) {
  const potentialEnergy = 0.5 * stiffness * displacement ** 2;
  const kineticEnergy = 0.5 * mass * velocity ** 2;
  return potentialEnergy + kineticEnergy;
}

export function criticallyDampedSpringCalculations(
  animation: any,
  precalculatedValues: {
    v0: number;
    x0: number;
    omega0: number;
    t: number;
  }
): { position: number; velocity: number } {
  'worklet';
  const { toValue } = animation;

  const { v0, x0, omega0, t } = precalculatedValues;

  const criticallyDampedEnvelope = Math.exp(-omega0 * t);
  const criticallyDampedPosition =
    toValue + criticallyDampedEnvelope * (x0 + (v0 + omega0 * x0) * t);

  const criticallyDampedVelocity =
    criticallyDampedEnvelope * -omega0 * (x0 + (v0 + omega0 * x0) * t) +
    criticallyDampedEnvelope * (v0 + omega0 * x0);

  return {
    position: criticallyDampedPosition,
    velocity: criticallyDampedVelocity,
  };
}

export function isAnimationTerminatingCalculation(
  animation: any,
  config: any
): boolean {
  const { toValue, velocity, startValue, current, initialEnergy } = animation;

  if (config.overshootClamping) {
    if (
      (current > toValue && startValue < toValue) ||
      (current < toValue && startValue > toValue)
    ) {
      return true;
    }
  }
  const currentEnergy = getEnergy(
    toValue - current,
    velocity,
    config.stiffness,
    config.mass
  );

  return (
    initialEnergy === 0 ||
    currentEnergy / initialEnergy <= config.energyThreshold
  );
}
