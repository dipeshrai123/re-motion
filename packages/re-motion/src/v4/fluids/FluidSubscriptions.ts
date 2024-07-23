import { Fluid } from './Fluid';

export class FluidSubscriptions extends Fluid {
  private subcriptions: Array<Fluid> = [];

  public addSubscription(subscription: Fluid) {
    this.subcriptions.push(subscription);
  }

  public getSubscriptions() {
    return this.subcriptions;
  }
}
