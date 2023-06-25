import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import uiReducer from "state/uiSlice";
import postsReducer from "state/postsSlice";

export const rootReducer = combineReducers({
  auth: authReducer,
  ui: uiReducer,
  posts: postsReducer,
});
