import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Music from "./pages/Music";
import Favorites from "./pages/Favorites";
import NavBar from "./components/NavBar";

function App() {
  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-3xl flex-1 flex-col px-4">
      {/* Shared NavBar */}
      <NavBar />
      {/* TODO: Move MusicPlayer to here; pass props to it */}
      {/* Page Content */}
      <main className="p-4">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/music" element={<Music />} />
          <Route path="/favorites" element={<Favorites />} />
          {/* TODO: make fallback Route to send unknown routes to login page */}
        </Routes>
      </main>
    </div>
  );
}

export default App;
