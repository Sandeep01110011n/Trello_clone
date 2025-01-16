import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Board from "./pages/Board";
import Navbar from "./components/Navbar";

function App() {
  console.log("vite" + ":" + import.meta.env.VITE_APP_KES);

  return (
    <>
      <div className="app ">
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Navigate to="/boards" replace />} />
            <Route path="/boards" element={<Home />} />
            <Route path="/boards/:boardId" element={<Board />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
