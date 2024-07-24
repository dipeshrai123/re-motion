import { EndResultType, FluidAnimation } from '../animations/FluidAnimation';
import { FluidInterpolation } from './FluidInterpolation';
import { FluidSubscriptions } from './FluidSubscriptions';
import { ExtrapolateConfig, interpolate } from '../interpolation/Interpolation';
import { Fluid } from './Fluid';

var _uniqueId = 0;

export function uniqueId() {
  return String(_uniqueId++);
}

function updateSubscriptions(rootNode: any) {
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

export class FluidValue extends FluidSubscriptions {
  private value: number;
  private animation: FluidAnimation | null;
  private track: Fluid | null;
  private listeners: Record<string, (value: number) => void>;

  constructor(value: number) {
    super();
    this.value = value;
    this.listeners = {};
  }

  private updateValue(value: number) {
    this.value = value;
    updateSubscriptions(this);
    for (var key in this.listeners) {
      this.listeners[key](this.get());
    }
  }

  public get() {
    return this.value;
  }

  public detach() {
    this.stopAnimation();
  }

  public stopAnimation(callback?: ((value: number) => void) | null) {
    this.stopTrack();
    this.animation?.stop();
    this.animation = null;
    callback && callback(this.get());
  }

  public animate(
    animation: FluidAnimation,
    callback?: (value: EndResultType) => void
  ) {
    const previousAnimation = this.animation;
    this.animation?.stop();
    this.animation = animation;

    animation.start(
      this.value,
      (value) => {
        this.updateValue(value);
      },
      (value) => {
        this.animation?.stop();
        callback && callback(value);
      },
      previousAnimation
    );
  }

  public interpolate(
    inputRange: Array<number>,
    outputRange: Array<string | number>,
    extrapolateConfig?: ExtrapolateConfig
  ) {
    return new FluidInterpolation(
      this,
      interpolate(inputRange, outputRange, extrapolateConfig)
    );
  }

  public startTrack(track: Fluid) {
    this.stopTrack();
    this.track = track;
  }

  public stopTrack() {
    this.track && this.track.detach();
    this.track = null;
  }

  addListener(callback: (value: number) => void): string {
    const id = uniqueId();
    console.log(id);
    this.listeners[id] = callback;
    return id;
  }

  removeListener(id: string): void {
    delete this.listeners[id];
  }

  removeAllListeners(): void {
    this.listeners = {};
  }
}
