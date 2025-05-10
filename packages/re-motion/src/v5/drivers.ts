import { MotionValue } from './value';
import { Easing } from './easing';

const timingMap = new WeakMap<MotionValue<number>, { cancel(): void }>();
const springMap = new WeakMap<MotionValue<number>, { cancel(): void }>();
const decayMap = new WeakMap<MotionValue<number>, { cancel(): void }>();

function cancelAll(progress: MotionValue<number>) {
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

export interface TimingOpts {
  duration?: number;
  easing?: (t: number) => number;
  onComplete?: () => void;
}

export function timing(
  progress: MotionValue<number>,
  to: number,
  { duration = 300, easing = Easing.linear, onComplete }: TimingOpts = {}
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
      progress.set(to);
      timingMap.delete(progress);
      if (onComplete) onComplete();
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

export interface SpringOpts {
  stiffness?: number;
  damping?: number;
  onComplete?: () => void;
}

export function spring(
  progress: MotionValue<number>,
  to: number,
  { stiffness = 170, damping = 26, onComplete }: SpringOpts = {}
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
      progress.set(to);
      springMap.delete(progress);
      if (onComplete) onComplete();
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

export interface DecayOpts {
  decay?: number;
  onComplete?: () => void;
}

export function decay(
  progress: MotionValue<number>,
  initialVelocity: number,
  { decay = 0.998, onComplete }: DecayOpts = {}
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
      if (onComplete) onComplete();
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
