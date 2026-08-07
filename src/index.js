import React from 'react';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import { createRoot } from 'react-dom/client';

const container = document.getElementById('root');
const root = createRoot(container);
root.render( <React.StrictMode>
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
</React.StrictMode>,
)
