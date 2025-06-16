import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import NavBar from "./components/NavBar";
import MainPage from "./pages/MainPage";
import { ResponsiveLayout } from "./components/ResponsiveLayout";

function App() {
  return (
    <ResponsiveLayout
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
          {/* TODO: make fallback Route to send unknown routes to login page */}
        </Routes>
      </main>
    </ResponsiveLayout>
  );
}

export default App;
