
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppRoutes } from './components/routing/AppRoutes';
import { ThemeProvider } from './components/providers/ThemeProvider';
import { Toaster } from './components/ui/toaster';
import { Toaster as Sonner } from 'sonner';
import './App.css';

// Remove or comment out the ReactQueryDevtools import if it exists

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="app-theme">
      <Router>
        <AppRoutes />
        <Toaster />
        <Sonner position="top-center" />
      </Router>
      
      {/* Remove or comment out the ReactQueryDevtools component if it exists */}
    </ThemeProvider>
  );
}

export default App;
