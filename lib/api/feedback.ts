import axiosInstance from "./axios-instance";
import { API } from "./endpoints";

export interface FeedbackData {
  type: "website" | "waste-management" | "general" | "praise";
  subject: string;
  message: string;
}

export const submitFeedback = async (data: FeedbackData, token: string) => {
  try {
    const response = await axiosInstance.post(API.FEEDBACK.SUBMIT, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to submit feedback");
  }
};

export const getFeedbacks = async (token: string) => {
  try {
    const response = await axiosInstance.get(API.FEEDBACK.LIST, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to fetch feedbacks");
  }
};
