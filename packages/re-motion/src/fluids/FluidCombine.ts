import { FluidSubscriptions } from './FluidSubscriptions';
import type { Fluid } from './Fluid';

export class FluidCombine extends FluidSubscriptions {
  private inputs: Fluid[];
  private combiner: (...vals: any[]) => any;

  constructor(inputs: Fluid[], combiner: (...vals: any[]) => any) {
    super();
    this.inputs = inputs;
    this.combiner = combiner;
  }

  public get() {
    return this.combiner(...this.inputs.map((inp) => inp.get()));
  }

  public attach(): void {
    super.attach();
    for (const inp of this.inputs) {
      inp.addSubscription(this);
      inp.attach();
    }
  }

  public detach(): void {
    super.detach();
    for (const inp of this.inputs) {
      inp.removeSubscription(this);
      inp.detach();
    }
  }
}

export function combine<T>(
  inputs: Fluid[],
  combiner: (...vals: any[]) => T
): FluidCombine {
  return new FluidCombine(inputs, combiner);
}
