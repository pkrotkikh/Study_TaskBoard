import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useContext, ReactNode } from "react";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Logout from "./pages/Logout";
import Test from "./pages/Test";


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/test" element={<Test />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}