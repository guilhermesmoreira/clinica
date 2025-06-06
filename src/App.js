import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Home from "./paginas/Home";
import Planejamento from "./paginas/Planejamento";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="planejamento" element={<Planejamento />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
