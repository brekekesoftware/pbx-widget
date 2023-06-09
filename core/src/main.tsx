import { embedWidgetRender } from '@/embed';
import { whenDev } from '@/utils/app';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// import './index.css'

embedWidgetRender();

whenDev(() => {
  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
});
