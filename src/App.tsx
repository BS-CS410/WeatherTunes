import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import { SettingsProvider } from "./contexts/SettingsProvider";
import { AppLayout } from "./components";
import { AuthProvider } from "./contexts/AuthContext";
import { CurrentTrackProvider } from "./contexts/CurrentTrackProvider";
import HomePage from "./pages/HomePage";
import AuthCallbackPage from "./pages/AuthCallbackPage";
import { ErrorBoundary } from "./components/shared/ErrorBoundary";

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <AuthProvider>
          <SettingsProvider>
            <CurrentTrackProvider>
              <AppLayout
                maxWidth="lg"
                className="min-height-full relative mx-auto flex w-full flex-1 flex-col"
              >
                {/* Page Content */}
                <main>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route
                      path="/auth-callback"
                      element={<AuthCallbackPage />}
                    />
                    {/* Fallback route: redirects unknown paths to the main page */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>
              </AppLayout>
            </CurrentTrackProvider>
          </SettingsProvider>
        </AuthProvider>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
