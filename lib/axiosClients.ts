import axios, { AxiosRequestConfig } from "axios";
import { toast } from "react-hot-toast";

export const DEFAULT_API_URL = "https://api.paza.social";
export const pazaApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// ── In-memory auth token (survives even when localStorage or the interceptor misbehaves) ──
let _authToken: string | null = null;

/**
 * Set (or clear) the auth token on the pazaApi instance.
 *
 * Updates both the in-memory _authToken variable (read by the request
 * interceptor) and the axios instance default headers so the token
 * reaches every request regardless of which path fires first.
 *
 * NOTE: In axios 1.16.x, pazaApi.defaults.headers is a plain object,
 * NOT an AxiosHeaders instance — never call .set() / .delete() on it.
 */
export function setApiAuthToken(token: string | null) {
    _authToken = token;
    try {
        const target = pazaApi.defaults.headers as Record<string, unknown> & { common?: Record<string, unknown> };
        if (!target) return;
        // Don't attempt AxiosHeaders.set() — defaults.headers is a plain object
        // in v1.16.x. Use direct property assignment on the nested `common` dict
        // which is what Axios merges into per-request headers.
        const common = target.common ?? target;
        if (token) {
            common["Authorization"] = `Bearer ${token}`;
        } else {
            delete common["Authorization"];
        }
    } catch (e) {
        // Ignore — the in-memory _authToken fallback via the interceptor
        // will still provide the token for subsequent requests.
        console.warn("[setApiAuthToken] Default-header update failed, _authToken fallback remains:", e);
    }
}

/** Convenience to clear on logout. */
export function clearApiAuthToken() {
    setApiAuthToken(null);
}

// Attach auth token to requests when available (e.g. from localStorage after login)
// Falls back to the in-memory _authToken as a production-safe measure.
pazaApi.interceptors.request.use((config) => {
    let token: string | null = null;

    if (typeof window !== "undefined") {
        // localStorage read — works after login / OAuth callback
        token = localStorage.getItem("token");
    }

    // Fallback to the in-memory variable (set via setApiAuthToken)
    if (!token) {
        token = _authToken;
    }

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

/** Build a per-request config with the auth token from localStorage.
 *  Use this for calls that happen before setApiAuthToken() has been called. */
export function getAuthHeaderConfig(): AxiosRequestConfig {
    const token = (typeof window !== "undefined" ? localStorage.getItem("token") : null) || _authToken;
    if (!token) return {};
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
}

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


