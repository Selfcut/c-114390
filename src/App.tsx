
import { BrowserRouter as Router } from "react-router-dom";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Toaster } from "./components/ui/toaster";
import { ThemeProvider } from "./components/providers/ThemeProvider";
import { AuthProvider } from "./lib/auth";
import { QueryProvider } from './components/providers/QueryProvider';
import { AppRoutes } from "./components/routing/AppRoutes";
import { HelmetProvider } from 'react-helmet-async';
import { ScrollToTop } from "./components/ui/ScrollToTop";
import { useEffect } from "react";
import { initializeSupabaseUtils } from "./lib/utils/supabase-utils";
import "./styles/dark-mode.css";
import "./styles/light-mode.css";
import "./styles/global.css";

function App() {
  useEffect(() => {
    // Initialize Supabase utilities
    initializeSupabaseUtils().then(() => {
      console.info("Application fully loaded: Styles and animations initialized");
    });
  }, []);

  return (
    <HelmetProvider>
      <ThemeProvider>
        <ErrorBoundary>
          <QueryProvider>
            <AuthProvider>
              <Router>
                <ScrollToTop />
                <AppRoutes />
                <Toaster />
              </Router>
            </AuthProvider>
          </QueryProvider>
        </ErrorBoundary>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
