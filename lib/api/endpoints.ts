//centralized path definition for API endpoints
export const API = {
    AUTH: {
        REGISTER:"/api/v1/auth/register",
        LOGIN:"/api/v1/auth/login",
        WHOAMI:"/api/v1/auth/whoami",
        UPDATE:"/api/v1/auth/update",
        FORGOT_PASSWORD:"/api/v1/auth/forgot-password",
        RESET_PASSWORD:"/api/v1/auth/reset-password",
    },
    FEEDBACK: {
        SUBMIT: "/api/v1/feedback/submit",
        LIST: "/api/v1/feedback/list",
    },
    CAMPAIGNS: {
        LIST: "/api/v1/campaigns/list",
        CREATE: "/api/v1/campaigns/create",
        TOGGLE_INTEREST: (id: string) => `/api/v1/campaigns/${id}/toggle-interest`,
        INTERESTED_USERS: (id: string) => `/api/v1/campaigns/${id}/interested-users`,
        UPDATE_STATUS: (id: string) => `/api/v1/campaigns/${id}/respondent-status`,
    },
    NOTIFICATIONS: {
        LIST: "/api/v1/notifications/list",
        READ: (id: string) => `/api/v1/notifications/${id}/read`,
        MARK_ALL_READ: "/api/v1/notifications/mark-all-read",
        DELETE: (id: string) => `/api/v1/notifications/${id}`,
    }
}