"use server"; // server side api call
import { login, register } from "@/lib/api/auth";
import { RegisterFormData } from "@/app/(auth)/_components/schema";
import { LoginFormData } from "@/app/(auth)/_components/schema";
import { setTokenCookie, storeUserData, getTokenCookie, getUserData, clearAuthCookies } from "../cookies";

export const handleRegisterUser = async (data: RegisterFormData) => {
    try {
        // Map firstName and lastName to fullName for the backend API payload
        const payload = {
            fullName: `${data.firstName} ${data.lastName}`,
            username: data.username,
            email: data.email,
            password: data.password,
        };

        const result = await register(payload);

        if (result.success) {
            return { success: true, message: result.message, data: result.data };
        } else {
            return { success: false, message: result.message || 'Registration failed' };
        }
    } catch (error: Error | any) {
        return { success: false, message: error?.message || 'Registration failed' };
    }
};

export const handleLoginUser = async (data: LoginFormData) => {
    try {
        const result = await login(data);
        
        if (result.success && result.data) {
            const user = result.data.user;
            const token = result.data.token;
            await setTokenCookie(token);
            await storeUserData(user);
            return { success: true, message: result.message, data: result.data };
        } else {
            return { success: false, message: result.message || 'Login failed' };
        }
    } catch (error: Error | any) {
        return { success: false, message: error?.message || 'Login failed' };
    }
};

export const getSessionData = async () => {
    try {
        const token = await getTokenCookie();
        const user = await getUserData();
        return { token: token || null, user: user || null };
    } catch (error) {
        return { token: null, user: null };
    }
};

export const handleUpdateUserCookie = async (user: any) => {
    try {
        await storeUserData(user);
        return { success: true };
    } catch (error: any) {
        return { success: false, message: error?.message || "Failed to update cookie" };
    }
};

export const handleLogoutUser = async () => {
    try {
        await clearAuthCookies();
        return { success: true };
    } catch (error: any) {
        return { success: false, message: error?.message || "Logout failed" };
    }
};