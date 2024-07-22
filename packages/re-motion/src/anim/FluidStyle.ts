import { FluidValue } from './FluidValue';

export class FluidStyle {
  private style: Record<string, any>;
  private callback: () => void;

  constructor(style: Record<string, any>, callback: () => void) {
    this.style = style;
    this.callback = callback;

    this.addSubscription();
  }

  private addSubscription() {
    for (const value of Object.values(this.style)) {
      if (value instanceof FluidValue) {
        value.addSubscription(this as any);
      }
    }
  }

  public get() {
    const result: Record<string, any> = {};

    for (const [property, value] of Object.entries(this.style)) {
      if (value instanceof FluidValue) {
        result[property] = value.get();
      } else {
        result[property] = value;
      }
    }

    return result;
  }

  public update() {
    this.callback();
  }
}
