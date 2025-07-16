const TestUtils = require('react-dom/test-utils');
const React = require('react');
TestUtils.act = React.act;

global.requestAnimationFrame = (cb: FrameRequestCallback): number => {
  return setTimeout(() => cb(performance.now()), 16) as unknown as number;
};

global.cancelAnimationFrame = (id: number) => {
  clearTimeout(id as unknown as ReturnType<typeof setTimeout>);
};
