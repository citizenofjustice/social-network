import { store, persistor } from "state/configStore";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import CustomCircularLoading from "components/CustomCircularLoading";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <PersistGate
      loading={<CustomCircularLoading margin="6rem 0 0 0" />}
      persistor={persistor}
    >
      <App />
    </PersistGate>
  </Provider>
  // </React.StrictMode>
);
