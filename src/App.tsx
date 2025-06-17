import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import { AppLayout } from "./components";
import MainPage from "./pages/MainPage";
import AuthCallback from "./pages/AuthCallback";
import { ErrorBoundary } from "./components/shared/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <AppLayout
        maxWidth="lg"
        className="min-height-full relative mx-auto flex w-full flex-1 flex-col"
      >
        {/* Page Content */}
        <main>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/auth-callback" element={<AuthCallback />} />
            {/* Fallback route: redirects unknown paths to the main page */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </AppLayout>
    </ErrorBoundary>
  );
}

export default App;
