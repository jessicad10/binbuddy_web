import axiosInstance from "./axios-instance";
import { API } from "./endpoints";

export const getNotifications = async (token: string) => {
  try {
    const response = await axiosInstance.get(API.NOTIFICATIONS.LIST, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to fetch notifications");
  }
};

export const markNotificationRead = async (id: string, token: string) => {
  try {
    const response = await axiosInstance.patch(API.NOTIFICATIONS.READ(id), {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to mark notification as read");
  }
};

export const markAllNotificationsRead = async (token: string) => {
  try {
    const response = await axiosInstance.post(API.NOTIFICATIONS.MARK_ALL_READ, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to mark all notifications as read");
  }
};

export const deleteNotification = async (id: string, token: string) => {
  try {
    const response = await axiosInstance.delete(API.NOTIFICATIONS.DELETE(id), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to delete notification");
  }
};
