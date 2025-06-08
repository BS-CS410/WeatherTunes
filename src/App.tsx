import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import NavBar from "./components/NavBar";

function App() {
  return (
    <>
      {/* Shared NavBar */}
      <NavBar />
      {/* Page Content */}
      <main className="p-4">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          {/* TODO: make fallback Route to send unknown routes to login page */}
        </Routes>
      </main>
    </>
  );
}

export default App;
