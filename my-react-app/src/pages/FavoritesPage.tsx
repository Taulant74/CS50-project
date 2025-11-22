import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import type { Vehicle } from "../types";

const MOCK_USER_ID = 1;

const FavoritesPage: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get<Vehicle[]>(`/favorites/user/${MOCK_USER_ID}`);
      setVehicles(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load favorites.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const getFirstImage = (imageUrls?: string) => {
    if (!imageUrls) return "";
    const parts = imageUrls.split(",").map((s) => s.trim());
    return parts[0] || "";
  };

  const handleRemove = async (vehicleId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.delete("/favorites", {
        params: { userId: MOCK_USER_ID, vehicleId },
      });
      setVehicles((prev) => prev.filter((v) => v.id !== vehicleId));
    } catch (err) {
      console.error(err);
      alert("Failed to remove favorite.");
    }
  };

  if (loading) return <p>Loading favorites...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="page-container favorites-page">
      <h2 className="text-2xl font-bold mb-4">My Favorites</h2>

      {vehicles.length === 0 && <p>No favorites yet.</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {vehicles.map((v) => {
          const img = getFirstImage(v.imageUrls);
          return (
            <div
              key={v.id}
              className="bg-white shadow rounded overflow-hidden flex flex-col cursor-pointer hover:shadow-lg transition"
              onClick={() => navigate(`/vehicle/${v.id}`)}
            >
              {img ? (
                <img
                  src={img}
                  alt={`${v.brand} ${v.model}`}
                  className="h-40 w-full object-cover"
                />
              ) : (
                <div className="h-40 w-full bg-gray-300 flex items-center justify-center text-gray-600 text-sm">
                  No image
                </div>
              )}

              <div className="p-4 flex flex-col gap-1">
                <h3 className="font-semibold text-lg">
                  {v.brand} {v.model}
                </h3>
                <p className="text-sm text-gray-600">
                  {v.year} • {v.mileage.toLocaleString()} km
                </p>
                <p className="font-bold text-blue-600 text-lg">
                  € {v.price.toLocaleString()}
                </p>

                <button
                  onClick={(e) => handleRemove(v.id, e)}
                  className="mt-3 text-xs text-red-600 hover:underline self-start"
                >
                  Remove from favorites
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FavoritesPage;
