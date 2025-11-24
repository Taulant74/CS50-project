// src/pages/VehicleDetailsPage.tsx
import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const VehicleDetailsPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Replace later with real fetch by ID
  const vehicle = {
    id,
    brand: "BMW",
    model: "M4 Competition",
    year: 2022,
    price: 89000,
    mileage: 12000,
    fuelType: "Petrol",
    transmission: "Automatic",
    color: "Black Sapphire",
    location: "Prishtina",
    imageUrl:
      "https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg?auto=compress&cs=tinysrgb&w=1200",
    shortDescription: "High-performance coupe with low mileage and full service history.",
    description:
      "This BMW M4 Competition offers an exceptional driving experience with a powerful engine, precise handling, and a premium interior. The vehicle comes with full service history, new summer tires, and a clean interior. It has never been involved in any accidents.",
  };

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
                src={vehicle.imageUrl}
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
                  <p className="text-sm font-semibold">{vehicle.color}</p>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => navigate(`/test-drive/${vehicle.id}`)}
                  className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm font-semibold transition-colors"
                >
                  Book a test drive
                </button>
                <button
                  type="button"
                  onClick={() => navigate(`/inquiry/${vehicle.id}`)}
                  className="w-full py-2.5 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-600 text-sm font-semibold transition-colors"
                >
                  Send an inquiry
                </button>
                <button
                  type="button"
                  className="w-full py-2 rounded-lg text-xs text-blue-300 hover:text-blue-200"
                >
                  ♥ Add to favorites
                </button>
              </div>
            </div>

            <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-5 text-sm space-y-3">
              <h2 className="text-sm font-semibold text-gray-100">
                Vehicle overview
              </h2>
              <p className="text-gray-300">{vehicle.shortDescription}</p>
              <p className="text-gray-400 text-xs">
                Location: <span className="text-gray-200">{vehicle.location}</span>
              </p>
            </div>

            <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-5 text-sm space-y-3">
              <h3 className="text-sm font-semibold text-gray-100">
                Full description
              </h3>
              <p className="text-gray-300 leading-relaxed text-xs md:text-sm">
                {vehicle.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailsPage;
