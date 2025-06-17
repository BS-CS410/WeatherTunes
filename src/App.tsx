import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import { NavBar, AppLayout } from "./components";
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
        {/* Shared NavBar */}
        <NavBar />
        {/* Page Content */}
        <main>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/auth-callback" element={<AuthCallback />} />
            {/* TODO: make fallback Route to send unknown routes to login page */}
          </Routes>
        </main>
      </AppLayout>
    </ErrorBoundary>
  );
}

export default App;
