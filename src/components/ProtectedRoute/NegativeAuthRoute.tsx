import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface NegativeAuthRouteProps {
  children: ReactNode;
}

/**
 * Negative Auth Route - Only allows access when user is NOT authenticated
 * Used for login page, etc.
 */
const NegativeAuthRoute = ({ children }: NegativeAuthRouteProps) => {
  const { user, loading } = useAuth();

  // Show loading while checking auth
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        Loading...
      </div>
    );
  }

  // If user is authenticated, redirect to home
  if (user) {
    return <Navigate to="/" replace />;
  }

  // User is not authenticated, allow access
  return <>{children}</>;
};

export default NegativeAuthRoute;

