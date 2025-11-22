import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../api";
import type { Vehicle, Favorite } from "../types";

const MOCK_USER_ID = 1; // later replace with real auth

const VehicleDetailsPage: React.FC = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [favoriteLoading, setFavoriteLoading] = useState<boolean>(false);
  const [favoriteMsg, setFavoriteMsg] = useState<string>("");

  const navigate = useNavigate();

  const fetchVehicle = async () => {
    try {
      setLoading(true);
      const res = await api.get<Vehicle>(`/vehicles/${id}`);
      setVehicle(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load vehicle.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchVehicle();
    }
  }, [id]);

  const imageList = () => {
    if (!vehicle?.imageUrls) return [];
    return vehicle.imageUrls
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  };

  const handleAddFavorite = async () => {
    if (!vehicle) return;
    setFavoriteLoading(true);
    setFavoriteMsg("");

    const payload: Favorite = {
      userId: MOCK_USER_ID,
      vehicleId: vehicle.id,
    };

    try {
      await api.post("/favorites", payload);
      setFavoriteMsg("Added to favorites ✅");
    } catch (err: any) {
      console.error(err);
      if (err?.response?.status === 409) {
        setFavoriteMsg("Already in favorites.");
      } else {
        setFavoriteMsg("Failed to add to favorites.");
      }
    } finally {
      setFavoriteLoading(false);
    }
  };

  if (loading) return <p>Loading vehicle...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!vehicle) return <p>Vehicle not found.</p>;

  const imgs = imageList();

  return (
    <div className="page-container vehicle-details-page max-w-4xl">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-sm text-blue-600 hover:underline"
      >
        ← Back
      </button>

      <div className="bg-white shadow rounded p-4 flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            {imgs.length > 0 ? (
              <img
                src={imgs[0]}
                alt={`${vehicle.brand} ${vehicle.model}`}
                className="w-full h-64 object-cover rounded"
              />
            ) : (
              <div className="w-full h-64 bg-gray-300 flex items-center justify-center">
                No image
              </div>
            )}

            {imgs.length > 1 && (
              <div className="flex gap-2 mt-2 overflow-x-auto">
                {imgs.slice(1).map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`Thumbnail ${idx}`}
                    className="w-20 h-16 object-cover rounded border"
                  />
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold">
              {vehicle.brand} {vehicle.model}
            </h2>
            <p className="text-gray-700">
              {vehicle.year} • {vehicle.mileage.toLocaleString()} km •{" "}
              {vehicle.fuelType}
            </p>
            <p className="text-gray-700">
              Transmission: {vehicle.transmission || "N/A"}
            </p>
            <p className="text-gray-700">Color: {vehicle.color || "N/A"}</p>
            <p className="text-xl font-bold text-blue-600 mt-2">
              € {vehicle.price.toLocaleString()}
            </p>

            {vehicle.branch && (
              <p className="text-sm text-gray-500 mt-2">
                Location: {vehicle.branch.name} - {vehicle.branch.city},{" "}
                {vehicle.branch.address}
              </p>
            )}

            <div className="flex flex-wrap gap-3 mt-4">
              <button
                onClick={handleAddFavorite}
                disabled={favoriteLoading}
                className="bg-pink-600 text-white px-4 py-2 rounded text-sm font-medium"
              >
                {favoriteLoading ? "Adding..." : "❤ Add to Favorites"}
              </button>

              <Link
                to={`/test-drive/${vehicle.id}`}
                className="bg-green-600 text-white px-4 py-2 rounded text-sm font-medium"
              >
                Book Test Drive
              </Link>

              <Link
                to={`/inquiry/${vehicle.id}`}
                className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium"
              >
                Contact Seller
              </Link>
            </div>

            {favoriteMsg && (
              <p className="text-sm mt-2 text-gray-700">{favoriteMsg}</p>
            )}
          </div>
        </div>

        {vehicle.description && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-gray-800 whitespace-pre-line">
              {vehicle.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleDetailsPage;
