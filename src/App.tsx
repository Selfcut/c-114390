
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
import Events from "./pages/Events";
import Quotes from "./pages/Quotes";
import Wiki from "./pages/Wiki";
import WikiArticle from "./components/wiki/WikiArticlePage";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { PageLayout } from "./components/layouts/PageLayout";
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
                <Route path="/" element={<PageLayout><Index /></PageLayout>} />
                <Route path="/dashboard" element={<PageLayout><Dashboard /></PageLayout>} />
                <Route path="/forum" element={<Forum />} />
                <Route path="/forum/:id" element={<PageLayout><ForumPost /></PageLayout>} />
                <Route path="/library" element={<PageLayout><Library /></PageLayout>} />
                <Route path="/research" element={<PageLayout><Research /></PageLayout>} />
                <Route path="/book-reviews" element={<PageLayout><BookReviews /></PageLayout>} />
                <Route path="/book-reviews/:id" element={<PageLayout><BookReviewDetail /></PageLayout>} />
                <Route path="/chat" element={<PageLayout><Chat /></PageLayout>} />
                <Route path="/media" element={<PageLayout><Media /></PageLayout>} />
                <Route path="/problems" element={<PageLayout><Problems /></PageLayout>} />
                <Route path="/events" element={<Events />} />
                <Route path="/quotes" element={<Quotes />} />
                <Route path="/wiki" element={<Wiki />} />
                <Route path="/wiki/:id" element={<WikiArticle />} />
                <Route path="*" element={<PageLayout><Index /></PageLayout>} />
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
