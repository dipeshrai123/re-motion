import { EndResultType } from '../animations/FluidAnimation';
import { Fluid } from './Fluid';
import { FluidValue } from './FluidValue';

export class FluidTrack extends Fluid {
  private value: FluidValue;
  private parent: Fluid;
  private AnimationClass: any;
  private animationConfig: any;
  private callback?: (value: EndResultType) => void;
  private handlers?: {
    onStart?: (value: number | string) => void;
    onChange?: (value: number | string) => void;
    onRest?: (value: number | string) => void;
  };

  constructor(
    value: FluidValue,
    parent: Fluid,
    AnimationClass: any,
    animationConfig: any,
    callback?: (value: EndResultType) => void,
    handlers?: {
      onStart?: (value: number | string) => void;
      onChange?: (value: number | string) => void;
      onRest?: (value: number | string) => void;
    }
  ) {
    super();

    this.value = value;
    this.parent = parent;
    this.AnimationClass = AnimationClass;
    this.animationConfig = animationConfig;
    this.callback = callback;
    this.handlers = handlers;

    this.attach();
  }

  public attach() {
    this.parent.addSubscription(this);
  }

  public detach() {
    this.parent.removeSubscription(this);
  }

  public update() {
    this.value.animate(
      new this.AnimationClass(
        {
          ...this.animationConfig,
          toValue: (this.animationConfig.toValue as any).get(),
        },
        this.callback,
        this.handlers
      )
    );
  }
}
