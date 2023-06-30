import Widget from '@/components/Widget';

function App() {
  const env = import.meta.env;
  const nodeEnv = process.env.NODE_ENV;

  console.log({ env, nodeEnv });

  return <Widget />;
}

export default App
