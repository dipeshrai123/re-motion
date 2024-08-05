import { Fluid } from './Fluid';
import { FluidSubscriptions } from './FluidSubscriptions';

export class FluidInterpolation extends FluidSubscriptions {
  private parent: Fluid;
  private interpolate: (value: number) => number | string;

  constructor(parent: Fluid, interpolate: (value: number) => number | string) {
    super();

    this.parent = parent;
    this.interpolate = interpolate;
  }

  public get() {
    const value = this.parent.get();
    if (typeof value !== 'number') {
      throw new Error('Cannot interpolate value');
    }

    return this.interpolate(value);
  }

  public attach() {
    this.parent.addSubscription(this);
  }

  public detach() {
    this.parent.removeSubscription(this);
  }
}
