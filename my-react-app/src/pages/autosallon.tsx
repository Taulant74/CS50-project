// src/pages/Autosallon.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import type { Vehicle } from "../types";

const Autosallon: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchBrand, setSearchBrand] = useState("");
  const [searchModel, setSearchModel] = useState("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");

  const navigate = useNavigate();

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get<Vehicle[]>("/vehicles/search", {
        params: {
          brand: searchBrand || undefined,
          model: searchModel || undefined,
          minPrice: minPrice || undefined,
          maxPrice: maxPrice || undefined,
        },
      });

      setVehicles(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load vehicles. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchVehicles();
  };

  const formatPrice = (price: number) =>
    price.toLocaleString("en-US", { style: "currency", currency: "EUR" });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-slate-900 text-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Hero */}
        <section className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-blue-400 mb-2">
                VirtuRide Autosallon
              </p>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Find your next ride in seconds.
              </h1>
              <p className="text-gray-400 max-w-xl text-sm md:text-base">
                Browse a curated collection of premium vehicles. Filter by brand,
                model, and price to quickly find the perfect match.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="px-4 py-3 rounded-xl bg-blue-500/10 border border-blue-500/40 shadow-lg shadow-blue-500/20">
                <p className="text-xs uppercase text-blue-300 mb-1">
                  Vehicles online
                </p>
                <p className="text-2xl font-semibold text-white">
                  {vehicles.length}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="mb-8">
          <form
            onSubmit={handleSearch}
            className="bg-gray-900/80 backdrop-blur-xl border border-gray-700/70 rounded-2xl p-4 md:p-5 shadow-xl shadow-black/40"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Brand
                </label>
                <input
                  type="text"
                  value={searchBrand}
                  onChange={(e) => setSearchBrand(e.target.value)}
                  placeholder="Audi, BMW, Mercedes..."
                  className="w-full rounded-lg bg-gray-800/80 border border-gray-700 px-3 py-2 text-sm text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Model
                </label>
                <input
                  type="text"
                  value={searchModel}
                  onChange={(e) => setSearchModel(e.target.value)}
                  placeholder="A4, C-Class, Golf..."
                  className="w-full rounded-lg bg-gray-800/80 border border-gray-700 px-3 py-2 text-sm text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Min price (€)
                  </label>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full rounded-lg bg-gray-800/80 border border-gray-700 px-3 py-2 text-sm text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Max price (€)
                  </label>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full rounded-lg bg-gray-800/80 border border-gray-700 px-3 py-2 text-sm text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full md:w-auto inline-flex justify-center items-center rounded-lg bg-blue-600 hover:bg-blue-500 text-sm font-semibold px-4 py-2.5 text-white shadow-lg shadow-blue-500/30 transition"
              >
                Search vehicles
              </button>
            </div>
          </form>
        </section>

        {/* Vehicles grid */}
        <section>
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="rounded-xl bg-red-500/10 border border-red-500/40 text-red-100 text-sm px-4 py-3">
              {error}
            </div>
          ) : vehicles.length === 0 ? (
            <div className="rounded-xl bg-gray-900/80 border border-gray-700/70 text-gray-300 text-sm px-4 py-6 text-center">
              No vehicles match your filters. Try adjusting your search.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {vehicles.map((v) => {
                const img =
                  v.imageUrls?.split(",")[0]?.trim() ||
                  "https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg";

                return (
                  <div
                    key={v.id}
                    className="group bg-gray-900/80 border border-gray-800 rounded-2xl overflow-hidden shadow-xl shadow-black/40 hover:shadow-blue-500/40 hover:-translate-y-1 transition-transform"
                  >
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={img}
                        alt={`${v.brand} ${v.model}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0" />
                      <div className="absolute bottom-3 left-3 text-xs px-3 py-1 rounded-full bg-black/60 text-gray-100 border border-white/10">
                        {v.year} • {v.mileage.toLocaleString()} km
                      </div>
                    </div>
                    <div className="p-4 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.2em] text-blue-400 mb-1">
                            {v.brand}
                          </p>
                          <h2 className="text-base font-semibold text-white">
                            {v.model}
                          </h2>
                          {v.branch && (
                            <p className="text-xs text-gray-400 mt-1">
                              {v.branch.city} • {v.branch.name}
                            </p>
                          )}
                        </div>
                        <p className="text-sm font-semibold text-green-400">
                          {formatPrice(v.price)}
                        </p>
                      </div>
                      {v.shortDescription && (
                        <p className="text-xs text-gray-400 line-clamp-2">
                          {v.shortDescription}
                        </p>
                      )}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex gap-2 text-[11px] text-gray-400">
                          <span className="px-2 py-1 rounded-full bg-gray-800/70">
                            {v.fuelType}
                          </span>
                          {v.transmission && (
                            <span className="px-2 py-1 rounded-full bg-gray-800/70">
                              {v.transmission}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => navigate(`/vehicle/${v.id}`)}
                          className="text-xs font-semibold text-blue-400 hover:text-blue-300"
                        >
                          View details →
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Autosallon;
