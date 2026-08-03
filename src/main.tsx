import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import { GuestSessionProvider } from './guest/GuestSessionContext';
import { router } from './router';
import './index.css';

const root = document.getElementById('root');

if (!root) {
  throw new Error('Application root element was not found.');
}

createRoot(root).render(
  <StrictMode>
    <GuestSessionProvider>
      <RouterProvider router={router} />
    </GuestSessionProvider>
  </StrictMode>,
);
