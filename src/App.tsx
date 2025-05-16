
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
import WikiArticlePage from './components/wiki/WikiArticlePage';
import Auth from './pages/Auth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

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
              <Route path="/" element={
                <ProtectedRoute allowGuests={true}>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/profile/:userId" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/media" element={
                <ProtectedRoute allowGuests={true}>
                  <Media />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />
              
              {/* Public routes with layout */}
              <Route path="/forum" element={
                <ProtectedRoute allowGuests={true}>
                  <Forum />
                </ProtectedRoute>
              } />
              <Route path="/wiki" element={
                <ProtectedRoute allowGuests={true}>
                  <Wiki />
                </ProtectedRoute>
              } />
              <Route path="/wiki/:articleId" element={
                <ProtectedRoute allowGuests={true}>
                  <WikiArticlePage />
                </ProtectedRoute>
              } />
              
              {/* Admin routes */}
              <Route path="/admin" element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminPanel />
                </ProtectedRoute>
              } />
              <Route path="/admin/*" element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminPanel />
                </ProtectedRoute>
              } />
              
              {/* 404 page */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </Router>
        </AuthProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
