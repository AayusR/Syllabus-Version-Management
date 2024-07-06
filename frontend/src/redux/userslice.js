import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    username: "",
    email: "",
    accessToken: "",
    admin: false,
  },
  reducers: {
    LOGIN: (state, action) => {
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.accessToken = action.payload.accessToken;
      state.admin = action.payload.admin;
    },
    LOGOUT: (state) => {
      state.username = "";
      state.email = "";
      state.accessToken = "";
      state.admin = false;
    },
  },
});

export const { LOGIN, LOGOUT } = userSlice.actions;

export default userSlice.reducer;
