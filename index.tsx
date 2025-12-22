
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

console.log("DOT Node: Initializing Cognitive Tree...");

const container = document.getElementById('root');

if (container) {
  try {
    const root = createRoot(container);
    // Render directly to ensure maximum speed and compatibility
    root.render(<App />);
    console.log("DOT Node: cognitive tree mounted successfully.");
  } catch (error) {
    console.error("Fatal: DOT failed to mount to the DOM.", error);
    container.innerHTML = `
      <div style="color: white; padding: 40px; font-family: sans-serif; text-align: center; height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #0b0b0c;">
        <h1 style="color: #ff4d4d; margin-bottom: 10px;">MOUNT FAILURE</h1>
        <p style="opacity: 0.6;">${error instanceof Error ? error.message : String(error)}</p>
      </div>
    `;
  }
} else {
  console.error("Critical: Root element '#root' was not found in the DOM.");
}
