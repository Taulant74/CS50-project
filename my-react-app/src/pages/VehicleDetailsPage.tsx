// src/pages/VehicleDetailsPage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { api } from "../api";
import type { Vehicle } from "../types";

const VehicleDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);

  const [favLoading, setFavLoading] = useState(false);
  const [favMessage, setFavMessage] = useState<string | null>(null);
  const [favError, setFavError] = useState<string | null>(null);

  // Load vehicle details from backend
  useEffect(() => {
    if (!id) return;

    const fetchVehicle = async () => {
      try {
        setLoading(true);
        setPageError(null);
        const res = await api.get<Vehicle>(`/vehicles/${id}`);
        setVehicle(res.data);
      } catch (err) {
        console.error("Failed to load vehicle:", err);
        setPageError("Failed to load vehicle details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [id]);

  // Helper: ensure user is logged in, otherwise redirect to login
  const ensureLoggedIn = (): { token: string; userId: number } | null => {
    const token = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");

    if (!token || !storedUserId) {
      alert("Please log in to use this feature.");
      navigate("/login", { state: { from: location.pathname } });
      return null;
    }

    const userId = parseInt(storedUserId, 10);
    if (!userId || Number.isNaN(userId)) {
      alert("Your session is invalid. Please log in again.");
      navigate("/login", { state: { from: location.pathname } });
      return null;
    }

    return { token, userId };
  };

  const handleAddToFavorites = async () => {
    if (!id) return;

    const auth = ensureLoggedIn();
    if (!auth) return;

    const { token, userId } = auth;

    try {
      setFavLoading(true);
      setFavError(null);
      setFavMessage(null);

      await api.post(
        "/favorites",
        {
          userId,
          vehicleId: Number(id),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFavMessage("Vehicle added to your favorites.");
    } catch (err: any) {
      console.error("Add favorite error:", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.title ||
        err?.response?.data ||
        "Failed to add to favorites.";
      setFavError(typeof msg === "string" ? msg : "Failed to add to favorites.");
    } finally {
      setFavLoading(false);
    }
  };

  const handleBookTestDrive = () => {
    if (!vehicle) return;

    const auth = ensureLoggedIn();
    if (!auth) return;

    // user is logged in → go to test-drive page
    navigate(`/test-drive/${vehicle.id}`);
  };

  const handleSendInquiry = () => {
    if (!vehicle) return;

    const auth = ensureLoggedIn();
    if (!auth) return;

    // user is logged in → go to inquiry page
    navigate(`/inquiry/${vehicle.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-gray-400">Loading vehicle details...</p>
        </div>
      </div>
    );
  }

  if (pageError || !vehicle) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-gray-50 flex items-center justify-center">
        <div className="max-w-md text-center space-y-3">
          <p className="text-sm text-red-400">
            {pageError ?? "Vehicle not found."}
          </p>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs text-gray-100"
          >
            ← Back to listings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-4 text-xs text-gray-400 hover:text-gray-200 transition-colors"
        >
          ← Back to listings
        </button>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Image + highlights */}
          <div className="lg:col-span-3 bg-gray-900/80 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="relative h-72 md:h-96">
              <img
                src={
                  vehicle.imageUrls?.split(",")[0]?.trim() ||
                  "https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg?auto=compress&cs=tinysrgb&w=1200"
                }
                alt={`${vehicle.brand} ${vehicle.model}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex justify-between items-end">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-blue-300">
                    {vehicle.brand}
                  </p>
                  <h1 className="text-2xl font-semibold">
                    {vehicle.model}{" "}
                    <span className="text-gray-300 text-base">
                      • {vehicle.year}
                    </span>
                  </h1>
                </div>
                <span className="px-3 py-1 rounded-full bg-blue-600/90 text-xs font-semibold">
                  ID #{vehicle.id}
                </span>
              </div>
            </div>
          </div>

          {/* Info + actions */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-5 shadow-xl">
              <p className="text-xs text-gray-400 mb-1">Price</p>
              <p className="text-3xl font-bold text-blue-400 mb-1">
                € {vehicle.price.toLocaleString("de-DE")}
              </p>
              <p className="text-xs text-gray-500">
                Financing options available upon request.
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3 text-xs text-gray-300">
                <div className="rounded-xl bg-gray-800/80 border border-gray-700 p-3">
                  <p className="text-[11px] text-gray-400">Mileage</p>
                  <p className="text-sm font-semibold">
                    {vehicle.mileage.toLocaleString("de-DE")} km
                  </p>
                </div>
                <div className="rounded-xl bg-gray-800/80 border border-gray-700 p-3">
                  <p className="text-[11px] text-gray-400">Fuel type</p>
                  <p className="text-sm font-semibold">{vehicle.fuelType}</p>
                </div>
                <div className="rounded-xl bg-gray-800/80 border border-gray-700 p-3">
                  <p className="text-[11px] text-gray-400">Transmission</p>
                  <p className="text-sm font-semibold">
                    {vehicle.transmission}
                  </p>
                </div>
                <div className="rounded-xl bg-gray-800/80 border border-gray-700 p-3">
                  <p className="text-[11px] text-gray-400">Color</p>
                  <p className="text-sm font-semibold">
                    {vehicle.color ?? "—"}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={handleBookTestDrive}
                  className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm font-semibold transition-colors"
                >
                  Book a test drive
                </button>
                <button
                  type="button"
                  onClick={handleSendInquiry}
                  className="w-full py-2.5 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-600 text-sm font-semibold transition-colors"
                >
                  Send an inquiry
                </button>
                <button
                  type="button"
                  onClick={handleAddToFavorites}
                  disabled={favLoading}
                  className="w-full py-2 rounded-lg text-xs text-blue-300 hover:text-blue-200 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {favLoading ? "Adding to favorites..." : "♥ Add to favorites"}
                </button>

                {favMessage && (
                  <p className="text-[11px] text-green-400 mt-1">
                    {favMessage}
                  </p>
                )}
                {favError && (
                  <p className="text-[11px] text-red-400 mt-1">{favError}</p>
                )}
              </div>
            </div>

            <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-5 text-sm space-y-3">
              <h2 className="text-sm font-semibold text-gray-100">
                Vehicle overview
              </h2>
              {vehicle.shortDescription && (
                <p className="text-gray-300">{vehicle.shortDescription}</p>
              )}
              {vehicle.branch && (
                <p className="text-gray-400 text-xs">
                  Location:{" "}
                  <span className="text-gray-200">
                    {vehicle.branch.city} • {vehicle.branch.name}
                  </span>
                </p>
              )}
            </div>

            <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-5 text-sm space-y-3">
              <h3 className="text-sm font-semibold text-gray-100">
                Full description
              </h3>
              <p className="text-gray-300 leading-relaxed text-xs md:text-sm">
                {vehicle.description ?? "No additional description provided."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailsPage;
