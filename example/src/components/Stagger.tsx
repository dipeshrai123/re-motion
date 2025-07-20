import { Children, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createMotionValue, motion, withSpring } from '@raidipesh78/re-motion';

const StaggerItem = ({
  y,
  index,
  content,
}: {
  y: number;
  index: number;
  content: string;
}) => {
  const top = useRef(createMotionValue(0)).current;

  useLayoutEffect(() => {
    top.value = withSpring(y);
  }, [y, top, index]);

  return (
    <motion.span
      style={{
        display: 'inline-block',
        border: '1px solid black',
        translateY: top,
        fontSize: 40,
      }}
    >
      {content}
    </motion.span>
  );
};

const Stagger = ({ y, children }: any) => {
  const childs = Children.toArray(children);

  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {childs.map((child: any, i) => (
        <StaggerItem y={y} key={i} index={i} content={child.props.children} />
      ))}
    </div>
  );
};

export default function App() {
  const [y, setY] = useState(0);

  useEffect(() => {
    const scrollHandler = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      setY(scrollY);
    };

    document.addEventListener('scroll', scrollHandler);

    return () => {
      document.removeEventListener('scroll', scrollHandler);
    };
  }, []);

  return (
    <div
      style={{
        height: 5000,
      }}
    >
      <div
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
        }}
      >
        <Stagger y={y}>
          <span>Hello 👋</span>
          <span>I'm</span>
          <span>Dipesh</span>
          <span>Rai</span>
          <span>Welcome</span>
        </Stagger>
      </div>
    </div>
  );
}
