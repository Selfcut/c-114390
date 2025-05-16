
import React, { useEffect } from 'react';
import { Routes } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { LoadingScreen } from './LoadingScreen';
import { PublicRoutes } from './PublicRoutes';
import { ProtectedRoutes } from './ProtectedRoutes';

export const AppRoutes = () => {
  const { isLoading } = useAuth();
  
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
        <PublicRoutes />
        <ProtectedRoutes />
      </Routes>
    </div>
  );
};
