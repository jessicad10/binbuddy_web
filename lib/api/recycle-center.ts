import axiosInstance from "./axios-instance";

export const getRecycleCenters = async (token: string, filters: { status?: string } = {}) => {
  try {
    const params: any = {};
    if (filters.status) {
      params.status = filters.status;
    }
    const response = await axiosInstance.get("/api/v1/recycle-centers", {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || "Failed to fetch recycling centers"
    );
  }
};

export const createRecycleCenter = async (token: string, data: any) => {
  try {
    const response = await axiosInstance.post("/api/v1/recycle-centers", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || "Failed to create recycling center"
    );
  }
};

export const updateRecycleCenter = async (token: string, id: string, data: any) => {
  try {
    const response = await axiosInstance.put(`/api/v1/recycle-centers/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || "Failed to update recycling center"
    );
  }
};

export const deleteRecycleCenter = async (token: string, id: string) => {
  try {
    const response = await axiosInstance.delete(`/api/v1/recycle-centers/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || "Failed to delete recycling center"
    );
  }
};
