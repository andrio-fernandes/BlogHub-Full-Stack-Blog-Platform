import axios from "axios";

// One preconfigured Axios instance used by every page in the app.
// baseURL "/api" works in development because Vite proxies it to the backend.
const api = axios.create({
  baseURL: "/api",
});

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