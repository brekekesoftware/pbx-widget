import viteLogo from '/vite.svg';
import Widget from '@/components/Widget';
import { useState } from 'react';
// import './App.css';
import reactLogo from './assets/react.svg';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <Widget />
    </div>
  )
}

export default App
