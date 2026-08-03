import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useGuestSession } from '../../guest/GuestSessionContext';
import { Loading } from '../ui/Loading';

export function RequireGuest() {
  const { session, isLoading } = useGuestSession();
  const location = useLocation();

  if (isLoading) return <Loading label="Restoring guest session" />;
  if (!session) {
    return <Navigate to="/guest" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
