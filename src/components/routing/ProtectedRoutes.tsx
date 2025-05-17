
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from '../ErrorBoundary';
import { useAuth } from '@/lib/auth';
import Dashboard from '@/pages/Dashboard';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';
import AdminPanel from '@/pages/AdminPanel';

export const ProtectedRoutes = () => {
  const { user } = useAuth();
  const isAdmin = user?.isAdmin || false;

  return (
    <>
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
    </>
  );
};
