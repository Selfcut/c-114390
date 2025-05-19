import { BrowserRouter as Router } from "react-router-dom";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Toaster } from "./components/ui/toaster";
import { ThemeProvider } from "./components/providers/ThemeProvider";
import { AuthProvider } from "./lib/auth";
import { QueryProvider } from './components/providers/QueryProvider';
import { AppRoutes } from "./components/routing/AppRoutes";
import { Route } from "react-router-dom";
import SavedQuotes from './pages/SavedQuotes';

function App() {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <QueryProvider>
          <AuthProvider>
            <Router>
              <AppRoutes />
              <Route path="/saved-quotes" element={<SavedQuotes />} />
              <Toaster />
            </Router>
          </AuthProvider>
        </QueryProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
