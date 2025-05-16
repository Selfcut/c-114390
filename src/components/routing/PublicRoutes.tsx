
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { AuthCallback } from './AuthCallback';
import Auth from '@/pages/Auth';
import Landing from '@/pages/Landing';
import NotFound from '@/pages/NotFound';

export const PublicRoutes = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <>
      <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/landing" replace />} />
      <Route path="/landing" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Landing />} />
      <Route path="/index" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/landing" replace />} />
      <Route path="/auth" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Auth />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      
      {/* Fallback route - 404 page */}
      <Route path="*" element={<NotFound />} />
    </>
  );
};
