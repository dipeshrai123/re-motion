import { isSubscriber } from "./isSubscriber";

/**
 * Function to get clean props object without any subscribers
 */
export const getCleanProps = (props: any) => {
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
