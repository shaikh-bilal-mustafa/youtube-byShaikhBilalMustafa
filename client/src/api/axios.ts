import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1",
  withCredentials: true, // for cookies / refresh tokens
});

// Request interceptor (attach token)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response interceptor (optional)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // handle global errors here
    return Promise.reject(error);
  }
);

export default api;
