import { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useUserDetails } from '../../hooks/useUserDetails';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
  allowOnboarding?: boolean;
}

const ProtectedRoute = ({
  children,
  requireAdmin = true,
  allowOnboarding = false,
}: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const { userDetails, isUserDetailsFetched, fetchUserDetails } = useUserDetails();
  const location = useLocation();

  useEffect(() => {
    if (user && !isUserDetailsFetched) {
      fetchUserDetails();
    }
  }, [user, isUserDetailsFetched, fetchUserDetails]);

  // Show loading while checking auth
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        Loading...
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Still loading user details
  if (!isUserDetailsFetched) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        Loading user details...
      </div>
    );
  }

  // Check if user has username (onboarding check)
  if (!userDetails.username) {
    if (allowOnboarding || location.pathname.includes('/onboarding')) {
      return <>{children}</>;
    }
    return <Navigate to="/onboarding" replace />;
  }

  // Check admin requirement
  if (requireAdmin) {
    if (!userDetails.isAdmin) {
      // Non-admin users should be redirected to restricted page
      if (location.pathname.includes('/restricted')) {
        return <>{children}</>;
      }
      return <Navigate to="/restricted" replace />;
    }

    // Admin users should not access onboarding or restricted pages
    if (
      location.pathname.includes('/onboarding') ||
      location.pathname.includes('/restricted')
    ) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;


