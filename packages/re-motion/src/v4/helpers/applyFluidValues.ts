import {
  camelToKebab,
  getCssValue,
  getTransform,
  separateTransformStyle,
} from '../helpers';

function applyStyle(ref: { current: any }, style: Record<string, any>) {
  const { nonTransformStyle, transformStyle } = separateTransformStyle(style);

  ref.current.style.transform = getTransform(transformStyle);
  Object.entries(nonTransformStyle).forEach(([property, value]) => {
    ref.current.style[property] = getCssValue(property, value);
  });
}

function applyProps(ref: { current: any }, props: Record<string, any>) {
  Object.entries(props).forEach(([property, value]) => {
    ref.current.setAttribute(camelToKebab(property), value);
  });
}

export function applyFluidValues(
  ref: { current: any },
  props: Record<string, any>
) {
  const { style = {}, ...attrs } = props;
  applyStyle(ref, style);
  applyProps(ref, attrs);
}
