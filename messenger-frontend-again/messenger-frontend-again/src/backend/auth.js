import api from "./axios"

export const loginRequest = async ({email,password}) => {
    const res = await api.post("/users/login",{
        email,
        password
    });

    return res.data;
};

export const getUserByIdRequest = async (userId) => {
  const res = await api.get(`/users/${userId}`);
  return res;
};


export const logoutRequest = async () => {
    const res = await api.post("/users/logout");

    return res.data;
}

export const getCurrentUserRequest = async () => {
    const res = await api.get("/users/me");
    return res.data;
}

export const registerUserRequest = async ({fullName,username,email,password}) => {
  const res = await api.post("/users/register", {
   fullName,
   username,
   email,
   password

  });

  return res.data;
};
