// src/pages/VehiclesPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

type Vehicle = {
  id: number | string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  images?: string[];
};

const VehiclesPage: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState<string>("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    axios
      .get<Vehicle[]>("https://localhost:7224/api/vehicles")
      .then((res) => {
        if (!mounted) return;
        setVehicles(res.data ?? []);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err?.message ?? "Failed to fetch vehicles");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    const min = Number(minPrice);
    const max = Number(maxPrice);

    return vehicles.filter((v) => {
      if (q) {
        const matches =
          (v.brand && v.brand.toString().toLowerCase().includes(q)) ||
          (v.model && v.model.toString().toLowerCase().includes(q));
        if (!matches) return false;
      }

      const price = Number(v.price ?? 0);
      if (!isNaN(min) && minPrice !== "" && price < min) return false;
      if (!isNaN(max) && maxPrice !== "" && price > max) return false;

      return true;
    });
  }, [vehicles, query, minPrice, maxPrice]);

  const fmtPrice = (value: number | string) => {
    const n = Number(value);
    if (isNaN(n)) return String(value);
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(n);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center text-gray-400">Loading vehicles...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 text-gray-100">
      <header className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Vehicles</h1>
        <p className="text-sm text-gray-400">
          Browse available cars from VirtuRide.
        </p>
      </header>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div className="md:col-span-2 flex gap-2">
          <input
            aria-label="Search by brand or model"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-700 bg-gray-900 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            placeholder="Search by brand or model"
          />
        </div>

        <div className="flex gap-2">
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-1/2 px-3 py-2 border border-gray-700 bg-gray-900 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            placeholder="Min price"
          />
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-1/2 px-3 py-2 border border-gray-700 bg-gray-900 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            placeholder="Max price"
          />
        </div>
      </div>

      <section>
        {filtered.length === 0 ? (
          <div className="text-center text-gray-500">
            No vehicles match your search/filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((v) => (
              <div
                key={v.id}
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/vehicle/${v.id}`)}
                onKeyDown={(e) => e.key === "Enter" && navigate(`/vehicle/${v.id}`)}
                className="bg-gray-900 border border-gray-800 rounded-lg shadow hover:shadow-lg transition transform hover:-translate-y-1 cursor-pointer overflow-hidden"
              >
                <div className="w-full h-44 bg-gray-800">
                  <img
                    src={
                      v.images && v.images.length
                        ? v.images[0]
                        : `https://picsum.photos/seed/vehicle${v.id}/800/480`
                    }
                    alt={`${v.brand} ${v.model}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-4 flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-sm text-gray-400">{v.brand}</div>
                      <div className="font-semibold text-lg text-gray-100">
                        {v.model}
                      </div>
                    </div>
                    <div className="text-indigo-400 font-bold">
                      {fmtPrice(v.price)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <div>{v.year}</div>
                    <div>{v.mileage.toLocaleString()} km</div>
                  </div>

                  <div className="mt-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/vehicle/${v.id}`);
                      }}
                      className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-sm"
                    >
                      View details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default VehiclesPage;
