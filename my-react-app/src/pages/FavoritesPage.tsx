// src/pages/FavoritesPage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Vehicle } from "../types";
import { api } from "../api";

const FavoritesPage: React.FC = () => {
  const navigate = useNavigate();

  const [favorites, setFavorites] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        const storedUserId = localStorage.getItem("userId");

        if (!token || !storedUserId) {
          setError("You must be logged in to view favorites.");
          setLoading(false);
          return;
        }

        const userId = parseInt(storedUserId, 10);
        if (!userId || Number.isNaN(userId)) {
          setError("Invalid user session. Please log in again.");
          setLoading(false);
          return;
        }

        const res = await api.get<Vehicle[]>(`/favorites/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setFavorites(res.data ?? []);
      } catch (err) {
        console.error("Failed to load favorites:", err);
        setError("Failed to load favorites. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const hasFavorites = favorites.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Your favorites</h1>
            <p className="text-xs text-gray-400 mt-1">
              Save vehicles you love and come back to them anytime.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-xs text-blue-300 hover:text-blue-200"
          >
            ← Browse more vehicles
          </button>
        </div>

        {/* Loading / error states */}
        {loading && (
          <div className="flex justify-center py-10">
            <div className="flex flex-col items-center gap-2">
              <div className="w-7 h-7 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-gray-400">Loading your favorites...</p>
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="bg-red-500/10 border border-red-500/40 rounded-2xl p-4 text-sm text-red-200">
            {error}
          </div>
        )}

        {!loading && !error && !hasFavorites && (
          <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-10 text-center">
            <p className="text-sm text-gray-300 mb-3">
              You haven&apos;t added any favorites yet.
            </p>
            <p className="text-xs text-gray-500 mb-4">
              Tap the ♥ button on a vehicle to add it here.
            </p>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold"
            >
              Browse vehicles
            </button>
          </div>
        )}

        {!loading && !error && hasFavorites && (
          <div className="grid gap-5 md:grid-cols-2">
            {favorites.map((vehicle) => {
              const img =
                vehicle.imageUrls?.split(",")[0]?.trim() ||
                "https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg";

              return (
                <div
                  key={vehicle.id}
                  className="group bg-gray-900/80 border border-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-blue-500/20 transition-all duration-300 cursor-pointer"
                  onClick={() => navigate(`/vehicle/${vehicle.id}`)}
                >
                  <div className="h-40 overflow-hidden relative">
                    <img
                      src={img}
                      alt={`${vehicle.brand} ${vehicle.model}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <span className="absolute top-3 right-3 text-lg text-red-400 drop-shadow">
                      ♥
                    </span>
                  </div>
                  <div className="p-4 space-y-1">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-semibold text-gray-100">
                        {vehicle.brand} {vehicle.model}
                      </p>
                      <p className="text-xs text-gray-400">{vehicle.year}</p>
                    </div>
                    <p className="text-sm font-semibold text-blue-400">
                      € {vehicle.price.toLocaleString("de-DE")}
                    </p>
                    <p className="text-[11px] text-gray-400">
                      {vehicle.mileage.toLocaleString("de-DE")} km •{" "}
                      {vehicle.fuelType} • {vehicle.transmission}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
