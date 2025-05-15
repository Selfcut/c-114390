
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Forum from "./pages/Forum";
import Library from "./pages/Library";
import Quotes from "./pages/Quotes";
import { WelcomeOverlay } from "./components/WelcomeOverlay";
import { useEffect } from "react";
import { polymathToast } from "./components/ui/use-toast";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => {
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

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <WelcomeOverlay />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/forum" element={<Forum />} />
            <Route path="/library" element={<Library />} />
            <Route path="/quotes" element={<Quotes />} />
            <Route path="/community" element={<NotFound />} />
            <Route path="/settings" element={<NotFound />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
