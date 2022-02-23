import { ExtrapolateConfig } from "../../interpolation/Interpolation";
import { TransitionValue } from "../useTransition";
import { isSubscriber } from "./isSubscriber";

type PropertyType = "style" | "props";

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
} & TransitionValue;

/**
 * Function to get the array of animatable objects
 * @param propertyType - which property type "props" or "style"
 */
export function getAnimatableObject(
  propertyType: PropertyType,
  propertiesObject: object
) {
  return Object.keys(propertiesObject).reduce(function (acc, styleProp) {
    const value = propertiesObject[styleProp] as TransitionValue;

    if (isSubscriber(value)) {
      const { _value } = value;

      /**
       * TODO: string could be interpolated if it matches the template
       * interpolate the interpolatable strings from 0 to 1
       */

      return [
        ...acc,
        {
          propertyType,
          property: styleProp,
          animatable: !(typeof _value === "string"), // strings are non animatable
          ...value,
        },
      ];
    }

    return acc;
  }, []) as Array<AnimationObject>;
}
