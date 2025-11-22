import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Autosallon from "./pages/autosallon";
import VehicleDetailsPage from "./pages/VehicleDetailsPage";
import FavoritesPage from "./pages/FavoritesPage";
import TestDrivePage from "./pages/TestDrivePage";
import InquiryPage from "./pages/InquiryPage";

const App: React.FC = () => {
  return (
    <>
      <header className="site-header">
        <div className="page-container">
          <div className="brand">
            <div className="mark" />
            <h1 className="brand-title">VirtuRide</h1>
          </div>

          <nav className="nav-links">
            <Link to="/" className="nav-link">
              Home
            </Link>
            <Link to="/favorites" className="nav-link">
              Favorites
            </Link>
            <Link to="/" className="btn btn-outline">Sell Your Car</Link>
          </nav>
        </div>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Autosallon />} />
          <Route path="/vehicle/:id" element={<VehicleDetailsPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/test-drive/:vehicleId" element={<TestDrivePage />} />
          <Route path="/inquiry/:vehicleId" element={<InquiryPage />} />
        </Routes>
      </main>
    </>
  );
};

export default App;
