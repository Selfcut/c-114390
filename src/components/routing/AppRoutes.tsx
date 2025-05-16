
import React, { useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { LoadingScreen } from './LoadingScreen';
import Auth from '@/pages/Auth';
import Landing from '@/pages/Landing';
import NotFound from '@/pages/NotFound';
import Dashboard from '@/pages/Dashboard';
import Chat from '@/pages/Chat';
import Forum from '@/pages/Forum';
import Library from '@/pages/Library';
import Wiki from '@/pages/Wiki';
import Media from '@/pages/Media';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';
import Quotes from '@/components/Quotes';
import AI from '@/pages/AI';
import Admin from '@/pages/Admin';
import AdminPanel from '@/pages/admin/AdminPanel';
import { AuthCallback } from './AuthCallback';
import { PageLayout } from '../layouts/PageLayout';
import { ProtectedRoute } from '../ProtectedRoute';

export const AppRoutes = () => {
  const { isLoading, isAuthenticated } = useAuth();
  
  // Load the sidebar state from localStorage
  useEffect(() => {
    // Set CSS variable for sidebar width based on collapsed state
    const sidebarCollapsed = localStorage.getItem('sidebar-collapsed') === 'true';
    document.documentElement.style.setProperty(
      '--sidebar-width', 
      sidebarCollapsed ? '64px' : '256px'
    );
  }, []);
  
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/landing" replace />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/index" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/landing" replace />} />
        <Route path="/auth" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Auth />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <PageLayout>
              <Dashboard />
            </PageLayout>
          </ProtectedRoute>
        } />
        <Route path="/chat" element={
          <ProtectedRoute>
            <PageLayout>
              <Chat />
            </PageLayout>
          </ProtectedRoute>
        } />
        <Route path="/forum" element={
          <ProtectedRoute allowGuests={true}>
            <PageLayout allowGuests={true}>
              <Forum />
            </PageLayout>
          </ProtectedRoute>
        } />
        <Route path="/library" element={
          <ProtectedRoute allowGuests={true}>
            <PageLayout allowGuests={true}>
              <Library />
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
        <Route path="/media" element={
          <ProtectedRoute allowGuests={true}>
            <PageLayout allowGuests={true}>
              <Media />
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
        <Route path="/profile/:username" element={
          <ProtectedRoute>
            <PageLayout>
              <Profile />
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
        <Route path="/quotes" element={
          <ProtectedRoute allowGuests={true}>
            <PageLayout allowGuests={true}>
              <Quotes />
            </PageLayout>
          </ProtectedRoute>
        } />
        <Route path="/ai" element={
          <ProtectedRoute>
            <PageLayout>
              <AI />
            </PageLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute requireAdmin>
            <PageLayout>
              <Admin />
            </PageLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/*" element={
          <ProtectedRoute requireAdmin>
            <PageLayout>
              <AdminPanel />
            </PageLayout>
          </ProtectedRoute>
        } />

        {/* Fallback route - 404 page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};
