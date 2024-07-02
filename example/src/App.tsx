import UseMount from './components/UseMount';
import UseFluidValue from './components/UseFluidValue';
import MultiStageTransition from './components/MultiStageTransition';
import Interpolation from './components/Interpolation';

const App = () => (
  <>
    <h2>useFluidValue</h2>
    <UseFluidValue />

    <h2>useMount</h2>
    <UseMount />

    <h2>Multistage Transition</h2>
    <MultiStageTransition />

    <h2>Interpolation</h2>
    <Interpolation />
  </>
);

export default App;
