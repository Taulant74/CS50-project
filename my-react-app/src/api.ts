// src/api.ts
import axios from "axios";

export const api = axios.create({
  baseURL: "https://localhost:7224/api",
});

// Helper to get current user from localStorage
export const getCurrentUser = () => {
  const raw = localStorage.getItem("vr_user");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as {
      id: number;
      fullName: string;
      email: string;
      role: string;
    };
  } catch {
    return null;
  }
};
