
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/lib/auth/auth-context';
import { UserInteractionProvider } from '@/contexts/UserInteractionContext';
import { GlobalErrorBoundary } from '@/components/common/GlobalErrorBoundary';
import { Toaster } from '@/components/ui/toaster';
import { performanceMonitor } from '@/lib/utils/performance';
import { AppRoutes } from '@/components/routing/AppRoutes';

// Create a client with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: (failureCount, error) => {
        if (error && typeof error === 'object' && 'status' in error) {
          const status = (error as any).status;
          if (status >= 400 && status < 500) return false;
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

function App() {
  React.useEffect(() => {
    performanceMonitor.trackPageLoad('App');
  }, []);

  return (
    <GlobalErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <UserInteractionProvider>
            <Router>
              <div className="min-h-screen bg-background flex flex-col w-full">
                <AppRoutes />
              </div>
              <Toaster />
            </Router>
          </UserInteractionProvider>
        </AuthProvider>
      </QueryClientProvider>
    </GlobalErrorBoundary>
  );
}

export default App;
