import api from "./axios";

export const getUserFeedRequest = async ({ page = 1, limit = 10 } = {}) => {
  const res = await api.get("/feed", {
    params: { page, limit }
  });

  // IMPORTANT: backend uses ApiResponse
  return res.data.data;
};
