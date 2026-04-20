import axios, { AxiosRequestConfig } from "axios";
import { toast } from "react-hot-toast";
const DEFAULT_API_URL = "http://localhost:8000";
export const pazaApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Attach auth token to requests when available (e.g. from localStorage after login)
pazaApi.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

export const tokenConfig = (): AxiosRequestConfig => {
    const token = localStorage.getItem("token");
    const config: AxiosRequestConfig = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };


    if (token) {
        config.headers!["Authorization"] = `JWT ${token}`;
    }

    return config;
};


pazaApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const message = String(error.response?.data?.message || "").toLowerCase();
            const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
            const shouldForceLogout =
                !!token &&
                (message.includes("invalid or expired token") ||
                    message.includes("jwt") ||
                    message.includes("token expired"));

            if (shouldForceLogout) {
                localStorage.removeItem("token");
                toast.error("Session expired. Please login again.");
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
)


