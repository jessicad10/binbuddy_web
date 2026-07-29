import axios from "axios";

const isServer = typeof window === "undefined";

let isPlaywrightActive = false;
if (isServer) {
    try {
        const fs = require("fs");
        const path = require("path");
        if (fs.existsSync(path.join(process.cwd(), ".playwright-mock-active"))) {
            isPlaywrightActive = true;
        }
    } catch (e) {}
}

const BASE_URL = isServer
    ? (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8089")
    : ""; // Use relative path on client to route through Next.js proxy

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Playwright E2E Mock Layer
if (
    isPlaywrightActive ||
    process.env.NEXT_PUBLIC_PLAYWRIGHT_TEST === "true" ||
    process.env.PLAYWRIGHT_TEST === "true" ||
    (typeof window !== "undefined" && window.location.hostname === "localhost" && sessionStorage.getItem("PLAYWRIGHT_TEST") === "true")
) {
    let mockUsers = [
        { _id: "admin-1", fullName: "Admin User", email: "admin@binbuddy.com", role: "admin", gender: "Other", contactNumber: "1234567890" }
    ];

    let mockCenters = [
        {
            _id: "c1",
            name: "Kathmandu Recycling Hub",
            city: "Kathmandu",
            address: "Chabahil, Kathmandu",
            contactNumber: "9812345678",
            email: "ktm@recycle.com",
            openingHours: "9:00 AM - 5:00 PM",
            typesAccepted: ["Plastic", "Paper"],
            description: "Kathmandu Valley main hub",
            isActive: true
        }
    ];

    axiosInstance.interceptors.request.use((config) => {
        const url = config.url || "";
        const method = (config.method || "get").toLowerCase();
        let mockResponse: any = null;
        let mockStatus = 200;

        // Login Mock
        if (url.includes("/auth/login") && method === "post") {
            const data = typeof config.data === "string" ? JSON.parse(config.data) : config.data;
            const isAdmin = data.email === "admin@binbuddy.com";
            
            // Check for intentional failure
            if (data.email === "wrong@gmail.com") {
                mockStatus = 400;
                mockResponse = {
                    success: false,
                    message: "Invalid credentials"
                };
            } else {
                mockResponse = {
                    success: true,
                    message: "Login successful",
                    data: {
                        token: isAdmin ? "mock-jwt-admin-token" : "mock-jwt-user-token",
                        user: isAdmin
                            ? { id: "admin-1", email: "admin@binbuddy.com", role: "admin", fullName: "Admin User" }
                            : { id: "user-2", email: data.email, role: "user", fullName: "Playwright Test User" }
                    }
                };
            }
        }

        // Whoami Profile Mock
        else if (url.includes("/auth/whoami") && method === "get") {
            const authHeader = String(config.headers?.Authorization || "");
            const isAdmin = authHeader.includes("mock-jwt-admin-token");
            mockResponse = {
                success: true,
                data: isAdmin
                    ? { id: "admin-1", email: "admin@binbuddy.com", role: "admin", fullName: "Admin User", gender: "Other", contactNumber: "1234567890" }
                    : { id: "user-2", email: "playwright-test@test.com", role: "user", fullName: "Playwright Test User", gender: "Male", contactNumber: "1234567890" }
            };
        }

        // Register Mock
        else if (url.includes("/auth/register") && method === "post") {
            mockResponse = { success: true, message: "User registered successfully", data: {} };
        }

        // Forgot Password Mock
        else if (url.includes("/auth/forgot-password") && method === "post") {
            mockResponse = { success: true, message: "Reset email sent successfully" };
        }

        // Users CRUD Mock
        else if (url.includes("/admin/users")) {
            if (method === "get") {
                mockResponse = { success: true, data: mockUsers, meta: { total: mockUsers.length } };
            } else if (method === "post") {
                const postData = typeof config.data === "string" ? JSON.parse(config.data) : config.data;
                const newUser = {
                    _id: `user-${Date.now()}`,
                    fullName: postData.fullName,
                    email: postData.email,
                    role: postData.role,
                    gender: postData.gender,
                    contactNumber: postData.contactNumber
                };
                mockUsers.push(newUser);
                mockResponse = { success: true, message: "User created successfully", data: newUser };
            } else if (method === "put" || url.match(/\/users\/[^/]+$/)) {
                const putData = typeof config.data === "string" ? JSON.parse(config.data) : config.data;
                mockUsers = mockUsers.map(u => u.email.startsWith("playwright-") ? { ...u, fullName: putData.fullName } : u);
                mockResponse = { success: true, message: "User updated successfully" };
            } else if (method === "delete") {
                mockUsers = mockUsers.filter(u => !u.email.startsWith("playwright-"));
                mockResponse = { success: true, message: "User deleted successfully" };
            }
        }

        // Recycle Centers Mock
        else if (url.includes("/recycle-centers")) {
            if (method === "get") {
                mockResponse = { success: true, data: mockCenters };
            } else if (method === "post") {
                const postData = typeof config.data === "string" ? JSON.parse(config.data) : config.data;
                mockCenters.push(postData);
                mockResponse = { success: true, message: "Center created successfully" };
            }
        }

        // Feedbacks Mock
        else if (url.includes("/feedback/submit") && method === "post") {
            mockResponse = { success: true, message: "Feedback submitted successfully" };
        }

        // Pickups Mock
        else if (url.includes("/pickups")) {
            mockResponse = { success: true, data: [] };
        }

        // Apply Custom Mock Adapter if matched
        if (mockResponse !== null) {
            config.adapter = async () => {
                return {
                    data: mockResponse,
                    status: mockStatus,
                    statusText: "OK",
                    headers: {},
                    config
                };
            };
        }

        return config;
    });
}

export default axiosInstance;