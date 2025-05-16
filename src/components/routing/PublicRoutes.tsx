import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { AuthCallback } from './AuthCallback';
import Auth from '@/pages/Auth';
import Landing from '@/pages/Landing';
import NotFound from '@/pages/NotFound';

/**
 * This file is kept for reference but is no longer used.
 * Routes have been consolidated in AppRoutes.tsx
 */
export const PublicRoutes = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <>
      {/* This component is no longer used directly - see AppRoutes.tsx */}
    </>
  );
};
