import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import type { TestDrive } from "../types";

const MOCK_USER_ID = 1;

const TestDrivePage: React.FC = () => {
  const { vehicleId } = useParams();
  const navigate = useNavigate();

  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [msg, setMsg] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleId) return;

    const payload: TestDrive = {
      vehicleId: Number(vehicleId),
      userId: MOCK_USER_ID,
      preferredDate: date,
      preferredTime: time + ":00",
      notes,
    };

    try {
      setLoading(true);
      setMsg("");
      await api.post("/testdrives", payload);
      setMsg("Test drive booked successfully ✅");
    } catch (err) {
      console.error(err);
      setMsg("Failed to book test drive.");
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

      <h2 className="text-xl font-bold mb-4">Book Test Drive</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <input
            type="date"
            className="border rounded px-3 py-2 w-full"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Time</label>
          <input
            type="time"
            className="border rounded px-3 py-2 w-full"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Notes</label>
          <textarea
            className="border rounded px-3 py-2 w-full"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Anything specific you want to mention..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded font-medium"
        >
          {loading ? "Booking..." : "Confirm Booking"}
        </button>

        {msg && <p className="mt-2 text-sm">{msg}</p>}
      </form>
      </div>
    </div>
  );
};

export default TestDrivePage;
