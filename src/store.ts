import { combineReducers, configureStore } from "@reduxjs/toolkit";
import instrumentsReducer from "./reducers/instruments.reducer.ts";
import musiciansReducer from "./reducers/musicians.reducer.ts";
import jamSessionReducer from "./reducers/jamSession.reducer.ts";
import { loadState, saveState } from "./utils/localStorage.ts";

const rootReducer = combineReducers({
  instruments: instrumentsReducer,
  musicians: musiciansReducer,
  jamSessions: jamSessionReducer,
});

const preloadedState = loadState();

export const store = configureStore({
  reducer: rootReducer,
  preloadedState,
});

store.subscribe(() => {
  saveState(store.getState());
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
