import React from 'react';
import ReactDOM from 'react-dom/client';
import '@/app/globals.css';
import HomePage from '@/app/page';

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <HomePage />
    </React.StrictMode>
  );
}
