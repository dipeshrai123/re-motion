// v5/drivers.ts
import { FluidValue } from './value';
import { Easing } from './easing';

// Per-value state maps for each driver
const timingMap = new WeakMap<FluidValue<number>, { cancel(): void }>();
const springMap = new WeakMap<FluidValue<number>, { cancel(): void }>();
const decayMap = new WeakMap<FluidValue<number>, { cancel(): void }>();

/** Cancel *all* drivers on this progress */
function cancelAll(progress: FluidValue<number>) {
  const t = timingMap.get(progress);
  if (t) {
    t.cancel();
    timingMap.delete(progress);
  }

  const s = springMap.get(progress);
  if (s) {
    s.cancel();
    springMap.delete(progress);
  }

  const d = decayMap.get(progress);
  if (d) {
    d.cancel();
    decayMap.delete(progress);
  }
}

// ————————————————————————————————————————————————
// timing: numeric animation over `duration` with `easing`
// ————————————————————————————————————————————————
interface TimingOpts {
  duration?: number;
  easing?: (t: number) => number;
}
export function timing(
  progress: FluidValue<number>,
  to: number,
  { duration = 300, easing = Easing.linear }: TimingOpts = {}
): void {
  cancelAll(progress);

  let cancelled = false;
  const start = performance.now();
  const from = progress.current;
  let frameId: number;

  const animate = (now: number) => {
    if (cancelled) return;
    const t = Math.min(1, (now - start) / duration);
    progress.set(from + (to - from) * easing(t));

    if (t < 1) {
      frameId = requestAnimationFrame(animate);
    } else {
      timingMap.delete(progress);
    }
  };

  frameId = requestAnimationFrame(animate);
  timingMap.set(progress, {
    cancel: () => {
      cancelled = true;
      cancelAnimationFrame(frameId);
    },
  });
}

// ————————————————————————————————————————————————
// spring: damped‐spring physics to `to`
// ————————————————————————————————————————————————
interface SpringOpts {
  stiffness?: number;
  damping?: number;
}
export function spring(
  progress: FluidValue<number>,
  to: number,
  { stiffness = 170, damping = 26 }: SpringOpts = {}
): void {
  cancelAll(progress);

  let velocity = 0;
  let cancelled = false;
  let frameId: number;

  const animate = () => {
    if (cancelled) return;

    const x = progress.current;
    const F = -stiffness * (x - to) - damping * velocity;
    velocity += F * (1 / 60);
    const next = x + velocity * (1 / 60);

    progress.set(next);

    if (Math.abs(velocity) > 0.001 || Math.abs(x - to) > 0.001) {
      frameId = requestAnimationFrame(animate);
    } else {
      springMap.delete(progress);
    }
  };

  frameId = requestAnimationFrame(animate);
  springMap.set(progress, {
    cancel: () => {
      cancelled = true;
      cancelAnimationFrame(frameId);
    },
  });
}

// ————————————————————————————————————————————————
// decay: inertial decay from `initialVelocity`
// ————————————————————————————————————————————————
interface DecayOpts {
  decay?: number;
}
export function decay(
  progress: FluidValue<number>,
  initialVelocity: number,
  { decay = 0.998 }: DecayOpts = {}
): void {
  cancelAll(progress);

  let velocity = initialVelocity;
  let cancelled = false;
  let frameId: number;

  const animate = () => {
    if (cancelled) return;

    velocity *= decay;
    const next = progress.current + velocity * (1 / 60);
    progress.set(next);

    if (Math.abs(velocity) > 0.001) {
      frameId = requestAnimationFrame(animate);
    } else {
      decayMap.delete(progress);
    }
  };

  frameId = requestAnimationFrame(animate);
  decayMap.set(progress, {
    cancel: () => {
      cancelled = true;
      cancelAnimationFrame(frameId);
    },
  });
}
