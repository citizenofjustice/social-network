import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: [],
  reloadToggle: false,
};

export const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setPosts: (state, action) => {
      state.posts = [...state.posts, ...action.payload.posts];
    },
    clearPosts: (state) => {
      state.posts = [];
    },
    triggerReloadToggle: (state) => {
      state.reloadToggle = state.reloadToggle ? false : true;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setPosts, clearPosts, triggerReloadToggle } = postsSlice.actions;

export default postsSlice.reducer;
