import React, {
  ComponentType,
  forwardRef,
  CSSProperties,
  useLayoutEffect,
  useMemo,
} from 'react';
import { interpolate } from './interpolate';

/**
 * Global spring scheduler: batches all active springs into a single RAF loop.
 */
class MotionScheduler {
  private springs = new Set<MotionValue>();
  private frame?: number;
  private lastTime = 0;

  add(s: MotionValue) {
    this.springs.add(s);
    if (this.frame == null) {
      this.lastTime = performance.now();
      this.frame = requestAnimationFrame(this.step);
    }
  }

  remove(s: MotionValue) {
    this.springs.delete(s);
    if (this.springs.size === 0 && this.frame != null) {
      cancelAnimationFrame(this.frame);
      this.frame = undefined;
    }
  }

  private step = (time: number) => {
    const dt = (time - this.lastTime) / 1000;
    this.lastTime = time;
    this.springs.forEach((s) => s._springStep(dt));
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
    if (!this.attached) {
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
    this.subs.forEach((c) => c.update());
  }

  public update(): void {
    this.notify();
  }

  public abstract get(): T;
}

/** MotionValue – holds a numeric value, supports tween & spring */
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
  private velocity = 0;
  private active = false;
  private dest = 0;
  private config: SpringConfig = {};

  private tweenStart = 0;
  private tweenDuration = 0;
  private tweenFrom = 0;
  private tweenTo = 0;
  private tweenEasing: EasingFn = (t) => t;
  private tweenElapsed = 0;
  private springOrigin = 0;

  constructor(initial = 0) {
    super();
    this.value = initial;
  }

  public get(): number {
    return this.value;
  }

  public set(v: number): void {
    if (this.frame != null) cancelAnimationFrame(this.frame);
    if (this.active) {
      motionScheduler.remove(this);
      this.active = false;
    }
    this.value = v;
    this.velocity = 0;
    this.notify();
  }

  private _tweenStep = (now: number) => {
    const t = Math.min(1, (now - this.tweenStart) / this.tweenDuration);
    this.value =
      this.tweenFrom + (this.tweenTo - this.tweenFrom) * this.tweenEasing(t);
    this.notify();
    if (t < 1) {
      this.frame = requestAnimationFrame(this._tweenStep);
    } else {
      this.frame = undefined;
    }
  };

  public tween(to: number, duration = 300, easing: EasingFn = (t) => t): void {
    // store metadata
    this.tweenFrom = this.value;
    this.tweenTo = to;
    this.tweenDuration = duration;
    this.tweenEasing = easing;
    this.tweenStart = performance.now();

    // kick off
    if (this.frame != null) cancelAnimationFrame(this.frame);
    this.frame = requestAnimationFrame(this._tweenStep);
  }

  public spring(to: number, config: SpringConfig = {}): void {
    // capture initial value once
    if (!this.active) {
      this.springOrigin = this.value;
    }
    this.dest = to;
    this.config = config;
    this.active = true;
    motionScheduler.add(this);
  }

  public onChange(fn: (v: number) => void): () => void {
    // A lightweight “listener node”
    class Listener extends MotionNode<number> {
      get() {
        return self.get();
      }
      update() {
        fn(self.get());
      }
    }
    const self = this;
    const listener = new Listener();
    this.subscribe(listener);
    // cleanup
    return () => this.unsubscribe(listener);
  }

  // ─── Overload #1: array → array (numbers or strings) ────────────────
  public to<Out extends number | string>(
    inputRange: number[],
    outputRange: Out[],
    easing?: EasingFn
  ): MotionInterpolation<Out>;

  // ─── Overload #2: array → mapper fn (any T) ────────────────────────
  public to<T>(
    inputRange: number[],
    mapper: (v: number) => T
  ): MotionInterpolation<T>;

  // ─── Implementation ─────────────────────────────────────────────────
  public to(
    inputRange: number[],
    output: number[] | ((v: number) => any),
    easing: EasingFn = (t) => t
  ): MotionInterpolation<any> {
    // If you passed a function, treat it as a custom mapper
    if (typeof output === 'function') {
      const mapper = output as (v: number) => any;
      return new MotionInterpolation<any>(this, mapper);
    }

    // Otherwise it's an array of numbers or strings
    return interpolate<any>(
      this,
      inputRange,
      output as (number | string)[],
      easing
    );
  }

  /**
   * Pause the current tween or spring.
   */
  public pause(): void {
    // if we're mid-tween, record how far we got
    if (this.frame != null) {
      this.tweenElapsed = performance.now() - this.tweenStart;
      cancelAnimationFrame(this.frame);
      this.frame = undefined;
    }
    // if we're mid-spring, same as before
    if (this.active) {
      motionScheduler.remove(this);
      this.active = false;
    }
  }

  /**
   * Resume a paused tween or spring.
   */
  public resume(): void {
    // resume tween: reuse the elapsed time we saved
    if (this.tweenElapsed && this.frame == null) {
      this.tweenStart = performance.now() - this.tweenElapsed;
      this.frame = requestAnimationFrame(this._tweenStep);
    }
    // resume spring: no change
    else if (!this.active && this.dest != null) {
      this.active = true;
      motionScheduler.add(this);
    }
  }

  public reverse(): void {
    // ── Tween: go back to the start value once ───────────────
    if (this.tweenDuration > 0) {
      const start = this.tweenFrom;
      if (this.value === start) return; // already there
      // cancel any running tween
      if (this.frame != null) cancelAnimationFrame(this.frame);
      // animate back to the original from
      this.tween(start, this.tweenDuration, this.tweenEasing);
      // clear so reverse() only works once
      this.tweenDuration = 0;
      return;
    }

    // ── Spring: return to the captured origin once ───────────
    const origin = this.springOrigin;
    if (this.value === origin) return; // already there
    // spring back to the original value
    this.spring(origin, this.config);
  }

  public _springStep(dt: number): void {
    const {
      stiffness = 170,
      damping = 26,
      mass = 1,
      precision = 0.01,
    } = this.config;
    const x = this.value;
    const f = -stiffness * (x - this.dest);
    const df = -damping * this.velocity;
    const accel = (f + df) / mass;
    this.velocity += accel * dt;
    this.value = x + this.velocity * dt;
    this.notify();
    if (
      Math.abs(this.velocity) <= precision &&
      Math.abs(this.value - this.dest) <= precision
    ) {
      this.value = this.dest;
      this.velocity = 0;
      this.active = false;
      motionScheduler.remove(this);
      this.notify();
    }
  }
}

/** MotionInterpolation – maps a parent numeric node via fn */
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

/** MotionStyle – wrap CSS props, auto-subscribe MotionNodes */
export class MotionStyle extends MotionNode<CSSProperties> {
  private styles: CSSProperties;
  private cb: () => void;
  constructor(styles: CSSProperties, cb: () => void) {
    super();
    this.styles = { ...styles };
    this.cb = cb;
    Object.values(this.styles).forEach((v) => {
      if (v instanceof MotionNode) v.subscribe(this);
    });
  }
  public get(): CSSProperties {
    const out: any = {};
    for (const key in this.styles) {
      const raw = (this.styles as any)[key];
      out[key] = raw instanceof MotionNode ? raw.get() : raw;
    }
    return out;
  }
  public update(): void {
    this.cb();
    this.notify();
  }
}

/** MotionProps – wrap component props, auto-wrap style */
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

/** HOC: withMotion – wrap any component to accept MotionNode props */
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
    return React.createElement(Wrapped, { ...applier.get(), ref } as any);
  });
  (Component as any).displayName = `withMotion(${
    Wrapped.displayName || Wrapped.name || 'Component'
  })`;
  return Component as any;
}
