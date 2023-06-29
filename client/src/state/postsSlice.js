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
    triggerReloadToggle: (state) => {
      state.reloadToggle = state.reloadToggle ? false : true;
    },
    setEditablePost: (state, action) => {
      state.editablePost = action.payload.editablePost;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setPosts, clearPosts, triggerReloadToggle, setEditablePost } =
  postsSlice.actions;

export default postsSlice.reducer;
