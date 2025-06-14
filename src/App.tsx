import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import NavBar from "./components/NavBar";
import MainPage from "./pages/MainPage";

function App() {
  return (
    <>
      <div className="min-height-full relative mx-auto flex w-full max-w-3xl flex-1 flex-col px-4">
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
      </div>
    </>
  );
}

export default App;
