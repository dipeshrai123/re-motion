import { Fluid } from './Fluid';

export class FluidSubscriptions extends Fluid {
  private subcriptions: Array<Fluid> = [];

  public addSubscription(subscription: Fluid) {
    if (this.subcriptions.length === 0) {
      this.attach();
    }

    this.subcriptions.push(subscription);
  }

  public removeSubscription(subscription: Fluid) {
    const index = this.subcriptions.indexOf(subscription);
    if (index === -1) {
      console.warn("Trying to remove a child that doesn't exist");
      return;
    }

    this.subcriptions.splice(index, 1);
    if (this.subcriptions.length === 0) {
      this.detach();
    }
  }

  public getSubscriptions() {
    return this.subcriptions;
  }
}
