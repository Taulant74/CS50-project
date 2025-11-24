// src/pages/TestDrivePage.tsx
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const TestDrivePage: React.FC = () => {
  const { vehicleId } = useParams();
  const navigate = useNavigate();

  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time) return;

    setSubmitting(true);
    setSuccess(false);

    try {
      // Replace with real POST to /api/testdrives
      await new Promise((resolve) => setTimeout(resolve, 800));
      setSuccess(true);
      setNotes("");
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
          Book a test drive
        </h1>
        <p className="text-xs text-gray-400 mb-5">
          Choose your preferred date and time. We’ll confirm availability as
          soon as possible.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                Vehicle
              </label>
              <div className="w-full rounded-lg bg-gray-900 border border-gray-800 px-3 py-2 text-xs text-gray-200">
                ID #{vehicleId} • VirtuRide autosallon
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                Preferred date
              </label>
              <input
                type="date"
                className="w-full rounded-lg bg-gray-900 border border-gray-800 px-3 py-2 text-xs text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Preferred time
            </label>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full rounded-lg bg-gray-900 border border-gray-800 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="09:00">09:00</option>
              <option value="10:00">10:00</option>
              <option value="11:00">11:00</option>
              <option value="13:00">13:00</option>
              <option value="15:00">15:00</option>
              <option value="17:00">17:00</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Notes (optional)
            </label>
            <textarea
              className="w-full rounded-lg bg-gray-900 border border-gray-800 px-3 py-2 text-xs text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
              placeholder="Share any details, e.g. what you want to check, your phone number, etc."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {success && (
            <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/60 text-emerald-200 text-xs px-3 py-2">
              Your test drive request has been sent. We will contact you soon
              for confirmation.
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || !date || !time}
            className={`w-full py-2.5 rounded-lg text-sm font-semibold transition
              ${
                submitting || !date || !time
                  ? "bg-blue-500/40 text-gray-200 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-500 text-white"
              }`}
          >
            {submitting ? "Sending request..." : "Submit test drive request"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TestDrivePage;
