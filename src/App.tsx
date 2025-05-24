
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/lib/auth/auth-context";
import { UserInteractionProvider } from "@/contexts/UserInteractionContext";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { CollapsibleSidebar } from "@/components/CollapsibleSidebar";
import { FullHeightChatSidebar } from "@/components/chat/FullHeightChatSidebar";
import { ProtectedRoute } from "@/components/routing/ProtectedRoute";
import { AuthCallback } from "@/components/routing/AuthCallback";

// Pages
import Index from "./pages/Index";
import Welcome from "./pages/Welcome";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Forum from "./pages/Forum";
import ForumPost from "./pages/ForumPost";
import Media from "./pages/Media";
import Knowledge from "./pages/Knowledge";
import Profile from "./pages/Profile";
import Words from "./pages/Words";
import Notes from "./pages/Notes";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 3,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <UserInteractionProvider>
          <ThemeProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <div className="min-h-screen bg-background flex w-full">
                  <CollapsibleSidebar />
                  
                  <main className="flex-1 ml-[var(--sidebar-width)] transition-all duration-300" style={{ 
                    marginRight: 'var(--content-margin-right, 0)',
                    width: 'calc(100% - var(--sidebar-width) - var(--content-margin-right, 0))'
                  }}>
                    <div className="min-h-screen p-4">
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/welcome" element={<Welcome />} />
                        <Route path="/auth" element={<Auth />} />
                        <Route path="/auth/callback" element={<AuthCallback />} />
                        <Route path="/forum" element={<Forum />} />
                        <Route path="/forum/:id" element={<ForumPost />} />
                        <Route path="/media" element={<Media />} />
                        <Route path="/knowledge" element={<Knowledge />} />
                        <Route path="/words" element={<Words />} />
                        <Route path="/notes" element={<Notes />} />
                        <Route
                          path="/dashboard"
                          element={
                            <ProtectedRoute>
                              <Dashboard />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/profile"
                          element={
                            <ProtectedRoute>
                              <Profile />
                            </ProtectedRoute>
                          }
                        />
                      </Routes>
                    </div>
                  </main>
                  
                  <FullHeightChatSidebar />
                </div>
              </BrowserRouter>
            </TooltipProvider>
          </ThemeProvider>
        </UserInteractionProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
