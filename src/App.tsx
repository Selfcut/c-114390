import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Library from './pages/Library';
import Research from './pages/Research';
import ResearchDetail from './pages/ResearchDetail';
import Media from './pages/Media';
import WikiArticlePage from './pages/WikiArticlePage';
import WikiArticle from './pages/WikiArticle';
import Forum from './pages/Forum';
import ForumPostDetail from './pages/ForumPostDetail';
import Problems from './pages/Problems';
import ProblemDetail from './pages/ProblemDetail';
import AdminDashboard from './pages/AdminDashboard';
import UserProfileComponent from './pages/UserProfileComponent';
import AuthCallback from './pages/AuthCallback';
import NotFoundPage from './pages/NotFoundPage';
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import MediaDetail from './pages/MediaDetail';

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
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/library" element={<Library />} />
          <Route path="/research" element={<Research />} />
          <Route path="/research/:id" element={<ResearchDetail />} />
          <Route path="/media" element={<Media />} />
          <Route path="/media/:id" element={<MediaDetail />} />
          <Route path="/wiki" element={<WikiArticlePage />} />
          <Route path="/wiki/:id" element={<WikiArticle />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/forum/:id" element={<ForumPostDetail />} />
          <Route path="/problems" element={<Problems />} />
          <Route path="/problems/:id" element={<ProblemDetail />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/user/:id" element={<UserProfileComponent />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Toaster />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
