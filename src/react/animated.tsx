import * as React from "react";

import { SpringAnimation } from "../animation/SpringAnimation";
import { TimingAnimation } from "../animation/TimingAnimation";
import { interpolateNumbers } from "../interpolation/Interpolation";
import { tags } from "./Tags";
import { AssignValue, UseTransitionConfig } from "./useTransition";
import { ResultType } from "../animation/Animation";
import { styleTrasformKeys, getTransform } from "./TransformStyles";
import { combineRefs } from "./combineRefs";
import { isDefined } from "./functions/isDefined";
import { getCleanProps } from "./functions/getCleanProps";
import {
  getAnimatableObject,
  AnimationObject,
} from "./functions/getAnimatableObject";
import { getCssValue } from "./functions/getCssValue";
import { getNonAnimatableStyle } from "./functions/getNonAnimatableStyle";

/**
 * Animation Types : For now spring and timing based animations
 */
type AnimationTypes = "spring" | "timing";

/**
 * Higher order component to make any component animatable
 * @param WrapperComponent
 */
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
          propertyType,
          property,
          animatable,
        } = props;

        // store animations here
        let animation: any = null;
        let previousAnimation: any = null;

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

        /**
         * Function to define dynamic animations
         * "spring" or "timing" based animations are
         * determined by the config duration
         */
        const defineAnimation = (
          value: number,
          config?: UseTransitionConfig
        ) => {
          // define the type of animation
          let type: AnimationTypes = "spring";
          if (!isDefined(config?.duration)) {
            if (isDefined(_config?.duration)) {
              type = "timing";
            }
          } else {
            type = "timing";
          }

          const animationConfig = config ?? _config;

          if (type === "spring") {
            animation = new SpringAnimation({
              initialPosition: value,
              config: animationConfig,
            });
          } else if (type === "timing") {
            animation = new TimingAnimation({
              initialPosition: value,
              config: animationConfig,
            });
          }

          return animation;
        };

        const onUpdate = (
          value: AssignValue,
          callback?: (value: ResultType) => void
        ) => {
          const { toValue, config } = value;

          if (animatable) {
            // animatable
            if (previousAnimation._toValue !== toValue) {
              /**
               * stopping animation here would affect in whole
               * animation pattern, requestAnimationFrame instance
               * is created on frequent calls like mousemove
               * it flushes current running requestAnimationFrame
               */
              animation.stop();

              // define the animation based on config
              previousAnimation = defineAnimation(
                previousAnimation._position,
                config
              );

              // animatable
              animation.start({
                toValue,
                onFrame,
                previousAnimation: previousAnimation,
                onEnd: callback,
                immediate: config?.immediate,
              });
            }
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
        // define type of animation to paint the first frame with initial value '_value'
        previousAnimation = defineAnimation(_value as number);

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
