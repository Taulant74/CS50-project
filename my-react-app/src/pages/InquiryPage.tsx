// src/pages/InquiryPage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { api } from "../api";

const InquiryPage: React.FC = () => {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    const storedUserId = localStorage.getItem("userId");

    if (!token || !storedUserId) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    // Prefill name/email if user exists in localStorage
    if (storedUser) {
      try {
        const userObj = JSON.parse(storedUser);
        const fullName = userObj.fullName || userObj.name || "";
        const emailFromUser = userObj.email || "";

        if (fullName) setName(fullName);
        if (emailFromUser) setEmail(emailFromUser);
      } catch {
        // ignore parse errors
      }
    }
  }, [navigate, location.pathname]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    const token = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");

    if (!token || !storedUserId) {
      alert("You must be logged in to send an inquiry.");
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    const userId = parseInt(storedUserId, 10);
    if (!userId || Number.isNaN(userId)) {
      alert("Invalid user session. Please log in again.");
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    if (!vehicleId) {
      alert("Invalid vehicle ID in URL.");
      return;
    }

    setSubmitting(true);
    setSuccess(false);

    try {
      await api.post(
        "/inquiries",
        {
          userId,
          vehicleId: Number(vehicleId),
          name,
          email,
          message,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess(true);
      setMessage("");
    } catch (err) {
      console.error("Inquiry submission failed:", err);
      alert("Failed to send inquiry.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl bg-gray-950/90 border border-gray-800 rounded-3xl shadow-2xl p-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-[11px] text-gray-500 hover:text-gray-300 mb-4"
        >
          ← Back
        </button>

        <h1 className="text-2xl font-bold text-white mb-1">
          Ask about this vehicle
        </h1>
        <p className="text-xs text-gray-400 mb-5">
          Send us a direct message about availability, history, or anything else
          you want to know.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div className="rounded-xl bg-gray-900 border border-gray-800 px-3 py-2 text-xs text-gray-300 mb-1">
            Vehicle ID:{" "}
            <span className="text-gray-100 font-semibold">#{vehicleId}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                Full name
              </label>
              <input
                type="text"
                className="w-full rounded-lg bg-gray-900 border border-gray-800 px-3 py-2 text-xs text-gray-100"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full rounded-lg bg-gray-900 border border-gray-800 px-3 py-2 text-xs text-gray-100"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Message
            </label>
            <textarea
              className="w-full rounded-lg bg-gray-900 border border-gray-800 px-3 py-2 text-xs text-gray-100 min-h-[100px]"
              placeholder="Ask about availability, price, etc."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          {success && (
            <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/60 text-emerald-200 text-xs px-3 py-2">
              Your inquiry has been sent. We will reply soon.
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || !name || !email || !message}
            className={`w-full py-2.5 rounded-lg text-sm font-semibold transition ${
              submitting || !name || !email || !message
                ? "bg-blue-500/40 text-gray-200 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-500 text-white"
            }`}
          >
            {submitting ? "Sending..." : "Send inquiry"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default InquiryPage;
