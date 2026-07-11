import axios from "axios";

export const socialListenerApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SOCIAL_LISTENER_URL ?? "http://localhost:5001",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach auth token (same as pazaApi, assuming the same JWT)
socialListenerApi.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Optional: Add response error handling like pazaApi
socialListenerApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // handle session expiry similarly
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);