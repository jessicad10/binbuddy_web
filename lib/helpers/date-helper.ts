export const formatDate = (dateString: string | Date): string => {
  if (!dateString) return "";
  try {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (error) {
    return String(dateString);
  }
};

export const formatTime = (dateString: string | Date): string => {
  if (!dateString) return "";
  try {
    return new Date(dateString).toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit"
    });
  } catch (error) {
    return "";
  }
};
