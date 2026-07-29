import axiosInstance from "./axios-instance";
import { API } from "./endpoints";

export interface CampaignData {
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  organizer?: string;
}

export const getCampaigns = async (token: string) => {
  try {
    const response = await axiosInstance.get(API.CAMPAIGNS.LIST, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to fetch campaigns");
  }
};

export const createCampaign = async (data: CampaignData, token: string) => {
  try {
    const response = await axiosInstance.post(API.CAMPAIGNS.CREATE, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to create campaign");
  }
};

export const toggleInterest = async (campaignId: string, token: string) => {
  try {
    const response = await axiosInstance.post(API.CAMPAIGNS.TOGGLE_INTEREST(campaignId), {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to update interest status");
  }
};

export const getInterestedUsers = async (campaignId: string, token: string) => {
  try {
    const response = await axiosInstance.get(API.CAMPAIGNS.INTERESTED_USERS(campaignId), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to fetch interested users list");
  }
};

export const updateRespondentStatus = async (
  campaignId: string,
  userId: string,
  status: "approved" | "denied",
  token: string
) => {
  try {
    const response = await axiosInstance.post(
      API.CAMPAIGNS.UPDATE_STATUS(campaignId),
      { userId, status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to update respondent status");
  }
};
