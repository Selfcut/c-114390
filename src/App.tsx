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
import { StylesDebugger } from "./components/StylesDebugger";
import { ThemeProvider } from "./lib/theme-context";

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
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="w-full min-h-screen m-0 p-0 max-w-full overflow-x-hidden">
              <WelcomeOverlay />
              <StylesDebugger />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/forum" element={<Forum />} />
                <Route path="/library" element={<Library />} />
                <Route path="/quotes" element={<Quotes />} />
                {/* Mystic topic routes */}
                <Route path="/topics/alchemy" element={<NotFound />} />
                <Route path="/topics/hermeticism" element={<NotFound />} />
                <Route path="/topics/gnosticism" element={<NotFound />} />
                <Route path="/topics/kabbalah" element={<NotFound />} />
                <Route path="/topics/astrology" element={<NotFound />} />
                <Route path="/topics/sacred-geometry" element={<NotFound />} />
                {/* Book routes */}
                <Route path="/books/alchemists-path" element={<NotFound />} />
                <Route path="/books/shadows-of-anubis" element={<NotFound />} />
                <Route path="/books/ninth-dot" element={<NotFound />} />
                <Route path="/books" element={<NotFound />} />
                {/* Community routes */}
                <Route path="/community" element={<NotFound />} />
                <Route path="/discord" element={<NotFound />} />
                <Route path="/expert-qa" element={<NotFound />} />
                <Route path="/disciplines" element={<NotFound />} />
                <Route path="/events" element={<NotFound />} />
                <Route path="/study-guides" element={<NotFound />} />
                <Route path="/reading-list" element={<NotFound />} />
                <Route path="/study-notes" element={<NotFound />} />
                <Route path="/my-discussions" element={<NotFound />} />
                <Route path="/study-groups" element={<NotFound />} />
                <Route path="/knowledge-map" element={<NotFound />} />
                <Route path="/learning-analytics" element={<NotFound />} />
                <Route path="/learning-guides" element={<NotFound />} />
                <Route path="/wiki" element={<NotFound />} />
                <Route path="/help-center" element={<NotFound />} />
                <Route path="/new-research" element={<NotFound />} />
                <Route path="/academic-journals" element={<NotFound />} />
                <Route path="/book-reviews" element={<NotFound />} />
                <Route path="/settings" element={<NotFound />} />
                <Route path="/art-poetry" element={<NotFound />} />
                <Route path="/youtube" element={<NotFound />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
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
