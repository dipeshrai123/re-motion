import type { Descriptor } from './types';

export function filterCallbackOptions(
  options: Record<string, any> = {},
  attach: boolean
) {
  if (attach) return options;
  const { onStart, onChange, onComplete, ...rest } = options;
  return rest;
}

export function isDescriptor(x: unknown): x is Descriptor {
  return (
    typeof x === 'object' &&
    x !== null &&
    'type' in x &&
    typeof (x as any).type === 'string'
  );
}

export function clean<T extends Record<string, any>>(
  obj: T
): { [K in keyof T as T[K] extends undefined ? never : K]: T[K] } {
  const out = {} as any;

  for (const key in obj) {
    if (obj[key] !== undefined) {
      out[key] = obj[key];
    }
  }

  return out;
}
