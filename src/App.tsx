
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { AuthProvider } from '@/lib/auth-context';
import { Toaster } from '@/components/ui/toaster';
import { FloatingChatWidget } from '@/components/chat/FloatingChatWidget';
import { useAuth } from '@/lib/auth-context';
import { ProtectedRoute } from '@/components/ProtectedRoute';

// Pages
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import Forum from './pages/Forum';
import Library from './pages/Library';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import AdminPanel from './pages/admin/AdminPanel';
import Quotes from './components/Quotes';

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

  return <div className="flex items-center justify-center h-screen">
    <div className="animate-pulse text-center">
      <h2 className="text-xl font-semibold mb-2">Processing authentication...</h2>
      <p className="text-muted-foreground">Please wait while we log you in.</p>
    </div>
  </div>;
};

// Root component that checks authentication and provides the floating chat widget
const Root = () => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-16 h-16 bg-primary/20 rounded-full mb-4"></div>
        <div className="h-4 w-24 bg-primary/20 rounded"></div>
      </div>
    </div>;
  }
  
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/chat" element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        } />
        <Route path="/forum" element={
          <ProtectedRoute>
            <Forum />
          </ProtectedRoute>
        } />
        <Route path="/library" element={
          <ProtectedRoute>
            <Library />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/profile/:username" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />
        <Route path="/quotes" element={
          <ProtectedRoute>
            <Quotes />
          </ProtectedRoute>
        } />
        <Route path="/admin/*" element={
          <ProtectedRoute requireAdmin>
            <AdminPanel />
          </ProtectedRoute>
        } />
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      {user && <FloatingChatWidget currentUser={user} />}
    </>
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
