// src/pages/AdminDashboard.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import type { Vehicle } from "../types";

type TabKey = "users" | "vehicles" | "favorites" | "inquiries" | "testdrives";

interface AdminUser {
  id: number;
  fullName: string;
  email: string;
  role: string;
  createdAt: string;
}

interface AdminFavorite {
  userId: number;
  vehicleId: number;
  createdAt: string;
  user?: AdminUser;
  vehicle?: Vehicle;
}

interface AdminInquiry {
  id: number;
  vehicleId: number;
  userId?: number | null;
  name: string;
  email: string;
  message: string;
  status: string;
  createdAt: string;
  vehicle?: Vehicle;
  user?: AdminUser;
}

interface AdminTestDrive {
  id: number;
  vehicleId: number;
  userId: number;
  preferredDate: string;
  preferredTime: string;
  notes?: string | null;
  status: string;
  createdAt: string;
  vehicle?: Vehicle;
  user?: AdminUser;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<TabKey>("users");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [favorites, setFavorites] = useState<AdminFavorite[]>([]);
  const [inquiries, setInquiries] = useState<AdminInquiry[]>([]);
  const [testDrives, setTestDrives] = useState<AdminTestDrive[]>([]);

  // ---------- USERS form ----------
  const [userFormId, setUserFormId] = useState<number | null>(null);
  const [userFullName, setUserFullName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userRole, setUserRole] = useState<"User" | "Admin">("User");
  const [userSaving, setUserSaving] = useState(false);

  // ---------- VEHICLES form ----------
  const [vehicleFormId, setVehicleFormId] = useState<number | null>(null);
  const [vBranchId, setVBranchId] = useState<string>("");
  const [vBrand, setVBrand] = useState("");
  const [vModel, setVModel] = useState("");
  const [vYear, setVYear] = useState<string>("");
  const [vMileage, setVMileage] = useState<string>("");
  const [vPrice, setVPrice] = useState<string>("");
  const [vFuelType, setVFuelType] = useState("");
  const [vTransmission, setVTransmission] = useState("");
  const [vColor, setVColor] = useState("");
  const [vShortDesc, setVShortDesc] = useState("");
  const [vDesc, setVDesc] = useState("");
  const [vImageUrls, setVImageUrls] = useState("");
  const [vehicleSaving, setVehicleSaving] = useState(false);

  // ---------- FAVORITES form ----------
  const [favUserId, setFavUserId] = useState<string>("");
  const [favVehicleId, setFavVehicleId] = useState<string>("");
  const [favSaving, setFavSaving] = useState(false);

  // ---------- INQUIRIES form ----------
  const [inqFormId, setInqFormId] = useState<number | null>(null);
  const [inqVehicleId, setInqVehicleId] = useState<string>("");
  const [inqUserId, setInqUserId] = useState<string>("");
  const [inqName, setInqName] = useState("");
  const [inqEmail, setInqEmail] = useState("");
  const [inqMessage, setInqMessage] = useState("");
  const [inqStatus, setInqStatus] = useState("Pending");
  const [inqSaving, setInqSaving] = useState(false);

  // ---------- TEST DRIVES form ----------
  const [tdFormId, setTdFormId] = useState<number | null>(null);
  const [tdVehicleId, setTdVehicleId] = useState<string>("");
  const [tdUserId, setTdUserId] = useState<string>("");
  const [tdDate, setTdDate] = useState("");
  const [tdTime, setTdTime] = useState("10:00");
  const [tdNotes, setTdNotes] = useState("");
  const [tdStatus, setTdStatus] = useState("Pending");
  const [tdSaving, setTdSaving] = useState(false);

  const formatDate = (value?: string | null) => {
    if (!value) return "-";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleString();
  };

  // ---------- INITIAL LOAD ----------
  useEffect(() => {
    const loadAll = async () => {
      try {
        setLoading(true);
        setError(null);

        const [usersRes, vehiclesRes, favRes, inqRes, tdRes] =
          await Promise.all([
            api.get<AdminUser[]>("/users"),
            api.get<Vehicle[]>("/vehicles"),
            api.get<AdminFavorite[]>("/favorites"),
            api.get<AdminInquiry[]>("/inquiries"),
            api.get<AdminTestDrive[]>("/testdrives"),
          ]);

        setUsers(usersRes.data ?? []);
        setVehicles(vehiclesRes.data ?? []);
        setFavorites(favRes.data ?? []);
        setInquiries(inqRes.data ?? []);
        setTestDrives(tdRes.data ?? []);
      } catch (err) {
        console.error("Admin load failed:", err);
        setError("Failed to load admin data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, []);

  // ---------- REFRESH HELPERS ----------
  const refreshUsers = async () => {
    const res = await api.get<AdminUser[]>("/users");
    setUsers(res.data ?? []);
  };

  const refreshVehicles = async () => {
    const res = await api.get<Vehicle[]>("/vehicles");
    setVehicles(res.data ?? []);
  };

  const refreshFavorites = async () => {
    const res = await api.get<AdminFavorite[]>("/favorites");
    setFavorites(res.data ?? []);
  };

  const refreshInquiries = async () => {
    const res = await api.get<AdminInquiry[]>("/inquiries");
    setInquiries(res.data ?? []);
  };

  const refreshTestDrives = async () => {
    const res = await api.get<AdminTestDrive[]>("/testdrives");
    setTestDrives(res.data ?? []);
  };

  // ---------- USERS CRUD ----------
  const resetUserForm = () => {
    setUserFormId(null);
    setUserFullName("");
    setUserEmail("");
    setUserPassword("");
    setUserRole("User");
  };

  const handleUserSave = async () => {
    if (!userFullName || !userEmail || (!userFormId && !userPassword)) {
      alert("Fill in full name, email and password (for new users).");
      return;
    }

    try {
      setUserSaving(true);

      if (userFormId) {
        // UPDATE: only name + role based on your UsersController
        await api.put(`/users/${userFormId}`, {
          fullName: userFullName,
          role: userRole,
        });
      } else {
        // CREATE
        await api.post("/users", {
          fullName: userFullName,
          email: userEmail,
          password: userPassword,
          role: userRole,
        });
      }

      await refreshUsers();
      resetUserForm();
    } catch (err) {
      console.error("User save failed:", err);
      alert("Failed to save user.");
    } finally {
      setUserSaving(false);
    }
  };

  const handleUserEdit = (u: AdminUser) => {
    setUserFormId(u.id);
    setUserFullName(u.fullName);
    setUserEmail(u.email);
    setUserPassword("");
    setUserRole((u.role as "User") || "User");
  };

  const handleUserDelete = async (id: number) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await api.delete(`/users/${id}`);
      await refreshUsers();
    } catch (err) {
      console.error("Delete user failed:", err);
      alert("Failed to delete user.");
    }
  };

  // ---------- VEHICLES CRUD ----------
  const resetVehicleForm = () => {
    setVehicleFormId(null);
    setVBranchId("");
    setVBrand("");
    setVModel("");
    setVYear("");
    setVMileage("");
    setVPrice("");
    setVFuelType("");
    setVTransmission("");
    setVColor("");
    setVShortDesc("");
    setVDesc("");
    setVImageUrls("");
  };

  const handleVehicleSave = async () => {
    if (!vBrand || !vModel || !vYear || !vPrice || !vFuelType) {
      alert("Fill at least brand, model, year, price and fuel type.");
      return;
    }

    const payload = {
      branchId: vBranchId ? Number(vBranchId) : 1, // default 1 if empty
      brand: vBrand,
      model: vModel,
      year: Number(vYear),
      mileage: vMileage ? Number(vMileage) : 0,
      price: Number(vPrice),
      fuelType: vFuelType,
      transmission: vTransmission || null,
      color: vColor || null,
      shortDescription: vShortDesc || null,
      description: vDesc || null,
      imageUrls: vImageUrls || null,
    };

    try {
      setVehicleSaving(true);

      if (vehicleFormId) {
        await api.put(`/vehicles/${vehicleFormId}`, payload);
      } else {
        await api.post("/vehicles", payload);
      }

      await refreshVehicles();
      resetVehicleForm();
    } catch (err) {
      console.error("Vehicle save failed:", err);
      alert("Failed to save vehicle.");
    } finally {
      setVehicleSaving(false);
    }
  };

  const handleVehicleEdit = (v: Vehicle) => {
    setVehicleFormId(v.id);
    setVBranchId(v.branchId ? String(v.branchId) : "");
    setVBrand(v.brand);
    setVModel(v.model);
    setVYear(String(v.year));
    setVMileage(String(v.mileage));
    setVPrice(String(v.price));
    setVFuelType(v.fuelType);
    setVTransmission(v.transmission ?? "");
    setVColor(v.color ?? "");
    setVShortDesc(v.shortDescription ?? "");
    setVDesc(v.description ?? "");
    setVImageUrls(v.imageUrls ?? "");
  };

  const handleVehicleDelete = async (id: number) => {
    if (!window.confirm("Delete this vehicle?")) return;
    try {
      await api.delete(`/vehicles/${id}`);
      await refreshVehicles();
    } catch (err) {
      console.error("Delete vehicle failed:", err);
      alert("Failed to delete vehicle.");
    }
  };

  // ---------- FAVORITES CRUD ----------
  const resetFavoriteForm = () => {
    setFavUserId("");
    setFavVehicleId("");
  };

  const handleFavoriteCreate = async () => {
    if (!favUserId || !favVehicleId) {
      alert("Fill both userId and vehicleId.");
      return;
    }

    try {
      setFavSaving(true);
      await api.post("/favorites", {
        userId: Number(favUserId),
        vehicleId: Number(favVehicleId),
      });

      await refreshFavorites();
      resetFavoriteForm();
    } catch (err: any) {
      console.error("Favorite create failed:", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        "Failed to create favorite.";
      alert(typeof msg === "string" ? msg : "Failed to create favorite.");
    } finally {
      setFavSaving(false);
    }
  };

  const handleFavoriteDelete = async (userId: number, vehicleId: number) => {
    if (!window.confirm("Remove this favorite?")) return;
    try {
      await api.delete("/favorites", {
        params: { userId, vehicleId },
      });
      await refreshFavorites();
    } catch (err) {
      console.error("Favorite delete failed:", err);
      alert("Failed to delete favorite.");
    }
  };

  // ---------- INQUIRIES CRUD ----------
  const resetInquiryForm = () => {
    setInqFormId(null);
    setInqVehicleId("");
    setInqUserId("");
    setInqName("");
    setInqEmail("");
    setInqMessage("");
    setInqStatus("Pending");
  };

  const handleInquirySave = async () => {
    if (!inqVehicleId || !inqName || !inqEmail || !inqMessage) {
      alert("Fill vehicleId, name, email and message.");
      return;
    }

    try {
      setInqSaving(true);

      if (inqFormId) {
        // Only status can be updated via API, so treat "edit" as status change.
        await api.patch(`/inquiries/${inqFormId}/status`, {
          status: inqStatus,
        });
      } else {
        await api.post("/inquiries", {
          vehicleId: Number(inqVehicleId),
          userId: inqUserId ? Number(inqUserId) : null,
          name: inqName,
          email: inqEmail,
          message: inqMessage,
        });
      }

      await refreshInquiries();
      resetInquiryForm();
    } catch (err) {
      console.error("Inquiry save failed:", err);
      alert("Failed to save inquiry.");
    } finally {
      setInqSaving(false);
    }
  };

  const handleInquiryEdit = (i: AdminInquiry) => {
    setInqFormId(i.id);
    setInqVehicleId(String(i.vehicleId));
    setInqUserId(i.userId ? String(i.userId) : "");
    setInqName(i.name);
    setInqEmail(i.email);
    setInqMessage(i.message);
    setInqStatus(i.status);
  };

  const handleInquiryStatusChangeInline = async (id: number, status: string) => {
    try {
      await api.patch(`/inquiries/${id}/status`, { status });
      setInquiries((prev) =>
        prev.map((i) => (i.id === id ? { ...i, status } : i))
      );
    } catch (err) {
      console.error("Update inquiry status failed:", err);
      alert("Failed to update status.");
    }
  };

  const handleInquiryDelete = async (id: number) => {
    if (!window.confirm("Delete this inquiry?")) return;
    try {
      await api.delete(`/inquiries/${id}`);
      await refreshInquiries();
    } catch (err) {
      console.error("Delete inquiry failed:", err);
      alert("Failed to delete inquiry.");
    }
  };

  // ---------- TEST DRIVES CRUD ----------
  const resetTestDriveForm = () => {
    setTdFormId(null);
    setTdVehicleId("");
    setTdUserId("");
    setTdDate("");
    setTdTime("10:00");
    setTdNotes("");
    setTdStatus("Pending");
  };

  const handleTestDriveSave = async () => {
    if (!tdVehicleId || !tdUserId || !tdDate || !tdTime) {
      alert("Fill vehicleId, userId, date and time.");
      return;
    }

    try {
      setTdSaving(true);

      if (tdFormId) {
        // Only status can be updated
        await api.patch(`/testdrives/${tdFormId}/status`, {
          status: tdStatus,
        });
      } else {
        await api.post("/testdrives", {
          vehicleId: Number(tdVehicleId),
          userId: Number(tdUserId),
          preferredDate: tdDate,
          preferredTime: tdTime,
          notes: tdNotes || null,
        });
      }

      await refreshTestDrives();
      resetTestDriveForm();
    } catch (err) {
      console.error("Test drive save failed:", err);
      alert("Failed to save test drive.");
    } finally {
      setTdSaving(false);
    }
  };

  const handleTestDriveEdit = (td: AdminTestDrive) => {
    setTdFormId(td.id);
    setTdVehicleId(String(td.vehicleId));
    setTdUserId(String(td.userId));
    setTdDate(td.preferredDate.split("T")[0] ?? "");
    setTdTime(td.preferredTime?.substring(0, 5) ?? "10:00");
    setTdNotes(td.notes ?? "");
    setTdStatus(td.status);
  };

  const handleTestDriveStatusChangeInline = async (
    id: number,
    status: string
  ) => {
    try {
      await api.patch(`/testdrives/${id}/status`, { status });
      setTestDrives((prev) =>
        prev.map((td) => (td.id === id ? { ...td, status } : td))
      );
    } catch (err) {
      console.error("Update test drive status failed:", err);
      alert("Failed to update status.");
    }
  };

  const handleTestDriveDelete = async (id: number) => {
    if (!window.confirm("Delete this test drive?")) return;
    try {
      await api.delete(`/testdrives/${id}`);
      await refreshTestDrives();
    } catch (err) {
      console.error("Delete test drive failed:", err);
      alert("Failed to delete test drive.");
    }
  };

  // ---------- UI ----------
  const cardClass =
    "rounded-2xl bg-gray-900/80 border border-gray-800 shadow-xl p-4";

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-gray-400">Loading admin data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-lg font-semibold text-red-400">
            Admin dashboard error
          </h1>
          <p className="text-sm text-gray-300">{error}</p>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs text-gray-100"
          >
            ← Back to site
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-950 text-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 p-5 flex flex-col">
        <div className="mb-8">
          <p className="text-[11px] uppercase tracking-[0.3em] text-blue-400 mb-1">
            VirtuRide
          </p>
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <p className="text-[11px] text-gray-400 mt-1">
            Manage users, vehicles & requests.
          </p>
        </div>

        <nav className="space-y-2 text-sm flex-1">
          {([
            ["users", "Users"],
            ["vehicles", "Vehicles"],
            ["favorites", "Favorites"],
            ["inquiries", "Inquiries"],
            ["testdrives", "Test Drives"],
          ] as [TabKey, string][]).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className={`w-full text-left px-3 py-2 rounded-lg transition ${
                activeTab === key
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 hover:bg-gray-700 text-gray-200"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => navigate("/")}
          className="mt-6 text-xs text-gray-400 hover:text-gray-200 text-left"
        >
          ← Back to autosallon
        </button>
      </aside>

      {/* Content */}
      <main className="flex-1 px-6 py-6 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 overflow-x-auto">
        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6 text-xs">
          <div className={cardClass}>
            <p className="text-[10px] text-gray-400 uppercase">Users</p>
            <p className="text-xl font-semibold text-blue-400">
              {users.length}
            </p>
          </div>
          <div className={cardClass}>
            <p className="text-[10px] text-gray-400 uppercase">Vehicles</p>
            <p className="text-xl font-semibold text-emerald-400">
              {vehicles.length}
            </p>
          </div>
          <div className={cardClass}>
            <p className="text-[10px] text-gray-400 uppercase">
              Test Drives
            </p>
            <p className="text-xl font-semibold text-indigo-400">
              {testDrives.length}
            </p>
          </div>
          <div className={cardClass}>
            <p className="text-[10px] text-gray-400 uppercase">Inquiries</p>
            <p className="text-xl font-semibold text-amber-400">
              {inquiries.length}
            </p>
          </div>
          <div className={cardClass}>
            <p className="text-[10px] text-gray-400 uppercase">Favorites</p>
            <p className="text-xl font-semibold text-pink-400">
              {favorites.length}
            </p>
          </div>
        </div>

        {/* TAB CONTENT */}
        <div className="rounded-2xl bg-gray-900/80 border border-gray-800 shadow-xl p-4 text-xs overflow-x-auto">
          {/* USERS TAB */}
          {activeTab === "users" && (
            <div>
              <h2 className="text-sm font-semibold text-white mb-3">Users</h2>

              {/* Form */}
              <div className="mb-4 bg-gray-900 border border-gray-800 rounded-xl p-3">
                <h3 className="text-xs font-semibold mb-2">
                  {userFormId ? "Edit user" : "Create user"}
                </h3>
                <div className="grid gap-2 md:grid-cols-4">
                  <input
                    className="rounded bg-gray-800 border border-gray-700 px-2 py-1 text-[11px]"
                    placeholder="Full name"
                    value={userFullName}
                    onChange={(e) => setUserFullName(e.target.value)}
                  />
                  <input
                    className="rounded bg-gray-800 border border-gray-700 px-2 py-1 text-[11px]"
                    placeholder="Email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    disabled={!!userFormId} // backend doesn't support updating email
                  />
                  <input
                    className="rounded bg-gray-800 border border-gray-700 px-2 py-1 text-[11px]"
                    placeholder={
                      userFormId ? "Password (not used on edit)" : "Password"
                    }
                    type="password"
                    value={userPassword}
                    onChange={(e) => setUserPassword(e.target.value)}
                    disabled={!!userFormId}
                  />
                  <select
                    className="rounded bg-gray-800 border border-gray-700 px-2 py-1 text-[11px]"
                    value={userRole}
                    onChange={(e) =>
                      setUserRole(e.target.value as "User" | "Admin")
                    }
                  >
                    <option value="User">User</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    onClick={handleUserSave}
                    disabled={userSaving}
                    className={`px-3 py-1.5 rounded text-[11px] font-semibold ${
                      userSaving
                        ? "bg-blue-500/60 cursor-wait"
                        : "bg-blue-600 hover:bg-blue-500"
                    } text-white`}
                  >
                    {userSaving
                      ? userFormId
                        ? "Updating..."
                        : "Creating..."
                      : userFormId
                      ? "Update user"
                      : "Create user"}
                  </button>
                  {userFormId && (
                    <button
                      type="button"
                      onClick={resetUserForm}
                      className="px-3 py-1.5 rounded text-[11px] bg-gray-700 hover:bg-gray-600"
                    >
                      Cancel edit
                    </button>
                  )}
                </div>
              </div>

              {/* Table */}
              <table className="min-w-full text-left border-collapse">
                <thead className="bg-gray-800/80 text-[11px] text-gray-400">
                  <tr>
                    <th className="px-3 py-2">Name</th>
                    <th className="px-3 py-2">Email</th>
                    <th className="px-3 py-2">Role</th>
                    <th className="px-3 py-2">Created</th>
                    <th className="px-3 py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr
                      key={u.id}
                      className="border-t border-gray-800/80 align-top"
                    >
                      <td className="px-3 py-2 text-gray-100">
                        {u.fullName}
                      </td>
                      <td className="px-3 py-2 text-gray-300">{u.email}</td>
                      <td className="px-3 py-2">
                        <span
                          className={
                            u.role === "Admin"
                              ? "px-2 py-1 rounded-full bg-purple-600/30 text-purple-300 text-[11px]"
                              : "px-2 py-1 rounded-full bg-gray-700/60 text-gray-200 text-[11px]"
                          }
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-gray-300">
                        {formatDate(u.createdAt)}
                      </td>
                      <td className="px-3 py-2 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => handleUserEdit(u)}
                          className="px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 text-[11px]"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUserDelete(u.id)}
                          className="px-2 py-1 rounded bg-red-600/80 hover:bg-red-500 text-[11px]"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-3 py-4 text-center text-gray-400"
                      >
                        No users yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* VEHICLES TAB */}
          {activeTab === "vehicles" && (
            <div>
              <h2 className="text-sm font-semibold text-white mb-3">
                Vehicles
              </h2>

              {/* Form */}
              <div className="mb-4 bg-gray-900 border border-gray-800 rounded-xl p-3">
                <h3 className="text-xs font-semibold mb-2">
                  {vehicleFormId ? "Edit vehicle" : "Create vehicle"}
                </h3>
                <div className="grid gap-2 md:grid-cols-4">
                  <input
                    className="rounded bg-gray-800 border border-gray-700 px-2 py-1 text-[11px]"
                    placeholder="Branch ID"
                    value={vBranchId}
                    onChange={(e) => setVBranchId(e.target.value)}
                  />
                  <input
                    className="rounded bg-gray-800 border border-gray-700 px-2 py-1 text-[11px]"
                    placeholder="Brand"
                    value={vBrand}
                    onChange={(e) => setVBrand(e.target.value)}
                  />
                  <input
                    className="rounded bg-gray-800 border border-gray-700 px-2 py-1 text-[11px]"
                    placeholder="Model"
                    value={vModel}
                    onChange={(e) => setVModel(e.target.value)}
                  />
                  <input
                    className="rounded bg-gray-800 border border-gray-700 px-2 py-1 text-[11px]"
                    placeholder="Year"
                    value={vYear}
                    onChange={(e) => setVYear(e.target.value)}
                  />
                  <input
                    className="rounded bg-gray-800 border border-gray-700 px-2 py-1 text-[11px]"
                    placeholder="Mileage (km)"
                    value={vMileage}
                    onChange={(e) => setVMileage(e.target.value)}
                  />
                  <input
                    className="rounded bg-gray-800 border border-gray-700 px-2 py-1 text-[11px]"
                    placeholder="Price (€)"
                    value={vPrice}
                    onChange={(e) => setVPrice(e.target.value)}
                  />
                  <input
                    className="rounded bg-gray-800 border border-gray-700 px-2 py-1 text-[11px]"
                    placeholder="Fuel type"
                    value={vFuelType}
                    onChange={(e) => setVFuelType(e.target.value)}
                  />
                  <input
                    className="rounded bg-gray-800 border border-gray-700 px-2 py-1 text-[11px]"
                    placeholder="Transmission"
                    value={vTransmission}
                    onChange={(e) => setVTransmission(e.target.value)}
                  />
                  <input
                    className="rounded bg-gray-800 border border-gray-700 px-2 py-1 text-[11px]"
                    placeholder="Color"
                    value={vColor}
                    onChange={(e) => setVColor(e.target.value)}
                  />
                  <input
                    className="rounded bg-gray-800 border border-gray-700 px-2 py-1 text-[11px]"
                    placeholder="Image URLs (comma separated)"
                    value={vImageUrls}
                    onChange={(e) => setVImageUrls(e.target.value)}
                  />
                  <textarea
                    className="rounded bg-gray-800 border border-gray-700 px-2 py-1 text-[11px] md:col-span-2"
                    placeholder="Short description"
                    value={vShortDesc}
                    onChange={(e) => setVShortDesc(e.target.value)}
                  />
                  <textarea
                    className="rounded bg-gray-800 border border-gray-700 px-2 py-1 text-[11px] md:col-span-2"
                    placeholder="Full description"
                    value={vDesc}
                    onChange={(e) => setVDesc(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    onClick={handleVehicleSave}
                    disabled={vehicleSaving}
                    className={`px-3 py-1.5 rounded text-[11px] font-semibold ${
                      vehicleSaving
                        ? "bg-blue-500/60 cursor-wait"
                        : "bg-blue-600 hover:bg-blue-500"
                    } text-white`}
                  >
                    {vehicleSaving
                      ? vehicleFormId
                        ? "Updating..."
                        : "Creating..."
                      : vehicleFormId
                      ? "Update vehicle"
                      : "Create vehicle"}
                  </button>
                  {vehicleFormId && (
                    <button
                      type="button"
                      onClick={resetVehicleForm}
                      className="px-3 py-1.5 rounded text-[11px] bg-gray-700 hover:bg-gray-600"
                    >
                      Cancel edit
                    </button>
                  )}
                </div>
              </div>

              {/* Table */}
              <table className="min-w-full text-left border-collapse">
                <thead className="bg-gray-800/80 text-[11px] text-gray-400">
                  <tr>
                    <th className="px-3 py-2">Vehicle</th>
                    <th className="px-3 py-2">Price</th>
                    <th className="px-3 py-2">Specs</th>
                    <th className="px-3 py-2">Created</th>
                    <th className="px-3 py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map((v) => (
                    <tr
                      key={v.id}
                      className="border-t border-gray-800/80 align-top"
                    >
                      <td className="px-3 py-2">
                        <div className="text-gray-100 font-medium">
                          {v.brand} {v.model}
                        </div>
                        <div className="text-[11px] text-gray-400">
                          {v.year} • {v.color ?? "—"}
                        </div>
                      </td>
                      <td className="px-3 py-2 text-gray-300">
                        € {v.price.toLocaleString("de-DE")}
                      </td>
                      <td className="px-3 py-2 text-gray-300">
                        <div className="text-[11px]">
                          {v.mileage.toLocaleString("de-DE")} km
                        </div>
                        <div className="text-[11px] text-gray-400">
                          {v.fuelType} • {v.transmission}
                        </div>
                      </td>
                      <td className="px-3 py-2 text-gray-300">
                        {formatDate((v as any).createdAt)}
                      </td>
                      <td className="px-3 py-2 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => handleVehicleEdit(v)}
                          className="px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 text-[11px]"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleVehicleDelete(v.id)}
                          className="px-2 py-1 rounded bg-red-600/80 hover:bg-red-500 text-[11px]"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {vehicles.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-3 py-4 text-center text-gray-400"
                      >
                        No vehicles yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* FAVORITES TAB */}
          {activeTab === "favorites" && (
            <div>
              <h2 className="text-sm font-semibold text-white mb-3">
                Favorites
              </h2>

              {/* Create form */}
              <div className="mb-4 bg-gray-900 border border-gray-800 rounded-xl p-3">
                <h3 className="text-xs font-semibold mb-2">
                  Create favorite (user ↔ vehicle)
                </h3>
                <div className="grid gap-2 md:grid-cols-3">
                  <input
                    className="rounded bg-gray-800 border border-gray-700 px-2 py-1 text-[11px]"
                    placeholder="User ID"
                    value={favUserId}
                    onChange={(e) => setFavUserId(e.target.value)}
                  />
                  <input
                    className="rounded bg-gray-800 border border-gray-700 px-2 py-1 text-[11px]"
                    placeholder="Vehicle ID"
                    value={favVehicleId}
                    onChange={(e) => setFavVehicleId(e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleFavoriteCreate}
                  disabled={favSaving}
                  className={`mt-2 px-3 py-1.5 rounded text-[11px] font-semibold ${
                    favSaving
                      ? "bg-blue-500/60 cursor-wait"
                      : "bg-blue-600 hover:bg-blue-500"
                  } text-white`}
                >
                  {favSaving ? "Creating..." : "Create favorite"}
                </button>
              </div>

              {/* Table */}
              <table className="min-w-full text-left border-collapse">
                <thead className="bg-gray-800/80 text-[11px] text-gray-400">
                  <tr>
                    <th className="px-3 py-2">User</th>
                    <th className="px-3 py-2">Vehicle</th>
                    <th className="px-3 py-2">Created</th>
                    <th className="px-3 py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {favorites.map((f) => (
                    <tr
                      key={`${f.userId}-${f.vehicleId}-${f.createdAt}`}
                      className="border-t border-gray-800/80 align-top"
                    >
                      <td className="px-3 py-2">
                        <div className="text-gray-100 font-medium">
                          {f.user?.fullName ?? `User #${f.userId}`}
                        </div>
                        <div className="text-[11px] text-gray-400">
                          {f.user?.email}
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <div className="text-gray-100 font-medium">
                          {f.vehicle
                            ? `${f.vehicle.brand} ${f.vehicle.model}`
                            : `Vehicle #${f.vehicleId}`}
                        </div>
                        {f.vehicle && (
                          <div className="text-[11px] text-gray-400">
                            € {f.vehicle.price.toLocaleString("de-DE")} •{" "}
                            {f.vehicle.year}
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-2 text-gray-300">
                        {formatDate(f.createdAt)}
                      </td>
                      <td className="px-3 py-2 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            handleFavoriteDelete(f.userId, f.vehicleId)
                          }
                          className="px-2 py-1 rounded bg-red-600/80 hover:bg-red-500 text-[11px]"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {favorites.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-3 py-4 text-center text-gray-400"
                      >
                        No favorites yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* INQUIRIES TAB */}
          {activeTab === "inquiries" && (
            <div>
              <h2 className="text-sm font-semibold text-white mb-3">
                Inquiries
              </h2>

              {/* Form */}
              <div className="mb-4 bg-gray-900 border border-gray-800 rounded-xl p-3">
                <h3 className="text-xs font-semibold mb-2">
                  {inqFormId ? "Edit inquiry (status)" : "Create inquiry"}
                </h3>
                <div className="grid gap-2 md:grid-cols-4">
                  <input
                    className="rounded bg-gray-800 border border-gray-700 px-2 py-1 text-[11px]"
                    placeholder="Vehicle ID"
                    value={inqVehicleId}
                    onChange={(e) => setInqVehicleId(e.target.value)}
                    disabled={!!inqFormId}
                  />
                  <input
                    className="rounded bg-gray-800 border border-gray-700 px-2 py-1 text-[11px]"
                    placeholder="User ID (optional)"
                    value={inqUserId}
                    onChange={(e) => setInqUserId(e.target.value)}
                    disabled={!!inqFormId}
                  />
                  <input
                    className="rounded bg-gray-800 border border-gray-700 px-2 py-1 text-[11px]"
                    placeholder="Name"
                    value={inqName}
                    onChange={(e) => setInqName(e.target.value)}
                    disabled={!!inqFormId}
                  />
                  <input
                    className="rounded bg-gray-800 border border-gray-700 px-2 py-1 text-[11px]"
                    placeholder="Email"
                    value={inqEmail}
                    onChange={(e) => setInqEmail(e.target.value)}
                    disabled={!!inqFormId}
                  />
                  <textarea
                    className="rounded bg-gray-800 border border-gray-700 px-2 py-1 text-[11px] md:col-span-3"
                    placeholder="Message"
                    value={inqMessage}
                    onChange={(e) => setInqMessage(e.target.value)}
                    disabled={!!inqFormId}
                  />
                  <div>
                    <label className="text-[11px] text-gray-400 block mb-1">
                      Status
                    </label>
                    <select
                      className="rounded bg-gray-800 border border-gray-700 px-2 py-1 text-[11px]"
                      value={inqStatus}
                      onChange={(e) => setInqStatus(e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="InProgress">In progress</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    onClick={handleInquirySave}
                    disabled={inqSaving}
                    className={`px-3 py-1.5 rounded text-[11px] font-semibold ${
                      inqSaving
                        ? "bg-blue-500/60 cursor-wait"
                        : "bg-blue-600 hover:bg-blue-500"
                    } text-white`}
                  >
                    {inqSaving
                      ? inqFormId
                        ? "Updating..."
                        : "Creating..."
                      : inqFormId
                      ? "Update inquiry status"
                      : "Create inquiry"}
                  </button>
                  {inqFormId && (
                    <button
                      type="button"
                      onClick={resetInquiryForm}
                      className="px-3 py-1.5 rounded text-[11px] bg-gray-700 hover:bg-gray-600"
                    >
                      Cancel edit
                    </button>
                  )}
                </div>
              </div>

              {/* Table */}
              <table className="min-w-full text-left border-collapse">
                <thead className="bg-gray-800/80 text-[11px] text-gray-400">
                  <tr>
                    <th className="px-3 py-2">Customer</th>
                    <th className="px-3 py-2">Vehicle</th>
                    <th className="px-3 py-2">Message</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Created</th>
                    <th className="px-3 py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inquiries.map((i) => (
                    <tr
                      key={i.id}
                      className="border-t border-gray-800/80 align-top"
                    >
                      <td className="px-3 py-2">
                        <div className="text-gray-100 font-medium">
                          {i.name}
                        </div>
                        <div className="text-[11px] text-gray-400">
                          {i.email}
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <div className="text-gray-100 font-medium">
                          {i.vehicle
                            ? `${i.vehicle.brand} ${i.vehicle.model}`
                            : `Vehicle #${i.vehicleId}`}
                        </div>
                        {i.vehicle && (
                          <div className="text-[11px] text-gray-400">
                            € {i.vehicle.price.toLocaleString("de-DE")} •{" "}
                            {i.vehicle.year}
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-2 text-gray-300 max-w-xs">
                        <p className="line-clamp-3">{i.message}</p>
                      </td>
                      <td className="px-3 py-2">
                        <select
                          className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-[11px]"
                          value={i.status}
                          onChange={(e) =>
                            handleInquiryStatusChangeInline(
                              i.id,
                              e.target.value
                            )
                          }
                        >
                          <option value="Pending">Pending</option>
                          <option value="InProgress">In progress</option>
                          <option value="Resolved">Resolved</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </td>
                      <td className="px-3 py-2 text-gray-300">
                        {formatDate(i.createdAt)}
                      </td>
                      <td className="px-3 py-2 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => handleInquiryEdit(i)}
                          className="px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 text-[11px]"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInquiryDelete(i.id)}
                          className="px-2 py-1 rounded bg-red-600/80 hover:bg-red-500 text-[11px]"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {inquiries.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-3 py-4 text-center text-gray-400"
                      >
                        No inquiries yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* TEST DRIVES TAB */}
          {activeTab === "testdrives" && (
            <div>
              <h2 className="text-sm font-semibold text-white mb-3">
                Test drive requests
              </h2>

              {/* Form */}
              <div className="mb-4 bg-gray-900 border border-gray-800 rounded-xl p-3">
                <h3 className="text-xs font-semibold mb-2">
                  {tdFormId ? "Edit test drive (status)" : "Create test drive"}
                </h3>
                <div className="grid gap-2 md:grid-cols-4">
                  <input
                    className="rounded bg-gray-800 border border-gray-700 px-2 py-1 text-[11px]"
                    placeholder="Vehicle ID"
                    value={tdVehicleId}
                    onChange={(e) => setTdVehicleId(e.target.value)}
                    disabled={!!tdFormId}
                  />
                  <input
                    className="rounded bg-gray-800 border border-gray-700 px-2 py-1 text-[11px]"
                    placeholder="User ID"
                    value={tdUserId}
                    onChange={(e) => setTdUserId(e.target.value)}
                    disabled={!!tdFormId}
                  />
                  <input
                    type="date"
                    className="rounded bg-gray-800 border border-gray-700 px-2 py-1 text-[11px]"
                    value={tdDate}
                    onChange={(e) => setTdDate(e.target.value)}
                    disabled={!!tdFormId}
                  />
                  <input
                    type="time"
                    className="rounded bg-gray-800 border border-gray-700 px-2 py-1 text-[11px]"
                    value={tdTime}
                    onChange={(e) => setTdTime(e.target.value)}
                    disabled={!!tdFormId}
                  />
                  <textarea
                    className="rounded bg-gray-800 border border-gray-700 px-2 py-1 text-[11px] md:col-span-3"
                    placeholder="Notes"
                    value={tdNotes}
                    onChange={(e) => setTdNotes(e.target.value)}
                    disabled={!!tdFormId}
                  />
                  <div>
                    <label className="text-[11px] text-gray-400 block mb-1">
                      Status
                    </label>
                    <select
                      className="rounded bg-gray-800 border border-gray-700 px-2 py-1 text-[11px]"
                      value={tdStatus}
                      onChange={(e) => setTdStatus(e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    onClick={handleTestDriveSave}
                    disabled={tdSaving}
                    className={`px-3 py-1.5 rounded text-[11px] font-semibold ${
                      tdSaving
                        ? "bg-blue-500/60 cursor-wait"
                        : "bg-blue-600 hover:bg-blue-500"
                    } text-white`}
                  >
                    {tdSaving
                      ? tdFormId
                        ? "Updating..."
                        : "Creating..."
                      : tdFormId
                      ? "Update test drive status"
                      : "Create test drive"}
                  </button>
                  {tdFormId && (
                    <button
                      type="button"
                      onClick={resetTestDriveForm}
                      className="px-3 py-1.5 rounded text-[11px] bg-gray-700 hover:bg-gray-600"
                    >
                      Cancel edit
                    </button>
                  )}
                </div>
              </div>

              {/* Table */}
              <table className="min-w-full text-left border-collapse">
                <thead className="bg-gray-800/80 text-[11px] text-gray-400">
                  <tr>
                    <th className="px-3 py-2">Customer</th>
                    <th className="px-3 py-2">Vehicle</th>
                    <th className="px-3 py-2">Preferred</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Created</th>
                    <th className="px-3 py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {testDrives.map((td) => (
                    <tr
                      key={td.id}
                      className="border-t border-gray-800/80 align-top"
                    >
                      <td className="px-3 py-2">
                        <div className="text-gray-100 font-medium">
                          {td.user?.fullName ?? `User #${td.userId}`}
                        </div>
                        <div className="text-[11px] text-gray-400">
                          {td.user?.email}
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <div className="text-gray-100 font-medium">
                          {td.vehicle
                            ? `${td.vehicle.brand} ${td.vehicle.model}`
                            : `Vehicle #${td.vehicleId}`}
                        </div>
                        {td.vehicle && (
                          <div className="text-[11px] text-gray-400">
                            € {td.vehicle.price.toLocaleString("de-DE")} •{" "}
                            {td.vehicle.year}
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-2 text-gray-300">
                        <div>{formatDate(td.preferredDate)}</div>
                        <div className="text-[11px] text-gray-400">
                          {td.preferredTime}
                        </div>
                        {td.notes && (
                          <div className="text-[11px] text-gray-400 mt-1 line-clamp-2">
                            {td.notes}
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-2">
                        <select
                          className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-[11px]"
                          value={td.status}
                          onChange={(e) =>
                            handleTestDriveStatusChangeInline(
                              td.id,
                              e.target.value
                            )
                          }
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-3 py-2 text-gray-300">
                        {formatDate(td.createdAt)}
                      </td>
                      <td className="px-3 py-2 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => handleTestDriveEdit(td)}
                          className="px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 text-[11px]"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleTestDriveDelete(td.id)}
                          className="px-2 py-1 rounded bg-red-600/80 hover:bg-red-500 text-[11px]"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {testDrives.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-3 py-4 text-center text-gray-400"
                      >
                        No test drive requests yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
