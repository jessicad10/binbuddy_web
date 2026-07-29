import axiosInstance from "./axios-instance";

export const createPickupRequest = async (token: string, data: any) => {
  try {
    const response = await axiosInstance.post("/api/v1/pickups", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || "Failed to submit pickup request"
    );
  }
};

export const getAllPickupRequests = async (token: string) => {
  try {
    const response = await axiosInstance.get("/api/v1/pickups", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || "Failed to fetch pickup requests"
    );
  }
};

export const updatePickupRequestStatus = async (
  token: string,
  id: string,
  status: string
) => {
  try {
    const response = await axiosInstance.patch(
      `/api/v1/pickups/${id}/status`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || "Failed to update pickup status"
    );
  }
};
