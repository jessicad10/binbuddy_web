import axios from "axios";

const isServer = typeof window === "undefined";

const BASE_URL = isServer
    ? (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8089")
    : ""; // Use relative path on client to route through Next.js proxy

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export default axiosInstance;