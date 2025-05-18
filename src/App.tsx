
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
import MediaDetail from "./pages/MediaDetail";
import Problems from "./pages/Problems";
import Events from "./pages/Events";
import Quotes from "./pages/Quotes";
import Wiki from "./pages/Wiki";
import WikiArticle from "./components/wiki/WikiArticlePage";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Toaster } from "./components/ui/toaster";
import { ThemeProvider } from "./components/providers/ThemeProvider";
import { AuthProvider } from "./lib/auth";
import { QueryProvider } from './components/providers/QueryProvider';

function App() {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <QueryProvider>
          <AuthProvider>
            <Router>
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
                <Route path="/media/:id" element={<MediaDetail />} />
                <Route path="/problems" element={<Problems />} />
                <Route path="/events" element={<Events />} />
                <Route path="/quotes" element={<Quotes />} />
                <Route path="/wiki" element={<Wiki />} />
                <Route path="/wiki/:id" element={<WikiArticle />} />
                <Route path="*" element={<Index />} />
              </Routes>
              <Toaster />
            </Router>
          </AuthProvider>
        </QueryProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
