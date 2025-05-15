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
import { Sidebar } from "./components/Sidebar";

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
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/forum" element={<Forum />} />
                <Route path="/library" element={<Library />} />
                <Route path="/quotes" element={<Quotes />} />
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
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
