import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  isUserLoading: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
    setFriends: (state, action) => {
      if (state.user) {
        state.user.friends = action.payload.friends;
      } else console.error("user friends non-existent");
    },
    setIsUserLoading: (state) => {
      state.isUserLoading = state.isUserLoading ? false : true;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setLogin, setLogout, setFriends, setIsUserLoading } =
  authSlice.actions;

export default authSlice.reducer;
