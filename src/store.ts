import { configureStore } from "@reduxjs/toolkit";
import instrumentsReducer from "./reducers/instruments.reducer.ts";
import musiciansReducer from "./reducers/musicians.reducer.ts";
import jamSessionReducer from "./reducers/jamSession.reducer.ts";

export const store = configureStore({
  reducer: {
    instruments: instrumentsReducer,
    musicians: musiciansReducer,
    jamSessions: jamSessionReducer,
  },
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
