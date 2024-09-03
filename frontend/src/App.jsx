import React from "react";
import {
  BrowserRouter,
  Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/home";
import LogIn from "./pages/login";
import Register from "./pages/register";
import Services from "./pages/services";
import Planning from "./pages/planning";
import Business from "./pages/business";
import Dashboard from "./pages/dashboard";
import NotFound from "./pages/notFound";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ErrorBoundary from "./components/ErrorBoundary";
import { AuthProvider } from "./components/AuthContext";

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LogIn />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/services"
              element={
                <ProtectedRoute>
                  <Services />
                </ProtectedRoute>
              }
            />
            <Route
              path="/planning"
              element={
                <ProtectedRoute>
                  <Planning />
                </ProtectedRoute>
              }
            />
            <Route
              path="/business"
              element={
                <ProtectedRoute>
                  <Business />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
      <ToastContainer />
    </ErrorBoundary>
  );
}

export default App;
