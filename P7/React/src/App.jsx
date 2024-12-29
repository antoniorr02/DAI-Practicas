import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProductDetail from "./components/ProductDetail";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/react/" element={<Home />} />
        <Route path="/react/product/:id" element={<ProductDetail />} />
      </Routes>
    </Router>
  );
};

export default App;
