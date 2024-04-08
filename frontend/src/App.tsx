// import { useState } from 'react'
import React, { useState, Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import SearchList from "./components/SearchList";
import "./App.css";

// Lazy load pages
const LoginPage = React.lazy(() => import("./pages/LoginPage"));
const RegisterPage = React.lazy(() => import("./pages/RegisterPage"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const EditCity = React.lazy(() => import("./components/EditCity"));

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const role = localStorage.getItem("role");
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    // Logic to handle logout (e.g., setting isLoggedIn to false)
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div className="App">
        <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route
              path="/login"
              element={<LoginPage handleLogin={handleLogin} />}
            />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<SearchList />} />
            <Route
              path="/dashboard"
              element={
                isLoggedIn && role === "admin" ? (
                  <Dashboard />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
          <Route path="/update/:cityId" element={<EditCity />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
