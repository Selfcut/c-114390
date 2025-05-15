
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { polymathToast } from "./components/ui/use-toast";
import { ThemeProvider } from "./lib/theme-context";
import { supabase } from "./integrations/supabase/client";

// Pages
import Dashboard from "./pages/Dashboard";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";
import Forum from "./pages/Forum";
import Library from "./pages/Library";
import Quotes from "./pages/Quotes";
import Auth from "./pages/Auth";
import Wiki from "./pages/Wiki";
import Chat from "./pages/Chat";

// Components
import { WelcomeOverlay } from "./components/WelcomeOverlay";

// Auth state types
interface AuthState {
  authenticated: boolean;
  loading: boolean;
}

// Create a new query client with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 60000, // 1 minute
    },
  },
});

const App = () => {
  const [authState, setAuthState] = useState<AuthState>({
    authenticated: false,
    loading: true,
  });

  // Check for user session
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setAuthState({
        authenticated: !!session,
        loading: false,
      });
    };
    
    checkSession();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setAuthState({
          authenticated: !!session,
          loading: false,
        });
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Check for returning users
  useEffect(() => {
    const lastLoginTimestamp = localStorage.getItem("lastLoginTimestamp");
    const currentTime = new Date().getTime();
    
    if (lastLoginTimestamp) {
      const lastLogin = parseInt(lastLoginTimestamp);
      const daysSinceLastLogin = Math.floor((currentTime - lastLogin) / (1000 * 60 * 60 * 24));
      
      // If it's been more than 7 days since last login
      if (daysSinceLastLogin > 7) {
        // Delayed toast to ensure it appears after page load
        setTimeout(() => {
          polymathToast.welcomeBack(daysSinceLastLogin);
        }, 2000);
      }
    }
    
    // Update last login timestamp
    localStorage.setItem("lastLoginTimestamp", currentTime.toString());
  }, []);

  // Route guard component
  const ProtectedRoute = ({ element }: { element: React.ReactNode }) => {
    if (authState.loading) {
      return (
        <div className="flex items-center justify-center h-screen bg-background">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-16 h-16 bg-primary/20 rounded-full mb-4"></div>
            <div className="h-4 w-24 bg-primary/20 rounded"></div>
          </div>
        </div>
      );
    }
    
    return authState.authenticated ? <>{element}</> : <Navigate to="/auth" replace />;
  };

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="w-full min-h-screen m-0 p-0 max-w-full overflow-hidden">
              <WelcomeOverlay />
              <Routes>
                <Route path="/" element={authState.authenticated ? <Dashboard /> : <Landing />} />
                <Route path="/auth" element={authState.authenticated ? <Navigate to="/" replace /> : <Auth />} />
                <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
                <Route path="/forum" element={<ProtectedRoute element={<Forum />} />} />
                <Route path="/library" element={<ProtectedRoute element={<Library />} />} />
                <Route path="/quotes" element={<ProtectedRoute element={<Quotes />} />} />
                <Route path="/wiki" element={<ProtectedRoute element={<Wiki />} />} />
                <Route path="/chat" element={<ProtectedRoute element={<Chat />} />} />
                
                {/* Catch-all route for 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
