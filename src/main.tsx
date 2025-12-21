import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { PreloadProvider } from './context/PreloadContext.tsx'
import { BrowserRouter } from 'react-router-dom';

const container = document.getElementById('root')!;
const preloadedData = (window as any).__PRELOADED_DATA__;

if (preloadedData) {
  hydrateRoot(container,
    <PreloadProvider value={preloadedData}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PreloadProvider>
  );
} else {
  createRoot(container).render(
    <PreloadProvider value={null}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PreloadProvider>
  );
}
