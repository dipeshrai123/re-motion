# Re-Motion

> Powerful React Animation Library

### Installation

Install with npm or yarn:

```bash
npm install @raidipesh78/re-motion
# or
yarn add @raidipesh78/re-motion
```

---

## Overview

Re-Motion provides a flexible API for creating and controlling animations in React, using `MotionValue` primitives and composable animation functions.

### Key Concepts

- **MotionValue**: A value holder that updates reactively and can drive animations.
- **Animation Controllers**: Functions like `spring`, `timing`, `decay`, `sequence`, `loop`, and `delay` that create and manage animations on `MotionValue` instances.
- **Control API**: Methods on controllers (`start`, `pause`, `resume`, `cancel`, `reset`) for runtime control of animations.
- **Composition**: Combine multiple animations or values via `sequence`, `loop`, or custom transforms with `combine`.
- **`motion` Component**: A styled wrapper that binds `MotionValue` instances to DOM element styles.

---

## API Reference

### `useMotionValue`

Create a new reactive motion value.

```tsx
import { useMotionValue } from '@raidipesh78/re-motion';
const x = useMotionValue(0);
```

### Animation Functions

- `spring(value, toValue, config?)`
- `timing(value, toValue, config?)`
- `decay(value, velocity, config?)`
- `sequence(steps)`
- `loop(controller, count?)`
- `delay(ms)`

> All return controllers with `.start()`, `.pause()`, `.resume()`, `.cancel()`, and `.reset()`.

### Value Composition

- `combine(values, transformer)`

```tsx
import { combine } from '@raidipesh78/re-motion';
const angle = combine([x], ([v]) => `${v}deg`);
```

---

## Examples

### Timing Example

```tsx
import React from 'react';
import {
  useMotionValue,
  timing,
  motion,
  combine,
} from '@raidipesh78/re-motion';

export function TimingExample() {
  const x = useMotionValue(0);
  const move = timing(x, 500, { duration: 5000 });

  return (
    <div>
      <button onClick={() => move.start()}>Start</button>
      <button onClick={() => move.pause()}>Pause</button>
      <button onClick={() => move.resume()}>Resume</button>
      <button onClick={() => move.cancel()}>Cancel</button>
      <button onClick={() => move.reset()}>Reset</button>
      <motion.div
        style={{
          width: 50,
          height: 50,
          backgroundColor: 'red',
          translateX: x,
          rotateZ: combine([x], ([v]) => `${v}deg`),
        }}
      />
    </div>
  );
}
```

### Spring Example

```tsx
import React from 'react';
import { useMotionValue, spring, motion } from '@raidipesh78/re-motion';

export function SpringExample() {
  const x = useMotionValue(0);
  const move = spring(x, 500, { damping: 8, stiffness: 200 });

  return (
    <div>
      <button onClick={() => move.start()}>Start</button>
      <button onClick={() => move.pause()}>Pause</button>
      <button onClick={() => move.resume()}>Resume</button>
      <button onClick={() => move.cancel()}>Cancel</button>
      <button onClick={() => move.reset()}>Reset</button>
      <motion.div
        style={{
          width: 50,
          height: 50,
          backgroundColor: 'teal',
          translateX: x,
        }}
      />
    </div>
  );
}
```

### Decay Example

```tsx
import React from 'react';
import { useMotionValue, decay, motion } from '@raidipesh78/re-motion';

export function DecayExample() {
  const x = useMotionValue(0);
  const move = decay(x, 20);

  return (
    <div>
      <button onClick={() => move.start()}>Start</button>
      <button onClick={() => move.pause()}>Pause</button>
      <button onClick={() => move.resume()}>Resume</button>
      <button onClick={() => move.cancel()}>Cancel</button>
      <button onClick={() => move.reset()}>Reset</button>
      <motion.div
        style={{
          width: 50,
          height: 50,
          backgroundColor: 'tomato',
          translateX: x,
        }}
      />
    </div>
  );
}
```

### Sequence Example

```tsx
import React from 'react';
import {
  useMotionValue,
  spring,
  timing,
  decay,
  sequence,
  motion,
} from '@raidipesh78/re-motion';

export function SequenceExample() {
  const x = useMotionValue(0);
  const move = sequence([spring(x, 300), timing(x, 200), decay(x, 20)]);

  return (
    <div>
      <button onClick={() => move.start()}>Start</button>
      <button onClick={() => move.pause()}>Pause</button>
      <button onClick={() => move.resume()}>Resume</button>
      <button onClick={() => move.cancel()}>Cancel</button>
      <button onClick={() => move.reset()}>Reset</button>
      <motion.div
        style={{
          width: 50,
          height: 50,
          backgroundColor: 'teal',
          translateX: x,
        }}
      />
    </div>
  );
}
```

### Loop Example

```tsx
import React from 'react';
import { useMotionValue, timing, loop, motion } from '@raidipesh78/re-motion';

export function LoopExample() {
  const x = useMotionValue(0);
  const move = loop(timing(x, 500), 5);

  return (
    <div>
      <button onClick={() => move.start()}>Start</button>
      <button onClick={() => move.pause()}>Pause</button>
      <button onClick={() => move.resume()}>Resume</button>
      <button onClick={() => move.cancel()}>Cancel</button>
      <button onClick={() => move.reset()}>Reset</button>
      <motion.div
        style={{
          width: 50,
          height: 50,
          backgroundColor: '#3399ff',
          translateX: x,
        }}
      />
    </div>
  );
}
```

### Loop with Sequence Example

```tsx
import React from 'react';
import {
  useMotionValue,
  timing,
  sequence,
  loop,
  motion,
} from '@raidipesh78/re-motion';

export function LoopWithSequenceExample() {
  const x = useMotionValue(0);
  const move = loop(sequence([timing(x, 200), timing(x, 0)]), 5);

  return (
    <div>
      <button onClick={() => move.start()}>Start</button>
      <button onClick={() => move.pause()}>Pause</button>
      <button onClick={() => move.resume()}>Resume</button>
      <button onClick={() => move.cancel()}>Cancel</button>
      <button onClick={() => move.reset()}>Reset</button>
      <motion.div
        style={{
          width: 50,
          height: 50,
          backgroundColor: '#b9d141',
          translateX: x,
        }}
      />
    </div>
  );
}
```

### Sequence with Loop Inside Example

```tsx
import React from 'react';
import {
  useMotionValue,
  spring,
  timing,
  sequence,
  loop,
  delay,
  motion,
} from '@raidipesh78/re-motion';

export function SequenceWithLoopInsideExample() {
  const x = useMotionValue(0);
  const move = sequence([
    loop(spring(x, 200), 5),
    timing(x, 300, { duration: 5000 }),
    delay(3000),
    spring(x, 400, { damping: 8 }),
  ]);

  return (
    <div>
      <button onClick={() => move.start()}>Start</button>
      <button onClick={() => move.pause()}>Pause</button>
      <button onClick={() => move.resume()}>Resume</button>
      <button onClick={() => move.cancel()}>Cancel</button>
      <button onClick={() => move.reset()}>Reset</button>
      <motion.div
        style={{
          width: 50,
          height: 50,
          backgroundColor: 'tomato',
          translateX: x,
        }}
      />
    </div>
  );
}
```
