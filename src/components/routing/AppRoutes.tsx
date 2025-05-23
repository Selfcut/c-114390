
import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { SimpleLayout } from '@/components/layouts/SimpleLayout';
import { MainLayout } from '@/components/layouts/MainLayout';
import { LoadingScreen } from '@/components/LoadingScreen';
import { AuthCallback } from './AuthCallback';

// Import pages directly for better code clarity
import Welcome from '@/pages/Welcome';
import Dashboard from '@/pages/Dashboard';
import Forum from '@/pages/Forum';
import { ForumPostDetail } from '@/components/forum/ForumPostDetail';
import Library from '@/pages/Library';
import Research from '@/pages/Research';
import BookReviews from '@/pages/BookReviews';
import BookReviewDetail from '@/pages/BookReviewDetail';
import Chat from '@/pages/Chat';
import Media from '@/pages/Media';
import MediaDetail from '@/pages/MediaDetail';
import Problems from '@/pages/Problems';
import ProblemDetail from '@/pages/ProblemDetail';
import Events from '@/pages/Events';
import Quotes from '@/pages/Quotes';
import QuoteDetail from '@/pages/QuoteDetail';
import SavedQuotes from '@/pages/SavedQuotes';
import Wiki from '@/pages/Wiki';
import WikiArticle from '@/components/wiki/WikiArticlePage';
import NotFound from '@/pages/NotFound';
import Auth from '@/pages/Auth';
import Profile from '@/pages/Profile';
import AdminPanel from '@/pages/AdminPanel';
import Words from '@/pages/Words';
import WordDetail from '@/pages/WordDetail';
import WordEditor from '@/pages/WordEditor';
import Notes from '@/pages/Notes';

export function AppRoutes() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* Welcome page with simple layout */}
        <Route path="/" element={
          <SimpleLayout>
            <Welcome />
          </SimpleLayout>
        } />
        
        {/* Authentication pages with simple layout */}
        <Route path="/auth" element={
          <SimpleLayout hideHeader>
            <Auth />
          </SimpleLayout>
        } />
        <Route path="/auth/callback" element={<AuthCallback />} />
        
        {/* All main application routes with MainLayout */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <MainLayout>
              <Profile />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/profile/:username" element={
          <MainLayout>
            <Profile />
          </MainLayout>
        } />
        
        <Route path="/forum" element={
          <MainLayout>
            <Forum />
          </MainLayout>
        } />
        <Route path="/forum/:postId" element={
          <MainLayout>
            <ForumPostDetail />
          </MainLayout>
        } />
        
        <Route path="/library" element={
          <MainLayout>
            <Library />
          </MainLayout>
        } />
        <Route path="/research" element={
          <MainLayout>
            <Research />
          </MainLayout>
        } />
        
        <Route path="/book-reviews" element={
          <MainLayout>
            <BookReviews />
          </MainLayout>
        } />
        <Route path="/book-reviews/:id" element={
          <MainLayout>
            <BookReviewDetail />
          </MainLayout>
        } />
        
        <Route path="/chat" element={
          <MainLayout>
            <Chat />
          </MainLayout>
        } />
        
        <Route path="/media" element={
          <MainLayout>
            <Media />
          </MainLayout>
        } />
        <Route path="/media/:id" element={
          <MainLayout>
            <MediaDetail />
          </MainLayout>
        } />
        
        <Route path="/problems" element={
          <MainLayout>
            <Problems />
          </MainLayout>
        } />
        <Route path="/problems/:problemId" element={
          <MainLayout>
            <ProblemDetail />
          </MainLayout>
        } />
        
        <Route path="/events" element={
          <MainLayout>
            <Events />
          </MainLayout>
        } />
        
        <Route path="/quotes" element={
          <MainLayout>
            <Quotes />
          </MainLayout>
        } />
        <Route path="/quotes/:id" element={
          <MainLayout>
            <QuoteDetail />
          </MainLayout>
        } />
        <Route path="/saved-quotes" element={
          <MainLayout>
            <SavedQuotes />
          </MainLayout>
        } />
        
        <Route path="/words" element={
          <ProtectedRoute>
            <MainLayout>
              <Words />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/words/:id" element={
          <MainLayout>
            <WordDetail />
          </MainLayout>
        } />
        <Route path="/words/new" element={
          <ProtectedRoute>
            <MainLayout>
              <WordEditor />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/words/:id/edit" element={
          <ProtectedRoute>
            <MainLayout>
              <WordEditor />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/notes" element={
          <ProtectedRoute>
            <MainLayout>
              <Notes />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/wiki" element={
          <MainLayout>
            <Wiki />
          </MainLayout>
        } />
        <Route path="/wiki/:id" element={
          <MainLayout>
            <WikiArticle />
          </MainLayout>
        } />

        <Route path="/admin" element={
          <ProtectedRoute requiredRole="admin">
            <MainLayout>
              <AdminPanel />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        {/* Catch all route with simple layout */}
        <Route path="*" element={
          <SimpleLayout>
            <NotFound />
          </SimpleLayout>
        } />
      </Routes>
    </Suspense>
  );
}
