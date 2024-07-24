import { Fluid } from './Fluid';

export class FluidInterpolation extends Fluid {
  private parent: Fluid;
  private interpolate: (value: number) => number | string;

  constructor(parent: Fluid, interpolate: (value: number) => number | string) {
    super();

    this.parent = parent;
    this.interpolate = interpolate;
  }

  get() {
    const value = this.parent.get();
    if (typeof value !== 'number') {
      throw new Error('Cannot interpolate value');
    }

    return this.interpolate(value);
  }
}
