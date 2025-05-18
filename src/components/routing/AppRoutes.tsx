
import React, { Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { PageLayout } from '@/components/layouts/PageLayout';
import { Loader2 } from 'lucide-react';

// Lazy loaded pages
const Auth = React.lazy(() => import('@/pages/Auth'));
const Dashboard = React.lazy(() => import('@/pages/Dashboard'));
const Profile = React.lazy(() => import('@/pages/Profile'));
const Settings = React.lazy(() => import('@/pages/Settings'));
const AdminPanel = React.lazy(() => import('@/pages/AdminPanel'));
const Forum = React.lazy(() => import('@/pages/Forum'));
const ForumPost = React.lazy(() => import('@/pages/ForumPost'));
const Chat = React.lazy(() => import('@/pages/Chat'));
const Library = React.lazy(() => import('@/pages/Library'));
const Wiki = React.lazy(() => import('@/pages/Wiki'));
const Quotes = React.lazy(() => import('@/pages/Quotes'));
const Events = React.lazy(() => import('@/pages/Events'));
const NotFound = React.lazy(() => import('@/pages/NotFound'));
const Welcome = React.lazy(() => import('@/pages/Welcome'));

// Loading fallback
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="flex flex-col items-center">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
);

export const AppRoutes = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state while authentication is being determined
  if (isLoading) {
    return <LoadingFallback />;
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Welcome />} />
        <Route path="/auth" element={
          isAuthenticated ? <Navigate to="/dashboard" /> : <Auth />
        } />

        {/* Protected routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminPanel /></ProtectedRoute>} />
        <Route path="/forum" element={<ProtectedRoute><Forum /></ProtectedRoute>} />
        <Route path="/forum/:id" element={<ProtectedRoute><ForumPost /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        <Route path="/library" element={<ProtectedRoute><Library /></ProtectedRoute>} />
        <Route path="/wiki" element={<ProtectedRoute><Wiki /></ProtectedRoute>} />
        <Route path="/quotes" element={<ProtectedRoute><Quotes /></ProtectedRoute>} />
        <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />

        {/* Catch all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};
