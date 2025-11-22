import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import type { Vehicle } from "../types";

const AutoSallonPage: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");

  const navigate = useNavigate();

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError("");

      const params: any = {};
      if (search.trim()) {
        params.brand = search.trim();
        params.model = search.trim();
        // backend supports brand and model – we can call /vehicles/search
      }
      if (minPrice) params.minPrice = Number(minPrice);
      if (maxPrice) params.maxPrice = Number(maxPrice);

      let res;
      if (Object.keys(params).length > 0) {
        res = await api.get<Vehicle[]>("/vehicles/search", { params });
      } else {
        res = await api.get<Vehicle[]>("/vehicles");
      }

      setVehicles(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load vehicles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchVehicles();
  };

  const getFirstImage = (imageUrls?: string) => {
    if (!imageUrls) return "";
    const parts = imageUrls.split(",").map((s) => s.trim());
    return parts[0] || "";
  };

  return (
    <div className="page-container autosallon-page">
      <h2 className="text-2xl font-bold mb-4">Available Vehicles</h2>

      {/* Filters */}
      <form
        onSubmit={handleSearchSubmit}
        className="mb-6 flex flex-wrap gap-3 items-end"
      >
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Search brand/model</label>
          <input
            type="text"
            className="border rounded px-3 py-2"
            placeholder="BMW, Audi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Min price (€)</label>
          <input
            type="number"
            className="border rounded px-3 py-2"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Max price (€)</label>
          <input
            type="number"
            className="border rounded px-3 py-2"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded font-medium"
        >
          Filter
        </button>
      </form>

      {loading && <p>Loading cars...</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {!loading && !error && vehicles.length === 0 && (
        <p>No vehicles found. Try different filters.</p>
      )}

      {/* Cards */}
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
                  {v.year} • {v.mileage.toLocaleString()} km • {v.fuelType}
                </p>
                <p className="font-bold text-blue-600 text-lg">
                  € {v.price.toLocaleString()}
                </p>
                {v.shortDescription && (
                  <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                    {v.shortDescription}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AutoSallonPage;
