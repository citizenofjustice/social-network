import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: [],
  reloadToggle: false,
  editablePost: {},
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
    setEditablePost: (state, action) => {
      state.editablePost = action.payload.editablePost;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setPosts, clearPosts, setEditablePost } = postsSlice.actions;

export default postsSlice.reducer;
