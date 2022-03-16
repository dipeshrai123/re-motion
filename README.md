# Re-Motion

> Powerful React animation library

### Installation

Install with npm:

```bash
	npm i @raidipesh78/re-motion
```

Install with yarn:

```bash
	yarn add @raidipesh78/re-motion
```

### Features

#### 1. Animated Transition with **useTransition** hook

**Example**

```jsx
import { useTransition, animated } from "@raidipesh78/re-motion";

export default function App() {
	const [x, setX] = useTransition(0);

	const animate = () => {
		setX({ toValue: 100 }); // set to new value to animate
	}

	return (
		...
	);
}
```

#### 2. Mounting and Unmounting with **useMount** hook

**Example**

```jsx
import { useMount, animated } from '@raidipesh78/re-motion';

export default function App() {
  const [visible, setVisible] = useState(false);

  const open = useMount(visible, {
    from: 0,
    enter: 1,
    exit: 0,
  });

  return open((animation, mounted) => mounted && <animated.div />);
}
```

#### 3. Dynamic Animations

Different animation configuration can be set while setting the Transition Value to new value

**Example**

```jsx
import { useTransition, animated } from "@raidipesh78/re-motion";

export default function App() {
	const [x, setX] = useTransition(0);

	const animateRight = () => {
		setX({ toValue: 200, config: { duration: 2000 }); // here is timing configuration
	}

	const animateLeft = () => {
		setX({ toValue: 0, config: { mass: 1, friction: 10, tension: 260 }); // here is spring configuration
	}

	return (...);
}
```

#### 4. Multi-stage Transition Support

**useTransition** hook's update method to accept async function to handle multi-stage transition

```jsx
const [x, setX] = useTransition(0);

// ...

setX(async (next) => {
  await next({ toValue: 100 });
  delay(1000);
  await next({ toValue: 500 });
});
```

#### 5. Interpolations

**interpolateNumbers** and **interpolateTransitionValue** functions to handle mathematical and transition value interpolations

```jsx
const [x, setX] = useTransition(0);

// interpolating _x_ value into _backgroundColor_
const backgroundColor = interpolateTransitionValue(
  x,
  [0, 500],
  ['red', 'black']
);
```

## License

MIT
