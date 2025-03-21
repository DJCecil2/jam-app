import { configureStore } from "@reduxjs/toolkit";
import instrumentsReducer from "./reducers/instruments.reducer.ts";

export const store = configureStore({
  reducer: {
    instruments: instrumentsReducer,
  },
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
