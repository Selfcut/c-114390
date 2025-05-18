
import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './components/routing/AppRoutes';
import { ThemeProvider } from "./components/ui/theme-provider";
import { Toaster } from "./components/ui/toaster";
import { AuthProvider } from "./lib/auth";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider defaultTheme="light" storageKey="vite-theme">
          <AppRoutes />
          <Toaster />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
