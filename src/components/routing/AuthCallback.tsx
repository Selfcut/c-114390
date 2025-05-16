
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';

export const AuthCallback = () => {
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    // Process auth callback
    // This is handled automatically by Supabase client
  }, []);

  // Redirect based on authentication status
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex items-center justify-center h-screen bg-background text-foreground">
      <div className="animate-pulse text-center">
        <h2 className="text-xl font-semibold mb-2">Processing authentication...</h2>
        <p className="text-muted-foreground">Please wait while we log you in.</p>
      </div>
    </div>
  );
};
