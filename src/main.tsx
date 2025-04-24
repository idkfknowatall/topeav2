import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Register service worker for offline support and caching - non-blocking
if ('serviceWorker' in navigator) {
  // Use requestIdleCallback to defer service worker registration until the browser is idle
  const registerServiceWorker = () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
  };

  // Use requestIdleCallback for browsers that support it, otherwise use a timeout
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(registerServiceWorker, { timeout: 5000 });
  } else {
    // Fallback for browsers that don't support requestIdleCallback
    setTimeout(registerServiceWorker, 5000);
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
