
import React, { useEffect, Suspense } from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { LoadingScreen } from './LoadingScreen';
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
import { ErrorBoundary } from '../ErrorBoundary';

export const AppRoutes = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          {/* Landing and Auth Routes */}
          <Route path="/" element={user ? <Dashboard /> : <Landing />} />
          <Route path="/auth" element={user ? <Navigate to="/" /> : <Auth />} />
          
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
