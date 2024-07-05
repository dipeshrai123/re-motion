import UseMount from './components/UseMount';
import UseFluidValue from './components/UseFluidValue';
import SequenceTransition from './components/SequenceTransition';
import Interpolation from './components/Interpolation';

const App = () => (
  <>
    <h2>useFluidValue</h2>
    <UseFluidValue />

    <h2>useMount</h2>
    <UseMount />

    <h2>Sequence Transition</h2>
    <SequenceTransition />

    <h2>Interpolation</h2>
    <Interpolation />
  </>
);

export default App;
