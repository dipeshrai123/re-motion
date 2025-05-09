import { FluidValue, fluid } from '@raidipesh78/re-motion';
import { useRef } from 'react';

export default function FluidValueUpdate() {
  const x = useRef(new FluidValue(0)).current;

  // Single timing controller example
  const ctrl = x.timing({ toValue: 100, duration: 5000 });

  return (
    <div style={{ padding: 20 }}>
      <h3>FluidValue Controls</h3>
      <button onClick={() => ctrl.start()}>Start</button>
      <button onClick={() => ctrl.stop()}>Stop</button>
      <button onClick={() => ctrl.reset()}>Reset</button>
      <button onClick={() => x.set({ toValue: 500 })}>Set to 500</button>

      <div style={{ marginTop: 10 }}>
        <button
          onClick={() => {
            const seq = x.sequence([
              x.timing({ toValue: 100, duration: 1000 }),
              x.timing({ toValue: 0, duration: 100 }),
            ]);
            seq.start();
          }}
        >
          Sequence
        </button>

        <button
          style={{ marginLeft: 10 }}
          onClick={() => {
            // Stagger example:
            // Animates three timing controllers with a 200ms offset between starts
            const stag = x.stagger(1000, [
              x.timing({ toValue: 50, duration: 500 }),
              x.timing({ toValue: 150, duration: 500 }),
              x.timing({ toValue: 0, duration: 500 }),
            ]);
            stag.start();
          }}
        >
          Stagger
        </button>

        <button
          style={{ marginLeft: 10 }}
          onClick={() => {
            const infinite = x.loop(
              x.sequence([
                x.timing({ toValue: 100, duration: 500 }),
                x.timing({ toValue: 0, duration: 1000 }),
              ]),
              {
                iterations: 5,
              }
            );
            infinite.start();
          }}
        >
          Loop
        </button>
      </div>

      <div style={{ marginTop: 20 }}>
        <fluid.div
          style={{
            width: 100,
            height: 100,
            background: '#3399ff',
            position: 'relative',
            left: x,
          }}
        />
      </div>
    </div>
  );
}
