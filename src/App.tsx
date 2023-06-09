import viteLogo from '/vite.svg';
import Widget from '@/components/Widget';
import { useState } from 'react';
// import './App.css';
import reactLogo from './assets/react.svg';

function App() {
  const env = import.meta.env;
  const nodeEnv = process.env.NODE_ENV;

  console.log({ env, nodeEnv });

  return <Widget />;
}

export default App
