import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Autosallon from "./pages/autosallon";
import VehicleDetailsPage from "./pages/VehicleDetailsPage";
import FavoritesPage from "./pages/FavoritesPage";
import TestDrivePage from "./pages/TestDrivePage";
import InquiryPage from "./pages/InquiryPage";
import LoginPage from "./pages/LoginPage";

const App: React.FC = () => {
  return (
    <>
      <header className="p-4 bg-gray-900 text-white flex justify-between items-center">
        <h1 className="text-xl font-bold">VirtuRide</h1>
        <nav className="flex gap-4 text-sm">
          <Link to="/" className="hover:underline">
            Home
          </Link>
          <Link to="/favorites" className="hover:underline">
            Favorites
          </Link>
          <Link to="/login" className="hover:underline">
            Login
          </Link>
        </nav>
      </header>

      <main className="p-4 bg-gray-100 min-h-screen">
        <Routes>
          <Route path="/" element={<Autosallon />} />
          <Route path="/vehicle/:id" element={<VehicleDetailsPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/test-drive/:vehicleId" element={<TestDrivePage />} />
          <Route path="/inquiry/:vehicleId" element={<InquiryPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </main>
    </>
  );
};

export default App;
