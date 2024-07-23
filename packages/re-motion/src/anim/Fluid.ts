export class Fluid {
  public get() {}
  public attach() {}
  public addSubscription(subscription: Fluid) {
    void subscription;
  }
}

class FluidStyle extends Fluid {
  private style: Record<string, any>;

  constructor(style: Record<string, any>) {
    super();
    this.style = style;
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

export class FluidProps extends Fluid {
  private props: Record<string, any>;
  private callback: () => void;

  constructor(props: Record<string, any>, callback: () => void) {
    super();
    if (props.style) {
      props = {
        ...props,
        style: new FluidStyle(props.style),
      };
    }
    this.props = props;
    this.callback = callback;

    this.attach();
  }

  public attach() {
    for (const value of Object.values(this.props)) {
      if (value instanceof Fluid) {
        value.addSubscription(this);
      }
    }
  }

  public get() {
    const result: Record<string, any> = {};

    for (const [property, value] of Object.entries(this.props)) {
      if (value instanceof Fluid) {
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