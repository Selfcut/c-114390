
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/lib/auth/auth-context';
import { GlobalErrorBoundary } from '@/components/common/GlobalErrorBoundary';
import { Toaster } from '@/components/ui/toaster';
import { performanceMonitor } from '@/lib/utils/performance';

// Layout components
import { NavBar } from '@/components/layouts/NavBar';
import { Footer } from '@/components/layouts/Footer';

// Page components
import Home from '@/pages/Home';
import Forum from '@/pages/Forum';
import Research from '@/pages/Research';
import MediaDetail from '@/pages/MediaDetail';
import { ForumPostDetail } from '@/components/forum/ForumPostDetail';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
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
          <Router>
            <div className="min-h-screen bg-background flex flex-col">
              <NavBar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/forum" element={<Forum />} />
                  <Route path="/forum/:postId" element={<ForumPostDetail />} />
                  <Route path="/research" element={<Research />} />
                  <Route path="/media/:id" element={<MediaDetail />} />
                  {/* Add other routes as needed */}
                </Routes>
              </main>
              <Footer />
            </div>
            <Toaster />
          </Router>
        </AuthProvider>
      </QueryClientProvider>
    </GlobalErrorBoundary>
  );
}

export default App;
