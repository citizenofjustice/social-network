import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
  dateTimeFormat: {
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    locale: Intl.DateTimeFormat().resolvedOptions().locale,
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
  },
});

// Action creators are generated for each case reducer function
export const { setMode, setDateTimeFormat } = uiSlice.actions;

export default uiSlice.reducer;
