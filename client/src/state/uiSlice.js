import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
  dateTimeFormat: {
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    locale: Intl.DateTimeFormat().resolvedOptions().locale,
  },
  message: {
    isShown: false,
    text: "",
    type: "",
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
    showMessage: (state, action) => {
      state.message = action.payload;
    },
    closeMessage: (state) => {
      state.message.isShown = false;
      state.message.text = "";
      state.message.type = "";
    },
  },
});

// Action creators are generated for each case reducer function
export const { setMode, setDateTimeFormat, showMessage, closeMessage } =
  uiSlice.actions;

export default uiSlice.reducer;
