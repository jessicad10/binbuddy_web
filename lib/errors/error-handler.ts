export interface AppErrorResponse {
  success: false;
  message: string;
}

export const handleApiError = (error: any, defaultMessage: string = "An unexpected error occurred"): AppErrorResponse => {
  console.error("API Layer Error Exception: ", error);
  
  if (error?.response?.data?.message) {
    return {
      success: false,
      message: error.response.data.message
    };
  }
  
  if (error?.message) {
    return {
      success: false,
      message: error.message
    };
  }
  
  return {
    success: false,
    message: defaultMessage
  };
};
