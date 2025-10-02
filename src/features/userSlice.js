// src/features/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null, // start me user null hoga
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload; // payload me user ka data ayega
    },
    logout: (state) => {
      state.user = null; // logout hone pr user null
    },
  },
});

export const { login, logout } = userSlice.actions;
export const selectUser = (state) => state.user.user; // user access karne k liye selector

export default userSlice.reducer;
