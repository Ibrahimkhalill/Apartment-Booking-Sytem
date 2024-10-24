import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
// Initial state for auth slice
const initialState = {
  username: localStorage.getItem("x-username") || "",
  email: localStorage.getItem("x-email") || "",
  isLoggedIn: Cookies.get("a-token"), // Initially false
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUsername: (state, action) => {
      state.username = action.payload;
      localStorage.setItem("x-username", action.payload); // Store username
    },
    setEmail: (state, action) => {
      state.email = action.payload;
      localStorage.setItem("x-email", action.payload); // Store email
    },
    setLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload; // Set isLoggedIn based on backend check
    },
    logout: (state) => {
      state.username = "";
      state.email = "";
      state.isLoggedIn = false;
      Cookies.remove("a-token")
      localStorage.removeItem("x-username");
      localStorage.removeItem("x-email");
      
    },
  },
});

export const { setUsername, setEmail, setLoggedIn, logout } = authSlice.actions;
export default authSlice.reducer;
