import React from 'react';
import './index.css';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (err) {
  console.error('Failed to mount React app:', err);
  const errorMessage = err instanceof Error ? err.message : String(err);
  if (rootElement) {
    rootElement.innerHTML = `<div style="color: red; padding: 20px; font-family: monospace;">Error initializing app: ${errorMessage}</div>`;
  }
}
