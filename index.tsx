
import React from 'react';
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
  console.error("Critical Render Error:", err);
  rootElement.innerHTML = `
    <div style="padding: 2rem; background: #0b0b0c; color: #ef4444; font-family: sans-serif; height: 100vh; display: flex; align-items: center; justify-content: center; text-align: center;">
      <div>
        <h1 style="font-size: 2rem; font-weight: 900; margin-bottom: 1rem;">BOOT ERROR</h1>
        <p style="opacity: 0.6; margin-bottom: 2rem;">DOT node failed to initialize. Please check console for logs.</p>
        <button onclick="window.location.reload()" style="padding: 1rem 2rem; background: white; color: black; border-radius: 999px; font-weight: 900; border: none; cursor: pointer;">REBOOT SYSTEM</button>
      </div>
    </div>
  `;
}
