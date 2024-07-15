# Re-Motion

> Powerful React animation library

### Installation

Install with npm or yarn:

```bash
npm i @raidipesh78/re-motion
```

```bash
yarn add @raidipesh78/re-motion
```

### Features

#### 1. Animated Transition with **useFluidValue** hook

**Example**

```jsx
import { useFluidValue } from "@raidipesh78/re-motion";

export default function App() {
	const [x, setX] = useFluidValue(0);

	const animate = () => {
		setX({ toValue: 100 }); // set to new value to animate
	}

	return (...);
}
```

#### 2. Mounting and Unmounting with **useMount** hook

**Example**

```jsx
import { useMount, fluid } from '@raidipesh78/re-motion';

export default function App() {
  const [visible, setVisible] = useState(false);

  const open = useMount(visible, {
    from: 0,
    enter: 1,
    exit: 0,
  });

  return open((animation, mounted) => mounted && <fluid.div />);
}
```

#### 3. Dynamic Animations

Different animation configuration can be set while setting the FluidValue to new value

**Example** - Dynamic animation with **useFluidValue** hook

```jsx
import { useFluidValue } from "@raidipesh78/re-motion";

export default function App() {
	const [x, setX] = useFluidValue(0);

	const animateRight = () => {
		setX({
			toValue: 200,
			config: {
				duration: 2000,
			},
		});
	};

	const animateLeft = () => {
		setX({
			toValue: 0,
			config: {
				mass: 1,
				friction: 10,
				tension: 260,
			},
		});
	};

	return (...);
}
```

**Example** - Dynamic animation with **useMount** hook

```jsx
import { useMount } from "@raidipesh78/re-motion";

export default function App() {
	const [open, setOpen] = useState(false);

	const mount = useMount(open, {
		from: 0,
		enter: {
			toValue: 1,
			// configure here
			config: {
				mass: 1,
				friction: 5,
				tension: 300,
			}
		},
		exit: {
			toValue: 0,
			// configure here
			config: {
				duration: 100
			}
		}
	});

	const animate = () => {
		setOpen((prev) => !prev);
	};

	return (...);
}
```

#### 4. Sequence Transition Support

**useFluidValue** hook's update method to accept async function to handle sequence transition

```jsx
const [x, setX] = useFluidValue(0);

setX(async (next) => {
  await next({ toValue: 100 });
  await delay(1000);
  await next({ toValue: 500 });
});
```

#### 5. Interpolations

**interpolate** to interpolate the number as well as FluidValue

```jsx
const [x, setX] = useTransition(0);

const backgroundColor = interpolate(x, [0, 500], ['red', 'black']);
```

## License

MIT
