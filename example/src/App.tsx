import UseMount from './components/useMount/basic';
import UseMounts from './components/useMounts/basic';
import UseTransition from './components/useTransition/basic';
import UseTransitions from './components/useTransitions/basic';

const App = () => (
  <>
    <h2>useMount</h2>
    <UseMounts />

    <h2>useTransition</h2>
    <UseTransition />

    <h2>useMount</h2>
    <UseMount />

    <h2>useTransitions</h2>
    <UseTransitions />
  </>
);

export default App;
