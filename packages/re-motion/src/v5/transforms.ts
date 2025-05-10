// transforms.ts
import { FluidValue } from './value';

// ————————————————————————————————————————————————
// interpolate: map a numeric FluidValue through one or more ranges
// ————————————————————————————————————————————————
export function interpolate(
  input: FluidValue<number>,
  inputRange: [number, number][],
  outputRange: [number, number][],
  easingFns: Array<(t: number) => number> = []
): FluidValue<number> {
  const out = new FluidValue(0);

  input.subscribe((t) => {
    // find the segment index
    let idx = inputRange.findIndex(([a, b]) => t >= a && t <= b);
    if (idx === -1) idx = inputRange.length - 1;

    const [inA, inB] = inputRange[idx];
    const [outA, outB] = outputRange[idx];
    let p = (t - inA) / (inB - inA);

    if (easingFns[idx]) p = easingFns[idx](p);
    out.set(outA + (outB - outA) * p);
  });

  return out;
}

// ————————————————————————————————————————————————
// combine: zip multiple FluidValues into one via a combiner fn
// ————————————————————————————————————————————————
export function combine<T extends any[]>(
  inputs: { [K in keyof T]: FluidValue<T[K]> },
  combiner: (...values: T) => any
): FluidValue<any> {
  // initialize with current values
  const init = inputs.map((v) => v.current) as T;
  const out = new FluidValue(combiner(...init));

  const update = () => {
    const vals = inputs.map((v) => v.current) as T;
    out.set(combiner(...vals));
  };

  inputs.forEach((v) => v.subscribe(update));
  return out;
}
