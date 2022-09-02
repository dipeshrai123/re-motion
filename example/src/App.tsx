import { useTransition } from '@raidipesh78/re-motion';

const App = () => {
  const [translateX, setTranslateX] = useTransition(0);

  console.log(translateX, setTranslateX);
  return <div>APP</div>;
};

export default App;
