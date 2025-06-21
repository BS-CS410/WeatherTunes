import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import { SettingsProvider } from "./contexts/SettingsProvider";
import { AppLayout } from "./components";
import HomePage from "./pages/HomePage";
import { ErrorBoundary } from "./components/shared/ErrorBoundary";
import { OAuthCallback } from "./components/auth/OAuthCallback";

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <SettingsProvider>
          <AppLayout
            maxWidth="lg"
            className="min-height-full relative mx-auto flex w-full flex-1 flex-col"
          >
            {/* Page Content */}
            <main>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/callback" element={<OAuthCallback />} />
                {/* Fallback route: redirects unknown paths to the main page */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </AppLayout>
        </SettingsProvider>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
