
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppRoutes } from './components/routing/AppRoutes';
import { ThemeProvider } from './components/providers/ThemeProvider';
import { Toaster } from './components/ui/toaster';
import { Toaster as Sonner } from 'sonner';
import { AuthProvider } from './lib/auth';
import './App.css';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="app-theme">
      <AuthProvider>
        <Router>
          <AppRoutes />
          <Toaster />
          <Sonner position="top-center" />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
