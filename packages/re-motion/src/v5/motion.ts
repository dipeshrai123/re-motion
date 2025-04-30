import React, {
  ComponentType,
  forwardRef,
  CSSProperties,
  useLayoutEffect,
  useMemo,
} from 'react';

/**
 * Helper to detect whether a string can be interpolated (e.g., colors).
 */
function isAnimatableString(s: string): boolean {
  // hex (#RGB, #RRGGBB) or rgb(a) formats
  return /^#([0-9A-F]{3}){1,2}$/i.test(s) || /^rgba?\(/i.test(s);
}

/**
 * Global spring scheduler: batches all active springs into a single RAF loop.
 */
class MotionScheduler {
  private springs = new Set<MotionValue>();
  private frame?: number;
  private lastTime: number = 0;

  add(spring: MotionValue) {
    this.springs.add(spring);
    if (this.frame == null) {
      this.lastTime = performance.now();
      this.frame = requestAnimationFrame(this.step);
    }
  }

  remove(spring: MotionValue) {
    this.springs.delete(spring);
    if (this.springs.size === 0 && this.frame != null) {
      cancelAnimationFrame(this.frame);
      this.frame = undefined;
    }
  }

  private step = (time: number) => {
    const dt = (time - this.lastTime) / 1000;
    this.lastTime = time;

    for (const spring of Array.from(this.springs)) {
      spring._springStep(dt);
    }

    if (this.springs.size > 0) {
      this.frame = requestAnimationFrame(this.step);
    } else {
      this.frame = undefined;
    }
  };
}

const motionScheduler = new MotionScheduler();

/** MotionNode – core reactive base */
export abstract class MotionNode<T> {
  private subs = new Set<MotionNode<any>>();
  private attached = false;

  protected onAttach(): void {}
  protected onDetach(): void {}

  public subscribe(child: MotionNode<any>): void {
    if (this.subs.size === 0) {
      this.attached = true;
      this.onAttach();
    }
    this.subs.add(child);
  }

  public unsubscribe(child: MotionNode<any>): void {
    this.subs.delete(child);
    if (this.subs.size === 0 && this.attached) {
      this.attached = false;
      this.onDetach();
    }
  }

  protected notify(): void {
    for (const c of this.subs) c.update();
  }

  public update(): void {
    this.notify();
  }

  public abstract get(): T;
}

/** MotionValue – holds a numeric value, with tween and spring */
export type EasingFn = (t: number) => number;
export interface SpringConfig {
  stiffness?: number;
  damping?: number;
  mass?: number;
  precision?: number;
}
export class MotionValue extends MotionNode<number> {
  private value: number;
  private frame?: number;
  private velocity: number = 0;
  private _springActive = false;
  private _springDest = 0;
  private _springConfig: SpringConfig = {};

  constructor(initial = 0) {
    super();
    this.value = initial;
  }

  public get(): number {
    return this.value;
  }

  public set(v: number): void {
    if (this.frame != null) cancelAnimationFrame(this.frame);
    this.value = v;
    this.velocity = 0;
    if (this._springActive) {
      motionScheduler.remove(this);
      this._springActive = false;
    }
    this.notify();
  }

  public tween(to: number, duration = 300, easing: EasingFn = (t) => t): void {
    if (this.frame != null) cancelAnimationFrame(this.frame);
    const from = this.value;
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      this.value = from + (to - from) * easing(t);
      this.notify();
      if (t < 1) this.frame = requestAnimationFrame(step);
    };
    this.frame = requestAnimationFrame(step);
  }

  public spring(to: number, config: SpringConfig = {}): void {
    this._springDest = to;
    this._springConfig = config;
    if (!this._springActive) {
      this._springActive = true;
      motionScheduler.add(this);
    }
  }

  public _springStep(dt: number): void {
    const {
      stiffness = 170,
      damping = 26,
      mass = 1,
      precision = 0.01,
    } = this._springConfig;
    const x = this.value;
    const dest = this._springDest;
    const force = -stiffness * (x - dest);
    const dampingForce = -damping * this.velocity;
    const accel = (force + dampingForce) / mass;
    this.velocity += accel * dt;
    this.value = x + this.velocity * dt;
    this.notify();
    if (
      Math.abs(this.velocity) <= precision &&
      Math.abs(this.value - dest) <= precision
    ) {
      this.value = dest;
      this.velocity = 0;
      this.notify();
      motionScheduler.remove(this);
      this._springActive = false;
    }
  }
}

/** MotionInterpolation – derive from numeric MotionNode */
export class MotionInterpolation<T> extends MotionNode<T> {
  private parent: MotionNode<number>;
  private fn: (n: number) => T;

  constructor(parent: MotionNode<number>, fn: (n: number) => T) {
    super();
    this.parent = parent;
    this.fn = fn;
    parent.subscribe(this);
  }

  public get(): T {
    return this.fn(this.parent.get());
  }

  protected onDetach(): void {
    this.parent.unsubscribe(this);
  }
}

/** MotionStyle – wrap CSSProperties, only animate numeric or color strings */
export class MotionStyle extends MotionNode<CSSProperties> {
  private styles: CSSProperties;
  private callback: () => void;

  constructor(styles: CSSProperties, cb?: () => void) {
    super();
    this.styles = { ...styles };
    this.callback = cb || (() => {});
    Object.values(this.styles).forEach((v) => {
      if (v instanceof MotionNode) v.subscribe(this);
    });
  }

  public get(): CSSProperties {
    const out: CSSProperties = {};
    for (const key in this.styles) {
      const raw = (this as any).styles[key]!;
      if (raw instanceof MotionNode) {
        const val = raw.get();
        if (typeof val === 'string') {
          // only substrings like colors can be animated via MotionInterpolation;
          // others just render immediately
          (out as any)[key] = isAnimatableString(val) ? val : val;
        } else {
          (out as any)[key] = val;
        }
      } else {
        (out as any)[key] = raw;
      }
    }
    return out;
  }

  public update(): void {
    this.callback();
    this.notify();
  }
}

/** MotionProps – wrap props, auto-wrap style */
export class MotionProps<P extends Record<string, any>> extends MotionNode<P> {
  private props: P;
  private cb: () => void;

  constructor(props: P, cb: () => void) {
    super();
    if (props.style && !(props.style instanceof MotionStyle)) {
      props = { ...props, style: new MotionStyle(props.style, cb) } as P;
    }
    this.props = { ...props };
    this.cb = cb;
    Object.values(this.props).forEach((v) => {
      if (v instanceof MotionNode) v.subscribe(this);
    });
  }

  public get(): P {
    const out = {} as P;
    for (const k in this.props) {
      const v = this.props[k] as any;
      out[k] = v instanceof MotionNode ? v.get() : v;
    }
    return out;
  }

  public update(): void {
    this.cb();
    this.notify();
  }
}

/** HOC: withMotion – wrap a component to accept MotionNode props */
export function withMotion<P extends Record<string, any>>(
  Wrapped: any
): ComponentType<P & { forwardedRef?: any }> {
  const Component = forwardRef<any, P>((props, ref) => {
    const [, tick] = React.useState(0);
    const applier = useMemo(
      () => new MotionProps(props as any, () => tick((x) => x + 1)),
      [props]
    );

    useLayoutEffect(() => {
      return () => {
        Object.values((applier as any).props).forEach((v: any) => {
          if (v instanceof MotionNode) v.unsubscribe(applier as any);
        });
      };
    }, [applier]);

    const applied = applier.get();
    return React.createElement(Wrapped, { ...applied, ref } as any);
  });

  (Component as any).displayName = `withMotion(${
    Wrapped.displayName || Wrapped.name || 'Component'
  })`;

  return Component as any;
}
