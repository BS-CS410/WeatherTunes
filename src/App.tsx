import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import Music from "./pages/Music";
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
            <Route path="/home" element={<Home />} />
            <Route path="/music" element={<Music />} />
            <Route path="/favorites" element={<Favorites />} />
            {/* TODO: make fallback Route to send unknown routes to login page */}
          </Routes>
        </main>
      </div>
    </>
  );
}

export default App;
