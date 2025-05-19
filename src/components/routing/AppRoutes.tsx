
import React, { Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { PageLayout } from '@/components/layouts/PageLayout';
import { Loader2 } from 'lucide-react';

// Import pages directly for better code clarity
import Welcome from '@/pages/Welcome';
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import Forum from '@/pages/Forum';
import ForumPost from '@/pages/ForumPost';
import Library from '@/pages/Library';
import Research from '@/pages/Research';
import BookReviews from '@/pages/BookReviews';
import BookReviewDetail from '@/pages/BookReviewDetail';
import Chat from '@/pages/Chat';
import Media from '@/pages/Media';
import MediaDetail from '@/pages/MediaDetail';
import Problems from '@/pages/Problems';
import Events from '@/pages/Events';
import Quotes from '@/pages/Quotes';
import Wiki from '@/pages/Wiki';
import WikiArticle from '@/components/wiki/WikiArticlePage';
import NotFound from '@/pages/NotFound';

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
    <Routes>
      {/* Welcome page as entry point */}
      <Route path="/" element={<Welcome />} />
      
      {/* Old index page for reference - will eventually be removed */}
      <Route path="/legacy" element={<Index />} />
      
      {/* Main application routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/forum" element={<Forum />} />
      <Route path="/forum/:id" element={<ForumPost />} />
      
      <Route path="/library" element={<Library />} />
      <Route path="/research" element={<Research />} />
      
      <Route path="/book-reviews" element={<BookReviews />} />
      <Route path="/book-reviews/:id" element={<BookReviewDetail />} />
      
      <Route path="/chat" element={<Chat />} />
      
      <Route path="/media" element={<Media />} />
      <Route path="/media/:id" element={<MediaDetail />} />
      
      <Route path="/problems" element={<Problems />} />
      
      <Route path="/events" element={<Events />} />
      
      <Route path="/quotes" element={<Quotes />} />
      
      <Route path="/wiki" element={<Wiki />} />
      <Route path="/wiki/:id" element={<WikiArticle />} />
      
      {/* Catch all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
