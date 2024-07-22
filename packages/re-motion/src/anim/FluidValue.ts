import { FluidAnimation } from './FluidAnimation';

function flushSubscriptions(rootNode: FluidValue) {
  const fluidStyles = new Set();

  const findFluidStyles = (node: any) => {
    if (typeof node.update === 'function') {
      fluidStyles.add(node);
    } else {
      node.getSubscriptions().forEach(findFluidStyles);
    }
  };

  findFluidStyles(rootNode);

  fluidStyles.forEach((fluidStyle: any) => fluidStyle.update());
}

export class FluidValue {
  private value: number;
  private animation: FluidAnimation;
  private subcriptions: Array<FluidValue> = [];

  constructor(value: number) {
    this.value = value;
  }

  private updateValue(value: number) {
    this.value = value;
    flushSubscriptions(this);
  }

  public get() {
    return this.value;
  }

  public addSubscription(subscription: FluidValue) {
    this.subcriptions.push(subscription);
  }

  public getSubscriptions() {
    return this.subcriptions;
  }

  public animate(animation: FluidAnimation) {
    const previousAnimation = this.animation;
    this.animation && this.animation.stop();
    this.animation = animation;

    animation.start(
      this.value,
      (value) => this.updateValue(value),
      (value) => console.log('end', value),
      previousAnimation
    );
  }
}
