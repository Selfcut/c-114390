
import React from 'react';
import { Route } from 'react-router-dom';
import { ErrorBoundary } from '../ErrorBoundary';
import Auth from '@/pages/Auth';
import Landing from '@/pages/Landing';
import Media from '@/pages/Media';
import Forum from '@/pages/Forum';
import ForumPost from '@/pages/ForumPost';
import Wiki from '@/pages/Wiki';
import WikiArticle from '@/pages/WikiArticle';
import Quotes from '@/pages/Quotes';
import Library from '@/pages/Library';
import Chat from '@/pages/Chat';
import NotFound from '@/pages/NotFound';
import { AuthCallback } from './AuthCallback';

export const PublicRoutes = () => {
  return (
    <>
      {/* Landing/Auth Routes */}
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
      
      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </>
  );
};
