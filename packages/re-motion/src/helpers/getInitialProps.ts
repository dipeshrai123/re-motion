import { FluidProps } from '../fluids/FluidProps';
import { getTransform, separateTransformStyle } from './transforms';

export function getInitialProps(givenProps: Record<string, any>) {
  const { style = {}, ...attrs } = new FluidProps(givenProps, () => {}).get();
  const { nonTransformStyle, transformStyle } = separateTransformStyle(style);

  return {
    ...attrs,
    style: {
      ...nonTransformStyle,
      transform: getTransform(transformStyle),
    },
  };
}
