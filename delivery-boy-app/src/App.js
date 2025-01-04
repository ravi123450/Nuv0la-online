// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DeliveryBoyPage from "./components/DeliveryBoyPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DeliveryBoyPage />} />
      </Routes>
    </Router>
  );
};

export default App;
