import { configureStore } from "@reduxjs/toolkit";
import instrumentsReducer from "./reducers/instruments.reducer.ts";
import jamslotsReducer from "./reducers/jamslots.reducer.ts";
import musiciansReducer from "./reducers/musicians.reducer.ts";

export const store = configureStore({
  reducer: {
    instruments: instrumentsReducer,
    jamSlots: jamslotsReducer,
    musicians: musiciansReducer,
  },
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
