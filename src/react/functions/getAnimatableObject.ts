import { ExtrapolateConfig } from "../../interpolation/Interpolation";
import { TransitionValue } from "../useTransition";
import { isSubscriber } from "./isSubscriber";

type PropertyType = "style" | "props";

export type AnimationObject = {
  propertyType: PropertyType;
  property: string;
  animatable: boolean;
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

      // string cannot be interpolated by default ignore it.
      if (typeof _value === "string") {
        return [
          ...acc,
          {
            propertyType,
            property: styleProp,
            animatable: false,
            ...value,
          },
        ];
      } else {
        return [
          ...acc,
          {
            propertyType,
            property: styleProp,
            animatable: true,
            ...value,
          },
        ];
      }
    }

    return acc;
  }, []) as Array<AnimationObject>;
}
