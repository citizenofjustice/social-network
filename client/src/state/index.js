// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   mode: "light",
//   user: null,
//   token: null,
//   posts: [],
//   dateTimeFormat: {
//     timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
//     locale: Intl.DateTimeFormat().resolvedOptions().locale,
//   },
//   isUserLoading: false,
// };

// export const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     setMode: (state) => {
//       state.mode = state.mode === "light" ? "dark" : "light";
//     },
//     setLogin: (state, action) => {
//       state.user = action.payload.user;
//       state.token = action.payload.token;
//     },
//     setLogout: (state) => {
//       state.user = null;
//       state.token = null;
//     },
//     setFriends: (state, action) => {
//       if (state.user) {
//         state.user.friends = action.payload.friends;
//       } else console.error("user friends non-existent");
//     },
//     setPosts: (state, action) => {
//       state.posts = action.payload.posts;
//     },
//     setPost: (state, action) => {
//       const updatedPosts = state.posts.map((post) => {
//         if (post._id === action.payload.post._id) return action.payload.post;
//         return post;
//       });
//       state.posts = updatedPosts;
//     },
//     setDateTimeFormat: (state, action) => {
//       state.dateTimeFormat.timezone = action.payload.timezone;
//       state.dateTimeFormat.locale = action.payload.locale;
//     },
//     setIsUserLoading: (state) => {
//       state.isUserLoading = state.isUserLoading ? false : true;
//     },
//   },
// });

// export const {
//   setMode,
//   setLogin,
//   setLogout,
//   setFriends,
//   setPosts,
//   setPost,
//   setDateTimeFormat,
//   setIsUserLoading,
// } = authSlice.actions;
// export default authSlice.reducer;

//------------------------------------------
import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import uiReducer from "state/uiSlice";
import postsReducer from "state/postsSlice";

export const rootReducer = combineReducers({
  auth: authReducer,
  ui: uiReducer,
  posts: postsReducer,
});

// export const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     ui: uiReducer,
//     posts: postsReducer,
//   },
// });
