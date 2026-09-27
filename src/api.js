import axios from "axios";

// One preconfigured Axios instance used by every page in the app.
// Uses the Render API in production; falls back to "/api" in development,
// where Vite's proxy forwards /api to localhost:5000.
const baseURL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({ baseURL });

// Request interceptor: attach the saved token to every request automatically,
// so we never have to write "Authorization: Bearer ..." by hand.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: our backend always answers with { success, message }.
// Convert any error into a readable Error object for the pages to display.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || "Something went wrong. Please try again.";
    return Promise.reject(new Error(message));
  }
);

export default api;