import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
  dateTimeFormat: {
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    locale: Intl.DateTimeFormat().resolvedOptions().locale,
  },
  errors: {
    duration: 3000,
    items: [],
  },
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setDateTimeFormat: (state, action) => {
      state.dateTimeFormat.timezone = action.payload.timezone;
      state.dateTimeFormat.locale = action.payload.locale;
    },
    addErrors: (state, action) => {
      state.errors.items.push(action.payload.error);
    },
    dropError: (state, action) => {
      const filteredErrors = state.errors.items.filter(
        (error) => error.id !== action.payload.errorId
      );
      state.errors.items = filteredErrors;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setMode, setDateTimeFormat, addErrors, dropError } =
  uiSlice.actions;

export default uiSlice.reducer;
