import { isMotionValue } from '../isMotionValue';

export function applyAttrs(
  node: HTMLElement,
  props: Record<string, any>
): (() => void)[] {
  const unsubs: (() => void)[] = [];

  for (const [key, val] of Object.entries(props)) {
    const setBool = (v: boolean) => {
      if (v) node.setAttribute(key, '');
      else node.removeAttribute(key);
    };
    const setOther = (v: string | number) => {
      node.setAttribute(key, String(v));
    };

    if (isMotionValue(val)) {
      const initial = val.value;
      if (typeof initial === 'boolean') setBool(initial);
      else if (typeof initial === 'string' || typeof initial === 'number')
        setOther(initial);
      else node.removeAttribute(key);

      unsubs.push(
        val.onChange((v) => {
          if (typeof v === 'boolean') setBool(v);
          else if (typeof v === 'string' || typeof v === 'number') setOther(v);
          else node.removeAttribute(key);
        })
      );
    } else {
      if (typeof val === 'boolean') setBool(val);
      else if (typeof val === 'string' || typeof val === 'number')
        setOther(val);
    }
  }

  return unsubs;
}
