import axiosInstance from "./axios-instance";
import {API} from "./endpoints";

export const register = async (data: any) => {
    try{
        const response = 
            await axiosInstance.post(API.AUTH.REGISTER,data); // path,data
        return response.data; //response ko body
    

    }catch(error:Error | any){
        throw new Error(error?.response?.data?.message
        || 'Registration failed');
        //error?.response?.dataa -> response ko body
    }
}

export const login = async (data: any) => {
    try{
        const response = 
            await axiosInstance.post(API.AUTH.LOGIN,data); // path,data
        return response.data; //response ko body
    }catch(error:Error | any){
        throw new Error(error?.response?.data?.message
        || 'Login failed');
        //error?.response?.dataa -> response ko body
    }
}

export const whoami = async (token: string) => {
    try {
        const response = await axiosInstance.get(API.AUTH.WHOAMI, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch(error: any) {
        throw new Error(error?.response?.data?.message || 'Failed to fetch user details');
    }
}

export const updateProfile = async (formData: FormData, token: string) => {
    try {
        const response = await axiosInstance.patch(API.AUTH.UPDATE, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch(error: any) {
        throw new Error(error?.response?.data?.message || 'Profile update failed');
    }
}