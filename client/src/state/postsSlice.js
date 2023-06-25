import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: [],
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
  },
});

// Action creators are generated for each case reducer function
export const { setPosts, clearPosts } = postsSlice.actions;

export default postsSlice.reducer;
