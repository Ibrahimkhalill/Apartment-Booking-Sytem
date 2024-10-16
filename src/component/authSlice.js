import { createSlice } from "@reduxjs/toolkit";

// Initial state for auth slice
const initialState = {
  username: localStorage.getItem("x-username") || "",
  token: localStorage.getItem("x-access-token") || null,
  email: localStorage.getItem("x-email") || "",
  isLoggedIn: !!localStorage.getItem("x-access-token"), // Use double negation for boolean
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUsername: (state, action) => {
      state.username = action.payload;
      localStorage.setItem("x-username", action.payload);
    },
    setToken: (state, action) => {
      state.token = action.payload;
      state.isLoggedIn = true; // Set user as logged in
      localStorage.setItem("x-access-token", action.payload); // Save token to localStorage
    },
    setEmail: (state, action) => {
      state.email = action.payload;
      localStorage.setItem("x-email", action.payload);
    },
    logout: (state) => {
      state.username = "";
      state.token = null;
      state.email = "";
      state.isLoggedIn = false;
      localStorage.removeItem("x-access-token"); // Remove token from localStorage
      localStorage.removeItem("x-username")
      localStorage.removeItem("x-email")
    },
  },
});

export const { setUsername, setToken, setEmail, logout } = authSlice.actions;
export default authSlice.reducer;
