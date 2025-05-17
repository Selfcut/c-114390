
import React, { Suspense } from 'react';
import { Routes, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { LoadingScreen } from './LoadingScreen';
import { ErrorBoundary } from '../ErrorBoundary';
import { PublicRoutes } from './PublicRoutes';
import { ProtectedRoutes } from './ProtectedRoutes';

const RouteErrorFallback = () => (
  <div className="flex flex-col items-center justify-center p-6 min-h-[50vh]">
    <h2 className="text-xl font-semibold mb-2">Page Failed to Load</h2>
    <p className="text-muted-foreground text-center mb-4">
      There was a problem loading this page
    </p>
    <a href="/" className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
      Return to Home
    </a>
  </div>
);

export const AppRoutes = () => {
  const { isLoading } = useAuth();
  const location = useLocation();
  
  // Scroll to top on route change
  React.useEffect(() => {
    window.scrollTo(0, 0);
    console.log(`Route changed to: ${location.pathname}`);
  }, [location.pathname]);
  
  // Show application-wide loading screen during auth check
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  return (
    <ErrorBoundary fallback={<RouteErrorFallback />}>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <PublicRoutes />
          <ProtectedRoutes />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};
