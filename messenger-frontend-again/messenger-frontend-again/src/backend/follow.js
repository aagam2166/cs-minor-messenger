import api from "./axios"

export const getFollowersCountRequest = (userId) => {
  console.log("API → getFollowersCountRequest userId:", userId);
  return api.get(`/users/${userId}/followers/count`);
};

export const getFollowingCountRequest = (userId) => {
  console.log("API → getFollowingCountRequest userId:", userId);
  return api.get(`/users/${userId}/following/count`);
};
