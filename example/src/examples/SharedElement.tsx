import { useLayoutEffect, useState } from 'react';
import {
  useMount,
  useFluidValue,
  fluid,
  UseFluidValueConfig,
  interpolate,
} from '@raidipesh78/re-motion';
import { useDrag } from '@use-gesture/react';

const clamp = (v: number, l: number, u: number) => Math.min(Math.max(v, l), u);

const BOX_SIZE = 200;

const IMAGES = [
  'https://images.unsplash.com/photo-1502082553048-f009c37129b9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
  'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
  'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
  'https://images.unsplash.com/photo-1444464666168-49d633b86797?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1469&q=80',
];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const animationConfig = { mass: 1, friction: 20, tension: 260 };

export default function App() {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [expanded, setExpanded] = useState(false);
  const transition = useMount(activeIndex !== -1, {
    from: 0,
    enter: 1,
    exit: 0,
    config: { duration: 0 },
  });

  const [left, setLeft] = useFluidValue(0);
  const [top, setTop] = useFluidValue(0);
  const [width, setWidth] = useFluidValue(0);
  const [height, setHeight] = useFluidValue(0);
  const [y, setY] = useFluidValue(0);

  const bind = useDrag(({ down, movement: [, my] }) => {
    setY({
      toValue: down ? clamp(my, 0, 300) : 0,
      config: {
        mass: 1,
        friction: 30,
        tension: 280,
      },
    });

    if (!down) {
      if (my > 200) {
        closeSharedElement();
      }
    }
  });

  useLayoutEffect(() => {
    if (activeIndex !== null) {
      const activeBox = document.getElementById(`box-v3-${activeIndex}`);
      if (activeBox) {
        const { left, top, width, height } = activeBox.getBoundingClientRect();

        setLeft(async (next) => {
          await next({
            toValue: left,
            config: {
              immediate: true,
              onStart: function () {
                setExpanded(true);
              },
            },
          });
          await sleep(100);
          await next({
            toValue: 0,
            config: animationConfig,
          });
        });
        setTop(async (next) => {
          await next({ toValue: top, config: { immediate: true } });
          await sleep(100);
          await next({
            toValue: 0,
            config: animationConfig,
          });
        });
        setWidth(async (next) => {
          await next({ toValue: width, config: { immediate: true } });
          await sleep(100);
          await next({
            toValue: window.innerWidth,
            config: animationConfig,
          });
        });
        setHeight(async (next) => {
          await next({ toValue: height, config: { immediate: true } });
          await sleep(100);
          await next({
            toValue: window.innerHeight,
            config: animationConfig,
          });
        });
      }
    }
  }, [activeIndex, setLeft, setTop, setWidth, setHeight, setExpanded]);

  const closeSharedElement = () => {
    if (activeIndex !== null) {
      const activeBox = document.getElementById(`box-v3-${activeIndex}`);

      if (activeBox) {
        const { left, top, width, height } = activeBox.getBoundingClientRect();

        const restConfig: UseFluidValueConfig = {
          mass: 1,
          friction: 20,
          tension: 300,
        };

        setLeft({ toValue: left, config: restConfig });
        setTop({ toValue: top, config: restConfig });
        setWidth({ toValue: width, config: restConfig });
        setHeight({
          toValue: height,
          config: {
            ...restConfig,
            onRest: () => {
              setActiveIndex(-1);
              setExpanded(false);
            },
          },
        });
      }
    }
  };

  return (
    <>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 1fr',
          gridGap: '20px',
        }}
      >
        {IMAGES.map((image, index) => {
          const imageStyle =
            activeIndex === index && expanded
              ? {
                  backgroundColor: 'white',
                }
              : {
                  backgroundImage: `url(${image})`,
                  backgroundSize: 'cover',
                };

          return (
            <div
              id={`box-v3-${index}`}
              key={index}
              style={{
                height: BOX_SIZE,
                backgroundColor: '#e1e1e1',
                cursor: 'pointer',
                ...imageStyle,
              }}
              onClick={() => setActiveIndex(index)}
            />
          );
        })}
      </div>

      {transition(
        (animation, item) =>
          item && (
            <fluid.div
              style={{
                position: 'fixed',
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'none',
                opacity: animation,
              }}
            >
              <fluid.div
                {...bind()}
                style={{
                  position: 'absolute',
                  left,
                  top,
                  width,
                  height,
                  translateY: y,
                  scale: interpolate(y, [0, 200], [1, 0.8]),
                  touchAction: 'none',
                  color: 'white',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'grabbing',
                  backgroundImage: `url(${IMAGES[activeIndex]})`,
                  backgroundSize: 'cover',
                }}
              >
                <span style={{ userSelect: 'none' }}>Pull Down</span>
              </fluid.div>
            </fluid.div>
          )
      )}
    </>
  );
}
