// easing.ts
// Pure easing functions for timing interpolations

export const Easing = {
  linear: (t: number) => t,
  easeInQuad: (t: number) => t * t,
  easeOutQuad: (t: number) => t * (2 - t),
  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => --t * t * t + 1,
  // add more as needed:
  // easeInQuart, easeOutQuart, easeInOut, elastic, bounce, etc.
};
