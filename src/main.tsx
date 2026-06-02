import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import '@/styles/fonts.css';
import '@/styles/tokens.css';
import '@/styles/sufra.css';
import '@/styles/sufra-admin.css';
import '@/styles/globals.css';

import { App } from '@/app/App';

const container = document.getElementById('root');
if (!container) {
  throw new Error('Missing #root element in index.html');
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
