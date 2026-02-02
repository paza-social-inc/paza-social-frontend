import axios, { AxiosRequestConfig } from "axios";
import { toast } from "react-hot-toast";

export const pazaApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
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
        if (error.response.status === 401) {
            localStorage.removeItem("token");
            toast.error("Session expired. Please login again.");
            window.location.href = "/login";
        }
    }
)


