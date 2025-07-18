import { decorateAnimation } from './decorateAnimation';

export function defineAnimation<T>(factory: () => T): T {
  const build = () => {
    const anim = factory();
    decorateAnimation(anim as any);
    return anim;
  };

  return build as T;
}
