import axiosInstance from "./axios-instance";

export const getAdminUsers = async (
  token: string,
  page: number,
  limit: number,
  search?: string
) => {
  try {
    const params: any = { page, limit };
    if (search) {
      params.search = search;
    }

    const response = await axiosInstance.get("/api/v1/admin/users", {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || "Failed to fetch admin users"
    );
  }
};

export const getAdminUserById = async (token: string, id: string) => {
  try {
    const response = await axiosInstance.get(`/api/v1/admin/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || "Failed to fetch user details"
    );
  }
};

export const createAdminUser = async (token: string, data: any) => {
  try {
    const response = await axiosInstance.post("/api/v1/admin/users", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || "Failed to create user"
    );
  }
};

export const updateAdminUser = async (token: string, id: string, data: any) => {
  try {
    const response = await axiosInstance.patch(`/api/v1/admin/users/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || "Failed to update user"
    );
  }
};

export const deleteAdminUser = async (token: string, id: string) => {
  try {
    const response = await axiosInstance.delete(`/api/v1/admin/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || "Failed to delete user"
    );
  }
};
