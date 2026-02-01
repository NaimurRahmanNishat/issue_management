// src/main.tsx
import { Provider } from "react-redux";
import { createRoot } from "react-dom/client";
import "./index.css";
import { store, persistor } from "./redux/store";
import { RouterProvider } from "react-router-dom";
import router from "./routes/router.tsx";
import { PersistGate } from "redux-persist/integration/react";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <RouterProvider router={router} />
    </PersistGate>
  </Provider>
);
