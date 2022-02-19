import * as React from "react";

// import { SpringAnimation } from "../animation/SpringAnimation";
// import { TimingAnimation } from "../animation/TimingAnimation";
import {
  ExtrapolateConfig,
  interpolateNumbers,
} from "../interpolation/Interpolation";
import { tags, unitlessStyleProps } from "./Tags";
import { TransitionValue, AssignValue } from "./useTransition";
import { ResultType } from "../animation/Animation";
import { styleTrasformKeys, getTransform } from "./TransformStyles";
import { combineRefs } from "./combineRefs";

type PropertyType = "style" | "props";

type AnimationObject = {
  propertyType: PropertyType;
  property: string;
  animatable: boolean;
  animation: any;
  isInterpolation: boolean;
  interpolationConfig: {
    inputRange: Array<number>;
    outputRange: Array<number | string>;
    extrapolateConfig?: ExtrapolateConfig;
  };
} & TransitionValue;

/**
 * isDefined to check the value is defined or not
 * @param value - any
 * @returns - boolean
 */
// const isDefined = (value: any) => {
//   return value !== null && value !== undefined;
// };

/**
 * isSubscriber to check the value is TransitionValue or not
 * @param value - any
 * @returns - boolean
 */
export const isSubscriber = (value: any) => {
  return (
    typeof value === "object" &&
    Object.prototype.hasOwnProperty.call(value, "_subscribe")
  );
};

// get clean props object without any subscribers
const getCleanProps = (props: any) => {
  const cleanProps = { ...props };
  if (cleanProps.style) {
    delete cleanProps.style;
  }

  Object.keys(cleanProps).forEach((prop: string) => {
    if (isSubscriber(cleanProps[prop])) {
      delete cleanProps[prop];
    }
  });

  return cleanProps;
};

/**
 * getCssValue() function to get css value with unit or without unit
 * it is only for style property - it cannot be used with transform keys
 * @param property - style property
 * @param value - style value
 * @returns - value with unit or without unit
 */
function getCssValue(property: string, value: number | string) {
  let cssValue;
  if (typeof value === "number") {
    if (unitlessStyleProps.indexOf(property) !== -1) {
      cssValue = value;
    } else {
      cssValue = value + "px";
    }
  } else {
    cssValue = value;
  }

  return cssValue;
}

/**
 * getNonAnimatableStyle function returns the non-animatable style object
 * @param style - CSSProperties
 * @returns - non-animatable CSSProperties
 */
function getNonAnimatableStyle(
  style: React.CSSProperties,
  transformObjectRef: React.MutableRefObject<any>
) {
  const stylesWithoutTransforms = Object.keys(style).reduce(
    (resultObject, styleProp) => {
      const value = style[styleProp as keyof React.CSSProperties];

      // skips all the subscribers here
      // only get non-animatable styles
      if (isSubscriber(value)) {
        return resultObject;
      } else if (styleTrasformKeys.indexOf(styleProp) !== -1) {
        // if not subscriber, then check styleTransformKeys
        // add it to transformPropertiesObjectRef
        transformObjectRef.current[styleProp] = value;
        return resultObject;
      }

      return { ...resultObject, [styleProp]: value };
    },
    {}
  );

  const transformStyle: any = {};
  if (Object.keys(transformObjectRef.current).length > 0) {
    transformStyle.transform = getTransform(transformObjectRef.current);
  }

  // combined transform and non-transform styles
  const combinedStyle = {
    ...transformStyle,
    ...stylesWithoutTransforms,
  };

  return combinedStyle;
}

function getAnimatableObject(
  propertyType: PropertyType,
  propertiesObject: object
) {
  return Object.keys(propertiesObject).reduce(function (acc, styleProp) {
    const value = propertiesObject[styleProp] as TransitionValue;

    if (isSubscriber(value)) {
      const { _value, _config } = value;

      console.log("config", _config);

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
      }

      // let animation: any;

      // if (isDefined(_config?.duration)) {
      //   // duration based animation
      //   animation = new TimingAnimation({
      //     initialPosition: _value,
      //     config: {
      //       duration: _config?.duration,
      //       easing: _config?.easing,
      //       immediate: _config?.immediate,
      //       delay: _config?.delay,
      //       onRest: _config?.onRest,
      //     },
      //   });
      // } else {
      //   // spring based animation
      //   animation = new SpringAnimation({
      //     initialPosition: _value,
      //     config: {
      //       mass: _config?.mass,
      //       tension: _config?.tension,
      //       friction: _config?.friction,
      //       immediate: _config?.immediate,
      //       delay: _config?.delay,
      //       onRest: _config?.onRest,
      //     },
      //   });
      // }

      return [
        ...acc,
        {
          propertyType,
          property: styleProp,
          // animation,
          animatable: true,
          ...value,
        },
      ];
    }

    return acc;
  }, []) as Array<AnimationObject>;
}

export function makeAnimatedComponent(
  WrapperComponent: React.ComponentType | keyof JSX.IntrinsicElements
) {
  function Wrapper(props: any, forwardRef: any) {
    const ref = React.useRef<any>(null);

    // for transforms, we add all the transform keys in transformPropertiesObjectRef and
    // use getTransform() function to get transform string.
    // we make sure that the non-animatable transforms to be present in
    // transformPropertiesObjectRef , non-animatable transform from first paint
    // are overridden if it is not added.
    const transformPropertiesObjectRef = React.useRef<{
      [property: string]: any;
    }>({});

    // generates the array of animation object
    const animations = React.useMemo<Array<AnimationObject>>(() => {
      const animatableStyles = getAnimatableObject(
        "style",
        props.style ?? Object.create({})
      );
      const animatableProps = getAnimatableObject(
        "props",
        props ?? Object.create({})
      );

      return [...animatableStyles, ...animatableProps];
    }, [props]);

    console.log("ANIMATIONS", animations);

    // Update non-animated style if style changes
    React.useEffect(() => {
      if (!props.style) {
        return;
      }

      const nonAnimatableStyle = getNonAnimatableStyle(
        props.style,
        transformPropertiesObjectRef
      );

      Object.keys(nonAnimatableStyle).forEach((styleProp) => {
        const value =
          nonAnimatableStyle[styleProp as keyof React.CSSProperties];

        if (ref.current) {
          ref.current.style[styleProp] = getCssValue(styleProp, value);
        }
      });
    }, [props.style]);

    React.useEffect(() => {
      const subscribers: any = [];

      // set all subscribers here
      // TODO: check if it can be interpolated or not
      // always give interpolatable strings value from 0 to 1 in animation

      // for duplicate values onFrame
      let previousValue: any;
      let updatedValue: any;

      animations.forEach((props: AnimationObject) => {
        const {
          _subscribe,
          _value,
          _config,
          _currentValue,
          animation,
          propertyType,
          property,
          animatable,
        } = props;

        if (!ref.current) {
          return;
        }

        // whether or not the property is one of transform keys
        const isTransform = styleTrasformKeys.indexOf(property) !== -1;

        // called every frame to update new transform values
        // getTransform function returns the valid transform string
        const getTransformValue = (value: any) => {
          transformPropertiesObjectRef.current[property] = value;
          return getTransform(transformPropertiesObjectRef.current);
        };

        // to apply animation values to a ref node
        const applyAnimationValues = (value: any) => {
          if (ref.current) {
            if (propertyType === "style") {
              // set animation to style
              if (isTransform) {
                ref.current.style.transform = getTransformValue(value);
              } else {
                ref.current.style[property] = getCssValue(property, value);
              }
            } else if (propertyType === "props") {
              // set animation to property
              ref.current.setAttribute(property, value);
            }
          }
        };

        // set previous value
        previousValue = _value;

        const onFrame = (value: number) => {
          _currentValue.current = value;

          // get new value
          updatedValue = value;

          // for interpolation we check isInterpolation boolean
          // which is injected from interpolate function
          if (props.isInterpolation) {
            const { interpolationConfig } = props;

            const interpolatedValue = interpolateNumbers(
              value,
              interpolationConfig.inputRange,
              interpolationConfig.outputRange,
              interpolationConfig.extrapolateConfig
            );

            // interpolate it first and
            // apply animation to ref node
            applyAnimationValues(interpolatedValue);
          } else {
            // if it is TransitionValue, we dont have to interpolate it
            // just apply animation value
            applyAnimationValues(value);
          }

          // Handeling duplicate listener value updates
          if (_config?.onChange) {
            if (previousValue !== updatedValue) {
              _config.onChange(value);
              previousValue = updatedValue;
            }
          }
        };

        const onUpdate = (
          value: AssignValue,
          callback?: (value: ResultType) => void
        ) => {
          const { toValue, immediate, duration } = value;

          if (animatable) {
            const previousAnimation = animation;

            /**
             * stopping animation here would affect in whole
             * animation pattern, requestAnimationFrame instance
             * is created on frequent calls like mousemove
             * it flushes current running requestAnimationFrame
             */
            animation.stop();

            // animatable
            animation.start({
              toValue,
              onFrame,
              previousAnimation,
              onEnd: callback,
              immediate,
              duration,
            });
          } else {
            // non-animatable
            if (typeof toValue === typeof _value) {
              if (ref.current) {
                ref.current.style[property] = getCssValue(property, toValue);
              }
            } else {
              throw new Error("Cannot set different types of animation values");
            }
          }
        };

        // called initially to paint the frame with initial value '_value'
        onFrame(_value as number);

        const subscribe = _subscribe(onUpdate);
        subscribers.push(subscribe);
      });

      return () => {
        // cleanup
        subscribers.forEach((subscriber: any) => subscriber);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return React.createElement(WrapperComponent, {
      ...getCleanProps(props),
      ref: combineRefs(ref, forwardRef),
    });
  }

  return React.forwardRef(Wrapper);
}

export const animated: any = {};
tags.forEach((element) => {
  animated[element] = makeAnimatedComponent(
    element as keyof JSX.IntrinsicElements
  );
});
