
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { LoadingScreen } from './LoadingScreen';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'user' | 'admin' | 'moderator';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole = 'user' 
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (requiredRole === 'admin' && user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
