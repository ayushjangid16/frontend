import { combineReducers, configureStore } from "@reduxjs/toolkit";

import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import userReducers from "@/store/slices/userSlice";
import requestReducer from "@/store/slices/requestSlice";

const persistConfig = {
  key: "root",
  storage,
};

const allReducers = combineReducers({
  userReducer: persistReducer(persistConfig, userReducers),
  requestReducer: requestReducer,
});

export const store = configureStore({
  reducer: allReducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);
