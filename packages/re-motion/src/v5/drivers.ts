// drivers.ts
import { fluidValue, FluidValue } from './value';
import { Easing } from './easing';

type NumOrFluid = number | FluidValue<number>;

interface TimingOpts {
  duration?: number;
  easing?: (t: number) => number;
}

interface SpringOpts {
  stiffness?: number;
  damping?: number;
}

interface DecayOpts {
  velocity?: number;
  decay?: number;
}

// ————————————————————————————————————————————————
// timing: either timing(from, to, opts) or timing(fv, to, opts)
// ————————————————————————————————————————————————
export function timing(
  fromOrFv: NumOrFluid,
  to?: number,
  { duration = 300, easing = Easing.linear }: TimingOpts = {}
): FluidValue<number> {
  const fv = fromOrFv instanceof FluidValue ? fromOrFv : fluidValue(fromOrFv);

  const start = performance.now();
  const from = fv.current;
  const target = to!;

  function frame(now: number) {
    const t = Math.min(1, (now - start) / duration);
    fv.set(from + (target - from) * easing(t));
    if (t < 1) requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
  return fv;
}

// ————————————————————————————————————————————————
// spring: either spring(from, to, opts) or spring(fv, to, opts)
// ————————————————————————————————————————————————
export function spring(
  fromOrFv: NumOrFluid,
  toOrOpts?: number | SpringOpts,
  maybeOpts: SpringOpts = {}
): FluidValue<number> {
  let fv: FluidValue<number>;
  let to: number;
  let opts: SpringOpts;

  if (fromOrFv instanceof FluidValue) {
    fv = fromOrFv;
    to = typeof toOrOpts === 'number' ? toOrOpts : fv.current;
    opts = typeof toOrOpts === 'object' ? toOrOpts : maybeOpts;
  } else {
    fv = fluidValue(fromOrFv);
    to = typeof toOrOpts === 'number' ? toOrOpts : fromOrFv;
    opts = typeof toOrOpts === 'object' ? toOrOpts : maybeOpts;
  }

  const { stiffness = 170, damping = 26 } = opts;
  let velocity = 0;

  function animate() {
    const x = fv.current;
    const F = -stiffness * (x - to) - damping * velocity;
    velocity += F * (1 / 60);
    const next = x + velocity * (1 / 60);
    fv.set(next);
    if (Math.abs(velocity) > 0.001 || Math.abs(x - to) > 0.001) {
      requestAnimationFrame(animate);
    }
  }

  animate();
  return fv;
}

// ————————————————————————————————————————————————
// decay: either decay(from, opts) or decay(fv, opts)
// ————————————————————————————————————————————————
export function decay(
  fromOrFv: NumOrFluid,
  opts: DecayOpts = {}
): FluidValue<number> {
  const fv = fromOrFv instanceof FluidValue ? fromOrFv : fluidValue(fromOrFv);

  let { velocity = 0, decay: decayFactor = 0.998 } = opts;

  function animate() {
    velocity *= decayFactor;
    const next = fv.current + velocity * (1 / 60);
    fv.set(next);
    if (Math.abs(velocity) > 0.001) {
      requestAnimationFrame(animate);
    }
  }

  animate();
  return fv;
}
