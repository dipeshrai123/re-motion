import { FluidValue, makeFluid, spring, timing } from '@raidipesh78/re-motion';
import { useMemo } from 'react';

const FluidDiv = makeFluid('div');

export default function New() {
  const fluidProgress = useMemo(() => new FluidValue(0), []);

  return (
    <div>
      <button
        onClick={() =>
          timing(fluidProgress, { toValue: 0, duration: 5000 }).start()
        }
      >
        TO: 0
      </button>
      <button onClick={() => spring(fluidProgress, { toValue: 100 }).start()}>
        TO: 100
      </button>
      <FluidDiv
        style={{
          width: 100,
          height: 100,
          position: 'relative',
          background: 'red',
          left: fluidProgress,
        }}
      ></FluidDiv>
    </div>
  );
}
