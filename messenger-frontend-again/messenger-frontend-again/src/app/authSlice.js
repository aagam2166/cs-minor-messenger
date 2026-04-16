import { createSlice } from "@reduxjs/toolkit";

/* ---------------- STORAGE HELPERS ---------------- */

const loadAuthFromStorage = () => {
  try {
    const raw = localStorage.getItem("auth");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const saveAuthToStorage = (state) => {
  localStorage.setItem(
    "auth",
    JSON.stringify({
      status: state.status,
      userData: state.userData,
      accessToken: state.accessToken,
    })
  );
};

const clearAuthFromStorage = () => {
  localStorage.removeItem("auth");
};

/* ---------------- INITIAL STATE ---------------- */

const persistedAuth = loadAuthFromStorage();

const initialState = persistedAuth || {
  status: false,
  userData: null,
  accessToken: null,
};

/* ---------------- SLICE ---------------- */

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.status = true;
      state.userData = action.payload.userData;
      state.accessToken = action.payload.accessToken;

      saveAuthToStorage(state);
    },

    logout: (state) => {
      state.status = false;
      state.userData = null;
      state.accessToken = null;

      clearAuthFromStorage();
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
