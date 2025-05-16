
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Forum from './pages/Forum';
import { Toaster } from './components/ui/toaster';
import { AuthProvider } from './lib/auth';
import { ThemeProvider } from './components/providers/ThemeProvider';
import Wiki from './pages/Wiki';
import AdminPanel from './pages/AdminPanel';
import Media from './pages/Media';
import { PageLayout } from './components/layouts/PageLayout';
import WikiArticlePage from './components/wiki/WikiArticlePage';
import Auth from './pages/Auth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Initialize React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000, // 1 minute
      refetchOnWindowFocus: true,
    },
  },
});

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router>
            <Routes>
              {/* Auth routes (no layout) */}
              <Route path="/auth" element={<Auth />} />
              
              {/* Protected routes with layout */}
              <Route path="/" element={<PageLayout><Dashboard /></PageLayout>} />
              <Route path="/dashboard" element={<PageLayout><Dashboard /></PageLayout>} />
              <Route path="/profile" element={<PageLayout><Profile /></PageLayout>} />
              <Route path="/profile/:userId" element={<PageLayout><Profile /></PageLayout>} />
              <Route path="/media" element={<PageLayout><Media /></PageLayout>} />
              <Route path="/settings" element={<PageLayout><Settings /></PageLayout>} />
              
              {/* Public routes with layout */}
              <Route path="/forum" element={<PageLayout allowGuests={true}><Forum /></PageLayout>} />
              <Route path="/wiki" element={<PageLayout allowGuests={true}><Wiki /></PageLayout>} />
              <Route path="/wiki/:articleId" element={<PageLayout allowGuests={true}><WikiArticlePage /></PageLayout>} />
              
              {/* Admin routes */}
              <Route path="/admin" element={<PageLayout><AdminPanel /></PageLayout>} />
              
              {/* 404 page */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </Router>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
