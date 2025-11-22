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

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // If user came from a protected page, you can redirect them back there
  const from = (location.state as { from?: string } | null)?.from || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post<LoginResponse>(
        "https://localhost:7072/api/auth/login",
        {
          email,
          password,
        }
      );

      const data = response.data;

      // Save auth data (simple version)
      localStorage.setItem("vr_token", data.token);
      localStorage.setItem(
        "vr_user",
        JSON.stringify({
          id: data.userId,
          fullName: data.fullName,
          email: data.email,
          role: data.role,
        })
      );

      // Redirect after login
      if (data.role === "Admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.response?.status === 401) {
        setError("Invalid email or password.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="w-full max-w-md bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700 p-8">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-white mb-1">VirtuRide</h1>
          <p className="text-gray-400 text-sm">
            Sign in to manage your auto salon experience
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500 text-red-200 text-sm px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full rounded-lg bg-gray-800/80 border border-gray-700 px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-500"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full rounded-lg bg-gray-800/80 border border-gray-700 px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-500 pr-10"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-2 flex items-center text-xs text-gray-400 hover:text-gray-200"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center items-center rounded-lg px-4 py-2 text-sm font-medium text-white transition
              ${
                loading
                  ? "bg-blue-500/60 cursor-wait"
                  : "bg-blue-600 hover:bg-blue-500"
              }`}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            For demo, you can hardcode a user like: <br />
            <span className="font-mono text-gray-300">
              admin@virturide.com / admin123
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
