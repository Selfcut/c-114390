
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
import AdminPanel from './pages/admin/AdminPanel';
import Media from './pages/Media';
import WikiArticlePage from './components/wiki/WikiArticlePage';
import Auth from './pages/Auth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { PageLayout } from './components/layouts/PageLayout';
import ForumPostDetail from './components/forum/ForumPostDetail';

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
                  <PageLayout allowGuests={true}>
                    <Dashboard />
                  </PageLayout>
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <PageLayout>
                    <Dashboard />
                  </PageLayout>
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <PageLayout>
                    <Profile />
                  </PageLayout>
                </ProtectedRoute>
              } />
              <Route path="/profile/:userId" element={
                <ProtectedRoute>
                  <PageLayout>
                    <Profile />
                  </PageLayout>
                </ProtectedRoute>
              } />
              <Route path="/media" element={
                <ProtectedRoute allowGuests={true}>
                  <PageLayout allowGuests={true}>
                    <Media />
                  </PageLayout>
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <PageLayout>
                    <Settings />
                  </PageLayout>
                </ProtectedRoute>
              } />
              
              {/* Public routes with layout */}
              <Route path="/forum" element={
                <ProtectedRoute allowGuests={true}>
                  <PageLayout allowGuests={true}>
                    <Forum />
                  </PageLayout>
                </ProtectedRoute>
              } />
              <Route path="/forum/:postId" element={
                <ProtectedRoute allowGuests={true}>
                  <PageLayout allowGuests={true}>
                    <ForumPostDetail />
                  </PageLayout>
                </ProtectedRoute>
              } />
              <Route path="/wiki" element={
                <ProtectedRoute allowGuests={true}>
                  <PageLayout allowGuests={true}>
                    <Wiki />
                  </PageLayout>
                </ProtectedRoute>
              } />
              <Route path="/wiki/:articleId" element={
                <ProtectedRoute allowGuests={true}>
                  <PageLayout allowGuests={true}>
                    <WikiArticlePage />
                  </PageLayout>
                </ProtectedRoute>
              } />
              
              {/* Admin routes */}
              <Route path="/admin" element={
                <ProtectedRoute requireAdmin={true}>
                  <PageLayout>
                    <AdminPanel />
                  </PageLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin/*" element={
                <ProtectedRoute requireAdmin={true}>
                  <PageLayout>
                    <AdminPanel />
                  </PageLayout>
                </ProtectedRoute>
              } />
              
              {/* 404 page */}
              <Route path="*" element={
                <PageLayout allowGuests={true}>
                  <NotFound />
                </PageLayout>
              } />
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
