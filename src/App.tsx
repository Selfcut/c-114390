
import React, { Suspense } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppRoutes } from './components/routing/AppRoutes';
import { ThemeProvider } from './components/providers/ThemeProvider';
import { Toaster } from './components/ui/toaster';
import { Toaster as Sonner } from 'sonner';
import { AuthProvider } from './lib/auth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingScreen } from './components/routing/LoadingScreen';
import './App.css';

// Create a client with improved error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
      retry: 1, // Limit retries to avoid infinite loading states
      // Using throwOnError for error handling which is the proper API in latest TanStack Query
      throwOnError: true, // This will propagate errors to error boundaries
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark" storageKey="app-theme">
        <Suspense fallback={<LoadingScreen />}>
          <AuthProvider>
            <QueryClientProvider client={queryClient}>
              <Router>
                <AppRoutes />
                <Toaster />
                <Sonner position="top-center" />
              </Router>
            </QueryClientProvider>
          </AuthProvider>
        </Suspense>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
