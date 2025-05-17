
import React, { useEffect } from 'react';
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
    <Routes>
      <Route path="/auth" element={user ? <Navigate to="/" /> : <Auth />} />
      
      {/* Public Routes */}
      <Route path="/" element={<Dashboard />} />
      <Route path="/media" element={<Media />} />
      <Route path="/forum" element={<Forum />} />
      <Route path="/forum/:id" element={<ForumPost />} />
      <Route path="/wiki" element={<Wiki />} />
      <Route path="/wiki/:id" element={<WikiArticle />} />
      <Route path="/quotes" element={<Quotes />} />
      <Route path="/library" element={<Library />} />
      <Route path="/chat" element={<Chat />} />
      
      {/* Protected Routes */}
      <Route path="/profile" element={user ? <Profile /> : <Navigate to="/auth" />} />
      <Route path="/settings" element={user ? <Settings /> : <Navigate to="/auth" />} />
      <Route path="/admin" element={user ? <AdminPanel /> : <Navigate to="/auth" />} />
      
      {/* Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
