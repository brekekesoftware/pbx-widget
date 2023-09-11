import Widget from '@/components/Widget';
import { logger } from '@/utils/logger';

function App() {
  const env = import.meta.env;
  const nodeEnv = process.env.NODE_ENV;

  logger({ env, nodeEnv });

  return <Widget />;
}

export default App;
