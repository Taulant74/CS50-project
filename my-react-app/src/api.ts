import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7224/api", // 🔴 change port if needed
});

// Optional: you can add interceptors later for auth
export default api;
