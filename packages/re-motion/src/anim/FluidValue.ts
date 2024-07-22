import { Fluid } from './Fluid';
import { FluidAnimation } from './FluidAnimation';

function applySubscriptions(rootNode: any) {
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

export class FluidValue extends Fluid {
  private value: number;
  private animation: FluidAnimation;

  constructor(value: number) {
    super();
    this.value = value;
  }

  private updateValue(value: number) {
    this.value = value;

    applySubscriptions(this);
  }

  public get() {
    return this.value;
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
