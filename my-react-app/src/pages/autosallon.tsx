// src/pages/Autosallon.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import type { Vehicle } from "../types";

type SortOption = "newest" | "priceAsc" | "priceDesc" | "yearAsc" | "yearDesc";

const Autosallon: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchBrand, setSearchBrand] = useState("");
  const [searchModel, setSearchModel] = useState("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");

  // 🔽 New: sorting
  const [sortOption, setSortOption] = useState<SortOption>("newest");

  // 🔽 New: pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const PAGE_SIZE = 9;

  // 🔽 New: comparison
  const [compareList, setCompareList] = useState<Vehicle[]>([]);

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
    setCurrentPage(1); // reset to first page when applying filters
    fetchVehicles();
  };

  const formatPrice = (price: number) =>
    price.toLocaleString("en-US", { style: "currency", currency: "EUR" });

  // 🔽 New: sort helper
  const getSortedVehicles = (): Vehicle[] => {
    const arr = [...vehicles];
    arr.sort((a, b) => {
      switch (sortOption) {
        case "priceAsc":
          return Number(a.price) - Number(b.price);
        case "priceDesc":
          return Number(b.price) - Number(a.price);
        case "yearAsc":
          return a.year - b.year;
        case "yearDesc":
          return b.year - a.year;
        case "newest":
        default:
          // newest by CreatedAt descending, fallback to year
          const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          if (aDate !== bDate) return bDate - aDate;
          return b.year - a.year;
      }
    });
    return arr;
  };

  const sortedVehicles = getSortedVehicles();

  // 🔽 New: pagination logic
  const totalPages = Math.max(1, Math.ceil(sortedVehicles.length / PAGE_SIZE));
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const pagedVehicles = sortedVehicles.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // 🔽 New: comparison toggle
  const toggleCompare = (vehicle: Vehicle) => {
    setCompareList((prev) => {
      const exists = prev.some((v) => v.id === vehicle.id);
      if (exists) {
        return prev.filter((v) => v.id !== vehicle.id);
      }
      if (prev.length >= 3) {
        alert("You can compare up to 3 vehicles at a time.");
        return prev;
      }
      return [...prev, vehicle];
    });
  };

  const isInCompare = (id: number) =>
    compareList.some((v) => v.id === id);

  const clearCompare = () => setCompareList([]);

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
            <div className="flex flex-col gap-3 items-end">
              <div className="px-4 py-3 rounded-xl bg-blue-500/10 border border-blue-500/40 shadow-lg shadow-blue-500/20">
                <p className="text-xs uppercase text-blue-300 mb-1">
                  Vehicles online
                </p>
                <p className="text-2xl font-semibold text-white">
                  {vehicles.length}
                </p>
              </div>

              {/* 🔽 Sort dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Sort by</span>
                <select
                  value={sortOption}
                  onChange={(e) =>
                    setSortOption(e.target.value as SortOption)
                  }
                  className="text-xs bg-gray-900/80 border border-gray-700 rounded-lg px-3 py-1.5 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="newest">Newest listings</option>
                  <option value="priceAsc">Price: Low → High</option>
                  <option value="priceDesc">Price: High → Low</option>
                  <option value="yearDesc">Year: New → Old</option>
                  <option value="yearAsc">Year: Old → New</option>
                </select>
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
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
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
              <div className="flex flex-col md:flex-row gap-2 md:col-span-2 md:justify-end">
                <button
                  type="submit"
                  className="w-full md:w-auto inline-flex justify-center items-center rounded-lg bg-blue-600 hover:bg-blue-500 text-sm font-semibold px-4 py-2.5 text-white shadow-lg shadow-blue-500/30 transition"
                >
                  Search vehicles
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSearchBrand("");
                    setSearchModel("");
                    setMinPrice("");
                    setMaxPrice("");
                    setCurrentPage(1);
                    fetchVehicles();
                  }}
                  className="w-full md:w-auto inline-flex justify-center items-center rounded-lg bg-gray-800 hover:bg-gray-700 text-xs font-semibold px-4 py-2.5 text-gray-200 border border-gray-700 transition"
                >
                  Reset filters
                </button>
              </div>
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
          ) : sortedVehicles.length === 0 ? (
            <div className="rounded-xl bg-gray-900/80 border border-gray-700/70 text-gray-300 text-sm px-4 py-6 text-center">
              No vehicles match your filters. Try adjusting your search.
            </div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {pagedVehicles.map((v) => {
                  const img =
                    v.imageUrls?.split(",")[0]?.trim() ||
                    "https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg";

                  const selected = isInCompare(v.id);

                  return (
                    <div
                      key={v.id}
                      className={`group bg-gray-900/80 border rounded-2xl overflow-hidden shadow-xl shadow-black/40 hover:shadow-blue-500/40 hover:-translate-y-1 transition-transform ${
                        selected ? "border-blue-500" : "border-gray-800"
                      }`}
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
                            {formatPrice(Number(v.price))}
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
                          <div className="flex flex-col items-end gap-1">
                            <button
                              onClick={() => navigate(`/vehicle/${v.id}`)}
                              className="text-xs font-semibold text-blue-400 hover:text-blue-300"
                            >
                              View details →
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleCompare(v)}
                              className={`text-[11px] px-2 py-1 rounded-full border ${
                                selected
                                  ? "bg-blue-600/80 border-blue-400 text-white"
                                  : "bg-gray-800/80 border-gray-600 text-gray-200 hover:bg-gray-700"
                              }`}
                            >
                              {selected ? "Remove from compare" : "Compare"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 🔽 Pagination controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-8">
                  <button
                    type="button"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1.5 rounded-lg text-xs border ${
                      currentPage === 1
                        ? "border-gray-700 text-gray-500 cursor-not-allowed"
                        : "border-gray-600 text-gray-200 hover:bg-gray-800"
                    }`}
                  >
                    ← Previous
                  </button>
                  <span className="text-xs text-gray-400">
                    Page{" "}
                    <span className="text-gray-100 font-semibold">
                      {currentPage}
                    </span>{" "}
                    of{" "}
                    <span className="text-gray-100 font-semibold">
                      {totalPages}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1.5 rounded-lg text-xs border ${
                      currentPage === totalPages
                        ? "border-gray-700 text-gray-500 cursor-not-allowed"
                        : "border-gray-600 text-gray-200 hover:bg-gray-800"
                    }`}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        {/* 🔽 Compare panel */}
        {compareList.length > 0 && (
          <section className="mt-10">
            <div className="bg-gray-950/90 border border-gray-800 rounded-2xl p-5 shadow-xl overflow-x-auto">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm font-semibold text-white">
                    Compare vehicles ({compareList.length}/3)
                  </h2>
                  <p className="text-xs text-gray-400">
                    Click &quot;Remove from compare&quot; on a card to remove it from this view.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={clearCompare}
                  className="text-[11px] px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-600 text-gray-200"
                >
                  Clear comparison
                </button>
              </div>

              <div className="min-w-full overflow-x-auto">
                <table className="min-w-full text-xs text-gray-200">
                  <thead>
                    <tr>
                      <th className="text-left text-[11px] text-gray-400 pb-2 pr-4">
                        Spec
                      </th>
                      {compareList.map((v) => (
                        <th
                          key={v.id}
                          className="text-left text-[11px] text-gray-300 pb-2 px-4"
                        >
                          {v.brand} {v.model} ({v.year})
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-gray-800">
                      <td className="py-2 pr-4 text-gray-400">Price</td>
                      {compareList.map((v) => (
                        <td key={v.id} className="py-2 px-4">
                          {formatPrice(Number(v.price))}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-t border-gray-800">
                      <td className="py-2 pr-4 text-gray-400">Mileage</td>
                      {compareList.map((v) => (
                        <td key={v.id} className="py-2 px-4">
                          {v.mileage.toLocaleString()} km
                        </td>
                      ))}
                    </tr>
                    <tr className="border-t border-gray-800">
                      <td className="py-2 pr-4 text-gray-400">Fuel type</td>
                      {compareList.map((v) => (
                        <td key={v.id} className="py-2 px-4">
                          {v.fuelType}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-t border-gray-800">
                      <td className="py-2 pr-4 text-gray-400">Transmission</td>
                      {compareList.map((v) => (
                        <td key={v.id} className="py-2 px-4">
                          {v.transmission ?? "—"}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-t border-gray-800">
                      <td className="py-2 pr-4 text-gray-400">Color</td>
                      {compareList.map((v) => (
                        <td key={v.id} className="py-2 px-4">
                          {v.color ?? "—"}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-t border-gray-800">
                      <td className="py-2 pr-4 text-gray-400">Location</td>
                      {compareList.map((v) => (
                        <td key={v.id} className="py-2 px-4">
                          {v.branch
                            ? `${v.branch.city} • ${v.branch.name}`
                            : "—"}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-t border-gray-800">
                      <td className="py-2 pr-4 text-gray-400">Description</td>
                      {compareList.map((v) => (
                        <td key={v.id} className="py-2 px-4 text-[11px] text-gray-300">
                          {v.shortDescription ??
                            v.description ??
                            "No description."}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Autosallon;
