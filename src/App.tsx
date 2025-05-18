
import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './components/routing/AppRoutes';
import { ThemeProvider } from "./components/ui/theme-provider";
import { Toaster } from "./components/ui/toaster";

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
      <ThemeProvider defaultTheme="light" storageKey="vite-theme">
        <AppRoutes />
        <Toaster />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
