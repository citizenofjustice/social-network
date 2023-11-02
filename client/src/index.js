import { store, persistor } from "state/configStore";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Box, CircularProgress } from "@mui/material";

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <PersistGate
      loading={
        <Box display="flex" justifyContent="center" alignItems="center">
          <CircularProgress sx={{ marginTop: "6rem" }} />
        </Box>
      }
      persistor={persistor}
    >
      <App />
    </PersistGate>
  </Provider>
  // </React.StrictMode>
);
