
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../hooks/useAuth';
import type { ProtectedRouteProps } from '../types';

export function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && roles.length > 0) {
    const hasRole = roles.includes(user?.role || '');
    if (!hasRole) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
}