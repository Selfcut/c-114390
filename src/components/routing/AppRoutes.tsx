
import React, { Suspense, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { LoadingScreen } from './LoadingScreen';
import { ErrorBoundary } from '../ErrorBoundary';
import Auth from '@/pages/Auth';
import Landing from '@/pages/Landing';
import Media from '@/pages/Media';
import MediaDetail from '@/pages/MediaDetail';
import Forum from '@/pages/Forum';
import ForumPost from '@/pages/ForumPost';
import Wiki from '@/pages/Wiki';
import WikiArticle from '@/components/wiki/WikiArticlePage';
import Quotes from '@/pages/Quotes';
import Library from '@/pages/Library';
import Chat from '@/pages/Chat';
import NotFound from '@/pages/NotFound';
import Dashboard from '@/pages/Dashboard';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';
import AdminPanel from '@/pages/AdminPanel';
import AI from '@/pages/AI';
import Problems from '@/pages/Problems';
import ProblemDetail from '@/pages/ProblemDetail';
import Research from '@/pages/Research';
import ResearchDetail from '@/pages/ResearchDetail';
import BookReviews from '@/pages/BookReviews';
import Events from '@/pages/Events';
import Notifications from '@/pages/Notifications';
import { AuthCallback } from './AuthCallback';

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
  const { isLoading, user } = useAuth();
  const location = useLocation();
  const isAdmin = user?.isAdmin || false;
  
  // Scroll to top on route change
  React.useEffect(() => {
    window.scrollTo(0, 0);
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
          {/* Public Routes */}
          <Route path="/" element={
            <ErrorBoundary>
              <Landing />
            </ErrorBoundary>
          } />
          <Route path="/auth" element={
            <ErrorBoundary>
              <Auth />
            </ErrorBoundary>
          } />
          <Route path="/auth/callback" element={
            <ErrorBoundary>
              <AuthCallback />
            </ErrorBoundary>
          } />
          
          {/* Feature Routes */}
          <Route path="/media" element={
            <ErrorBoundary>
              <Media />
            </ErrorBoundary>
          } />
          <Route path="/media/:id" element={
            <ErrorBoundary>
              <MediaDetail />
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
          <Route path="/ai" element={
            <ErrorBoundary>
              <AI />
            </ErrorBoundary>
          } />
          <Route path="/notifications" element={
            <ErrorBoundary>
              <Notifications />
            </ErrorBoundary>
          } />
          
          {/* Research Routes */}
          <Route path="/research" element={
            <ErrorBoundary>
              <Research />
            </ErrorBoundary>
          } />
          <Route path="/research/:id" element={
            <ErrorBoundary>
              <ResearchDetail />
            </ErrorBoundary>
          } />
          
          {/* Other Pages */}
          <Route path="/book-reviews" element={
            <ErrorBoundary>
              <BookReviews />
            </ErrorBoundary>
          } />
          <Route path="/events" element={
            <ErrorBoundary>
              <Events />
            </ErrorBoundary>
          } />
          
          {/* Problems Routes */}
          <Route path="/problems" element={
            <ErrorBoundary>
              <Problems />
            </ErrorBoundary>
          } />
          <Route path="/problems/:problemId" element={
            <ErrorBoundary>
              <ProblemDetail />
            </ErrorBoundary>
          } />

          {/* User Routes */}
          <Route path="/dashboard" element={
            <ErrorBoundary>
              <Dashboard />
            </ErrorBoundary>
          } />
          <Route path="/profile" element={
            <ErrorBoundary>
              <Profile />
            </ErrorBoundary>
          } />
          <Route path="/settings" element={
            <ErrorBoundary>
              <Settings />
            </ErrorBoundary>
          } />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ErrorBoundary>
              {isAdmin ? <AdminPanel /> : <Navigate to="/" />}
            </ErrorBoundary>
          } />
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};
