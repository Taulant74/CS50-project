// src/pages/AdminDashboard.tsx
import React from "react";

const AdminDashboard: React.FC = () => {
  // Later: fetch counts from API: /api/vehicles, /api/users, etc.
  const stats = {
    vehicles: 32,
    testDrives: 5,
    inquiries: 12,
    users: 4,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-1">
          Admin dashboard
        </h1>
        <p className="text-xs text-gray-400 mb-6">
          Overview of VirtuRide activity. In CS50 demo, this proves backend +
          frontend integration.
        </p>

        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-4 shadow-lg">
            <p className="text-[11px] text-gray-400 mb-1">Vehicles</p>
            <p className="text-2xl font-bold text-blue-400">
              {stats.vehicles}
            </p>
          </div>
          <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-4 shadow-lg">
            <p className="text-[11px] text-gray-400 mb-1">Test drives</p>
            <p className="text-2xl font-bold text-emerald-400">
              {stats.testDrives}
            </p>
          </div>
          <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-4 shadow-lg">
            <p className="text-[11px] text-gray-400 mb-1">Inquiries</p>
            <p className="text-2xl font-bold text-amber-400">
              {stats.inquiries}
            </p>
          </div>
          <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-4 shadow-lg">
            <p className="text-[11px] text-gray-400 mb-1">Users</p>
            <p className="text-2xl font-bold text-fuchsia-400">
              {stats.users}
            </p>
          </div>
        </div>

        <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 text-xs text-gray-300 space-y-2">
          <p className="font-semibold text-gray-100">
            Next steps you can showcase in CS50:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>List all vehicles with edit/delete actions.</li>
            <li>Show pending test drive requests with status controls.</li>
            <li>Show inquiries with ability to mark as answered.</li>
            <li>Basic user management (view, roles).</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
