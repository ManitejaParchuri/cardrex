import { createBrowserRouter } from 'react-router-dom';

import { AppLayout } from './components/layout/AppLayout';
import { RequireGuest } from './components/routing/RequireGuest';
import { CardOpeningPage } from './pages/CardOpeningPage';
import { CollectionPage } from './pages/CollectionPage';
import { GuestUsernamePage } from './pages/GuestUsernamePage';
import { LandingPage } from './pages/LandingPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { SignInPage } from './pages/SignInPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'guest', element: <GuestUsernamePage /> },
      { path: 'sign-in', element: <SignInPage /> },
      {
        element: <RequireGuest />,
        children: [
          { path: 'claim', element: <CardOpeningPage /> },
          { path: 'collection', element: <CollectionPage /> },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
