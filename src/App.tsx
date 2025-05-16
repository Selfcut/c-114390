
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from '@/lib/theme-context';
import { AuthProvider } from '@/lib/auth'; 
import { Toaster } from '@/components/ui/toaster';
import { initializeSupabase } from '@/integrations/supabase/init';
import { initializeSupabaseUtils } from '@/lib/utils/supabase-utils';
import { AppRoutes } from '@/components/routing/AppRoutes';
import { FullHeightChatSidebar } from '@/components/chat/FullHeightChatSidebar';

// Initialize Supabase
initializeSupabase();
// Initialize Supabase utility functions
initializeSupabaseUtils();

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="polymath-ui-theme">
      <AuthProvider>
        <Router>
          <AppRoutes />
          <FullHeightChatSidebar />
        </Router>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
