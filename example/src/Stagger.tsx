import { useState, Children, useRef, useLayoutEffect } from 'react';
import { fluid, FluidValue, spring } from "@raidipesh78/re-motion";

const StaggerItem = ({ open, children, index }: any) => {
  const animation = useRef(new FluidValue(0));

  useLayoutEffect(() => {
    spring(animation.current, { toValue: open ? 1 : 0, delay: index * 50 }).start()
  }, [open]);

  return (
    <div style={{ height: 80 }}>
      <fluid.div
        style={{
          opacity: animation.current,
          height: animation.current.interpolate([0, 1], [0, 80]),
          translateX: animation.current.interpolate([0, 1], [20, 0]),
          overflow: "hidden",
        }}
      >
        {children}
      </fluid.div>
    </div>
  );
};

const Stagger = ({ state, children }: any) => {
  const elements = Children.toArray(children);

  return (
    <div>
      {elements.map((el, i) => {
        return (
          <StaggerItem open={state} key={i} index={i}>
            {el}
          </StaggerItem>
        );
      })}
    </div>
  );
};

export default function App() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setOpen((p) => !p)}>Toggle</button>

      <Stagger state={open}>
        <div style={{
          fontSize: 60,
          color: 'white'
        }}>Hey 👋</div>
        <div style={{
          fontSize: 60,
          color: 'white'
        }}>I'm</div>
        <div style={{
          fontSize: 60,
          color: 'white'
        }}>Dipesh</div>
        <div style={{
          fontSize: 60,
          color: 'white'
        }}>Rai</div>
      </Stagger>
    </div>
  );
}
