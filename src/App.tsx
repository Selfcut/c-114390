
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Forum from './pages/Forum';
import { Toaster } from './components/ui/toaster';
import { AuthProvider } from './lib/auth';
import { ThemeProvider } from './components/providers/ThemeProvider';
import Wiki from './pages/Wiki';
import AdminPanel from './pages/AdminPanel';
import Media from './pages/Media';
import { FullHeightChatSidebar } from './components/chat/FullHeightChatSidebar';
import WikiArticlePage from './components/wiki/WikiArticlePage';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:userId" element={<Profile />} />
            <Route path="/media" element={<Media />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/forum" element={<Forum />} />
            <Route path="/wiki" element={<Wiki />} />
            <Route path="/wiki/:articleId" element={<WikiArticlePage />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
          <FullHeightChatSidebar />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
