
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/lib/theme-context';
import { AuthProvider } from '@/lib/auth'; // Updated import path
import { Toaster } from '@/components/ui/toaster';
import { FullHeightChatSidebar } from '@/components/chat/FullHeightChatSidebar';
import { useAuth } from '@/lib/auth'; // Updated import path
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { initializeSupabase } from '@/integrations/supabase/init';
import { initializeSupabaseUtils } from '@/lib/utils/supabase-utils';
import { PageLayout } from '@/components/layouts/PageLayout';

// Pages
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import Chat from './pages/Chat';
import Forum from './pages/Forum';
import Library from './pages/Library';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import AdminPanel from './pages/admin/AdminPanel';
import Quotes from './components/Quotes';
import Admin from './pages/Admin';
import AI from './pages/AI';
import NotFound from './pages/NotFound';
import Wiki from './pages/Wiki';
import Media from './pages/Media';
import Landing from './pages/Landing';

// Initialize Supabase
initializeSupabase();
// Initialize Supabase utility functions
initializeSupabaseUtils();

// Auth callback page for OAuth providers
const AuthCallback = () => {
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    // Process auth callback
    // This is handled automatically by Supabase client
  }, []);

  // Redirect based on authentication status
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <div className="flex items-center justify-center h-screen bg-background text-foreground">
    <div className="animate-pulse text-center">
      <h2 className="text-xl font-semibold mb-2">Processing authentication...</h2>
      <p className="text-muted-foreground">Please wait while we log you in.</p>
    </div>
  </div>;
};

// Root component that checks authentication and provides the chat sidebar
const Root = () => {
  const { user, isLoading, isAuthenticated } = useAuth();
  
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
    return <div className="flex items-center justify-center h-screen bg-background text-foreground">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-16 h-16 bg-primary/20 rounded-full mb-4"></div>
        <div className="h-4 w-24 bg-primary/20 rounded"></div>
      </div>
    </div>;
  }
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/landing" replace />} />
        <Route path="/landing" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Landing />} />
        <Route path="/index" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/landing" replace />} />
        <Route path="/auth" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Auth />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        
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
        
        {/* Fallback route - 404 page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      {/* Show chat sidebar for all users (including guests) */}
      <FullHeightChatSidebar />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="polymath-ui-theme">
      <AuthProvider>
        <Router>
          <Root />
        </Router>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
