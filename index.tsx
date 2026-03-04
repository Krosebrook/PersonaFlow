import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

function mount() {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error("Failed to find root element");
    return;
  }
  
  try {
    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (err) {
    console.error("Error during React mounting:", err);
    document.body.innerHTML += `<div style="color:red; padding:20px">Mount Error: ${err.message}</div>`;
  }
}

// Ensure DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount);
} else {
  mount();
}
