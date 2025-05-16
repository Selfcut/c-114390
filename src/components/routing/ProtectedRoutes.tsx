
import React from 'react';
import { Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { PageLayout } from '@/components/layouts/PageLayout';

// Page imports
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

export const ProtectedRoutes = () => {
  return (
    <>
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
    </>
  );
};
