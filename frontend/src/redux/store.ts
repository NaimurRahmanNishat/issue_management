// src/redux/store.ts

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { baseApi } from "./api/baseApi";
import authReducer from "./features/auth/authSlice";
import issueReducer from "./features/issues/issueSlice";
import messageReducer from "./features/message/messageSlice";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage"; 

// ================= PERSIST CONFIG ================= 
const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "accessToken", "isAuthenticated"],
};

// ================= COMBINE REDUCERS ================= 
const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  issue: issueReducer,
  message: messageReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

// ================= STORE ================= 
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(baseApi.middleware),
});

// ================= PERSISTOR ================= 
export const persistor = persistStore(store);

// ================= TYPES ================= 
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
