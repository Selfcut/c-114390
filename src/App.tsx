
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Forum from "./pages/Forum";
import ForumPost from "./pages/ForumPost";
import Library from "./pages/Library";
import Research from "./pages/Research";
import BookReviews from "./pages/BookReviews";
import BookReviewDetail from "./pages/BookReviewDetail";
import Chat from "./pages/Chat";
import Media from "./pages/Media";
import Problems from "./pages/Problems";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { SidebarLayout } from "./components/layouts/SidebarLayout";
import { Toaster } from "./components/ui/toaster";
import { ThemeProvider } from "./components/theme/ThemeProvider";

function App() {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <Router>
          <SidebarLayout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/forum" element={<Forum />} />
              <Route path="/forum/:id" element={<ForumPost />} />
              <Route path="/library" element={<Library />} />
              <Route path="/research" element={<Research />} />
              <Route path="/book-reviews" element={<BookReviews />} />
              <Route path="/book-reviews/:id" element={<BookReviewDetail />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/media" element={<Media />} />
              <Route path="/problems" element={<Problems />} />
              <Route path="*" element={<Index />} />
            </Routes>
          </SidebarLayout>
        </Router>
        <Toaster />
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
