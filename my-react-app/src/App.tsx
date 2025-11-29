// src/App.tsx
import React, { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Link,
  useLocation,
  Navigate,
} from "react-router-dom";

import Autosallon from "./pages/autosallon";
import VehicleDetailsPage from "./pages/VehicleDetailsPage";
import FavoritesPage from "./pages/FavoritesPage";
import TestDrivePage from "./pages/TestDrivePage";
import InquiryPage from "./pages/InquiryPage";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";

interface ProtectedRouteProps {
  isLoggedIn: boolean;
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  isLoggedIn,
  children,
}) => {
  const location = useLocation();

  if (!isLoggedIn) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Check login on load
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // Read user + role from localStorage on every render
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const isAdmin = isLoggedIn && user?.role === "Admin";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    window.location.href = "/login"; // full redirect
  };

  return (
    <>
      <header className="p-4 bg-gray-900 text-white flex justify-between items-center">
        <h1 className="text-xl font-bold">VirtuRide</h1>

        <nav className="flex gap-4 text-sm">
          <Link to="/" className="hover:underline">
            Home
          </Link>

          {isLoggedIn && (
            <Link to="/favorites" className="hover:underline">
              Favorites
            </Link>
          )}

          {/* 🔐 Only show if logged in AND role is Admin */}
          {isAdmin && (
            <Link to="/admin" className="hover:underline">
              Admin Dashboard
            </Link>
          )}

          {!isLoggedIn ? (
            <Link to="/login" className="hover:underline">
              Login
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="hover:underline text-red-300"
            >
              Logout
            </button>
          )}
        </nav>
      </header>

      <main className="p-4 min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-gray-50">
        <Routes>
          <Route path="/" element={<Autosallon />} />
          <Route path="/vehicle/:id" element={<VehicleDetailsPage />} />

          <Route
            path="/favorites"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <FavoritesPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/test-drive/:vehicleId"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <TestDrivePage />
              </ProtectedRoute>
            }
          />

          {/* 🔐 Only admins can access /admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute isLoggedIn={isAdmin}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/inquiry/:vehicleId"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <InquiryPage />
              </ProtectedRoute>
            }
          />

          {/* Login gets setIsLoggedIn so navbar updates after login */}
          <Route
            path="/login"
            element={<LoginPage setIsLoggedIn={setIsLoggedIn} />}
          />
        </Routes>
      </main>
    </>
  );
};

export default App;
