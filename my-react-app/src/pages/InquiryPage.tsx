import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import type { Inquiry } from "../types";

const InquiryPage: React.FC = () => {
  const { vehicleId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [msg, setMsg] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleId) return;

    const payload: Inquiry = {
      vehicleId: Number(vehicleId),
      name,
      email,
      message,
    };

    try {
      setLoading(true);
      setMsg("");
      await api.post("/inquiries", payload);
      setMsg("Your inquiry has been sent ✅");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      console.error(err);
      setMsg("Failed to send inquiry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="card max-w-md mx-auto bg-white">
      <button
        onClick={() => navigate(-1)}
        className="mb-3 text-sm text-blue-600 hover:underline"
      >
        ← Back
      </button>

      <h2 className="text-xl font-bold mb-4">Contact Seller</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            className="border rounded px-3 py-2 w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            className="border rounded px-3 py-2 w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Message</label>
          <textarea
            className="border rounded px-3 py-2 w-full"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded font-medium"
        >
          {loading ? "Sending..." : "Send Inquiry"}
        </button>

        {msg && <p className="mt-2 text-sm">{msg}</p>}
      </form>
      </div>
    </div>
  );
};

export default InquiryPage;
