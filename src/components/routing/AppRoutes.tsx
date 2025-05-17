
import React, { useEffect, Suspense } from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { LoadingScreen } from './LoadingScreen';
import { ErrorBoundary } from '../ErrorBoundary';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';
import NotFound from '@/pages/NotFound';
import Media from '@/pages/Media';
import Forum from '@/pages/Forum';
import ForumPost from '@/pages/ForumPost';
import Wiki from '@/pages/Wiki';
import WikiArticle from '@/pages/WikiArticle';
import AdminPanel from '@/pages/AdminPanel';
import Quotes from '@/pages/Quotes';
import Library from '@/pages/Library';
import Chat from '@/pages/Chat';
import Landing from '@/pages/Landing';

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
  const { user, isLoading } = useAuth();
  const location = useLocation();
  
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Log route changes for debugging
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
          {/* Landing and Auth Routes */}
          <Route path="/" element={
            <ErrorBoundary>
              {user ? <Dashboard /> : <Landing />}
            </ErrorBoundary>
          } />
          <Route path="/auth" element={
            <ErrorBoundary>
              {user ? <Navigate to="/" /> : <Auth />}
            </ErrorBoundary>
          } />
          
          {/* Public Routes */}
          <Route path="/dashboard" element={
            <ErrorBoundary>
              {user ? <Dashboard /> : <Navigate to="/auth" />}
            </ErrorBoundary>
          } />
          <Route path="/media" element={
            <ErrorBoundary>
              <Media />
            </ErrorBoundary>
          } />
          <Route path="/forum" element={
            <ErrorBoundary>
              <Forum />
            </ErrorBoundary>
          } />
          <Route path="/forum/:id" element={
            <ErrorBoundary>
              <ForumPost />
            </ErrorBoundary>
          } />
          <Route path="/wiki" element={
            <ErrorBoundary>
              <Wiki />
            </ErrorBoundary>
          } />
          <Route path="/wiki/:id" element={
            <ErrorBoundary>
              <WikiArticle />
            </ErrorBoundary>
          } />
          <Route path="/quotes" element={
            <ErrorBoundary>
              <Quotes />
            </ErrorBoundary>
          } />
          <Route path="/library" element={
            <ErrorBoundary>
              <Library />
            </ErrorBoundary>
          } />
          <Route path="/chat" element={
            <ErrorBoundary>
              <Chat />
            </ErrorBoundary>
          } />
          
          {/* Protected Routes */}
          <Route path="/profile" element={
            <ErrorBoundary>
              {user ? <Profile /> : <Navigate to="/auth" />}
            </ErrorBoundary>
          } />
          <Route path="/settings" element={
            <ErrorBoundary>
              {user ? <Settings /> : <Navigate to="/auth" />}
            </ErrorBoundary>
          } />
          <Route path="/admin" element={
            <ErrorBoundary>
              {user?.isAdmin ? <AdminPanel /> : <Navigate to="/" />}
            </ErrorBoundary>
          } />
          
          {/* Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};
