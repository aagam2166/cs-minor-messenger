import api from "./axios";

export const getUserByUsernameRequest = (query) => {
    return api.get("/users/search",{
        params: {query},
    });
};

export const getUserProfileByUsernameRequest = (username) => {
  return api.get(`/users/${username}`);
};
