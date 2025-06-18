import './App.css';
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './paginas/Home';
import Planejamento from './paginas/Planejamento';
import { useEffect } from 'react';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </div>
  );
}

function AppRoutes() {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/" element={<Home navigate={navigate} />} />
      <Route path="/planejamento" element={<Planejamento />} />
    </Routes>
  );
}

export default App;