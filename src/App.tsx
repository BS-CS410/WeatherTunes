import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClientProvider } from '@tanstack/react-query';
import LoginPage from "./pages/LoginPage";
import { SettingsProvider } from "./contexts/SettingsProvider";
import { AuthProvider } from "./contexts/AuthProvider";
import { ServiceProvider } from "./contexts/ServiceContext";
import { queryClient } from "./lib/queryClient";
import { AppLayout } from "./components";
import MainPage from "./pages/MainPage";
import { ErrorBoundary } from "./components/shared/ErrorBoundary";
import { OAuthCallback } from "./components/auth/OAuthCallback";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <ErrorBoundary>
          <ServiceProvider>
            <AuthProvider>
              <SettingsProvider>
                <AppLayout
                  maxWidth="lg"
                  className="min-height-full relative mx-auto flex w-full flex-1 flex-col"
                >
                  {/* Page Content */}
                  <main>
                    <Routes>
                      <Route path="/" element={<MainPage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/callback" element={<OAuthCallback />} />
                      {/* Fallback route: redirects unknown paths to the main page */}
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </main>
                </AppLayout>
              </SettingsProvider>
            </AuthProvider>
          </ServiceProvider>
        </ErrorBoundary>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
