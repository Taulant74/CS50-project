// src/pages/LoginPage.tsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

interface LoginResponse {
  token: string;
  userId: number;
  fullName: string;
  email: string;
  role: string;
}

interface LoginPageProps {
  setIsLoggedIn: (value: boolean) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const from = (location.state as { from?: string } | null)?.from || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      const msg = "Please fill in both email and password.";
      setError(msg);
      alert(msg); // ❗ alert on failure (empty fields)
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post<LoginResponse>(
        "https://localhost:7224/api/auth/login",
        { email, password }
      );

      const data = response.data;

      // Store auth in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId.toString());
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: data.userId,
          fullName: data.fullName,
          email: data.email,
          role: data.role,
        })
      );

      // Tell App that login is successful
      setIsLoggedIn(true);

      // Alert on success ✅
      alert("Login successful!");

      if (data.role === "Admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      console.error("Login error:", err);

      if (err.response?.status === 401) {
        const msg = "Invalid email or password.";
        setError(msg);
        alert("Login failed: Invalid email or password."); // ❗ alert on failure
      } else {
        const msg = "Something went wrong. Please try again.";
        setError(msg);
        alert("Login failed. Please try again."); // ❗ alert on failure
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-2">
            VIRTURIDE
          </p>
          <h1 className="text-3xl font-bold text-white">Welcome back</h1>
          <p className="text-xs text-gray-400 mt-1">
            Sign in to manage vehicles, test drives, and inquiries.
          </p>
        </div>

        <div className="bg-gray-950/90 border border-gray-800 rounded-3xl shadow-[0_20px_60px_rgba(15,23,42,0.9)] p-7">
          {error && (
            <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500 text-red-200 text-xs px-3 py-2">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full rounded-lg bg-gray-900 border border-gray-800 px-3 py-2 text-xs text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-500"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full rounded-lg bg-gray-900 border border-gray-800 px-3 py-2 text-xs text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-500 pr-10"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-2 flex items-center text-[11px] text-gray-500 hover:text-gray-200"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center items-center rounded-lg px-4 py-2.5 text-sm font-semibold transition
                ${
                  loading
                    ? "bg-blue-500/60 cursor-wait"
                    : "bg-blue-600 hover:bg-blue-500"
                } text-white`}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-4 text-[11px] text-gray-500 text-center">
            Use one of your existing VirtuRide accounts to sign in.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
