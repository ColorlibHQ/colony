import { Navigate, Outlet, useLocation } from 'react-router';

import { useCanAccessRoute } from './useCan';

/**
 * Route guard.
 *
 * Redirects to /403 with `replace`, so Back returns to where the user came
 * from rather than bouncing them off the wall again. The attempted path is
 * carried in state so the 403 page can name what was refused instead of
 * showing an anonymous wall.
 */
export function RequirePermission() {
  const location = useLocation();
  const canAccess = useCanAccessRoute();

  if (!canAccess(location.pathname)) {
    return <Navigate to="/403" replace state={{ from: location.pathname }} />;
  }
  return <Outlet />;
}
