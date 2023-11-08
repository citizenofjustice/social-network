import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import authReducer from "./authSlice";
import uiReducer from "state/uiSlice";
import postsReducer from "state/postsSlice";
import { combineReducers } from "@reduxjs/toolkit";

const persistConfig = {
  key: "root",
  storage,
};

const authPersistConfig = {
  key: "auth",
  storage: storage,
  blacklist: ["isUserLoading"],
};

const uiPersistConfig = {
  key: "ui",
  storage: storage,
  whitelist: ["mode", "dateTimeFormat"],
  blacklist: ["errors"],
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  ui: persistReducer(uiPersistConfig, uiReducer),
  posts: postsReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
      immutableCheck: {
        // Ignore state paths, e.g. state for 'auth':
        // ignoredPaths: ["auth.user"],
      },
    }),
});

export const persistor = persistStore(store);
