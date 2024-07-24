import { Fluid } from './Fluid';

export class FluidStyle extends Fluid {
  private style: Record<string, any>;

  constructor(style: Record<string, any>) {
    super();
    this.style = style;
  }

  public attach() {
    for (const value of Object.values(this.style)) {
      if (value instanceof Fluid) {
        value.addSubscription(this);
      }
    }
  }

  public detach() {
    for (const value of Object.entries(this.style)) {
      if (value instanceof Fluid) {
        value.removeSubscription(this);
      }
    }
  }

  public get() {
    const result: Record<string, any> = {};

    for (const [property, value] of Object.entries(this.style)) {
      if (value instanceof Fluid) {
        result[property] = value.get();
      } else {
        result[property] = value;
      }
    }

    return result;
  }
}
