import {
  CSSProperties,
  HTMLAttributes,
  SVGAttributes,
  ComponentType,
} from 'react';

import { FluidValue } from '../controllers/FluidValue';
import { styleTrasformKeys } from '../react/transforms';
import { AssignValue, Length } from './animation';

export type FluidTypes = 'spring' | 'timing';

export type FluidCSSProperties = {
  [key in keyof CSSProperties]:
    | CSSProperties[key]
    | FluidValue
    | Length
    | AssignValue;
} & {
  [key in (typeof styleTrasformKeys)[number]]?:
    | FluidValue
    | Length
    | AssignValue;
};

export type FluidHTMLAttributes<T> = {
  [property in keyof HTMLAttributes<T>]:
    | HTMLAttributes<T>[property]
    | FluidValue;
};

export type FluidSVGAttributes<T> = {
  [property in keyof SVGAttributes<T>]: SVGAttributes<T>[property] | FluidValue;
};

export type FluidProps<T> = Omit<
  FluidHTMLAttributes<T> & FluidSVGAttributes<T>,
  'style'
> & {
  style?: FluidCSSProperties;
};

export type WrappedComponentOrTag =
  | ComponentType<HTMLAttributes<HTMLElement>>
  | keyof JSX.IntrinsicElements;
