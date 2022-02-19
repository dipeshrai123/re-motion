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
