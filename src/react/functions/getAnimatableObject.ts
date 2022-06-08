import { ExtrapolateConfig } from '../../interpolation/Interpolation';
import { FluidValue } from '../useTransition';
import { isTransitionValue } from './isTransitionValue';

type PropertyType = 'style' | 'props';

export type AnimationObject = {
  propertyType: PropertyType;
  property: string;
  animatable: boolean;

  // from interpolateTransitionValue
  isInterpolation: boolean;
  interpolationConfig: {
    inputRange: Array<number>;
    outputRange: Array<number | string>;
    extrapolateConfig?: ExtrapolateConfig;
  };
} & FluidValue;

/**
 * Function to get the array of animatable objects
 * @param propertyType - which property type "props" or "style"
 */
export function getAnimatableObject(
  propertyType: PropertyType,
  propertiesObject: object
) {
  return Object.keys(propertiesObject).reduce(function (acc, styleProp) {
    const value = propertiesObject[styleProp] as FluidValue;

    if (isTransitionValue(value)) {
      const { _value } = value;

      return [
        ...acc,
        {
          propertyType,
          property: styleProp,
          animatable: !(typeof _value === 'string'), // strings are non animatable
          ...value,
        },
      ];
    }

    return acc;
  }, []) as Array<AnimationObject>;
}
