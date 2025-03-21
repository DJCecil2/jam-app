import { createSlice, nanoid } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type Instrument = {
  id: string;
  name: string;
};

export type InstrumentsState = Instrument[];

const initialState = [] satisfies InstrumentsState as InstrumentsState;

type AddInstrumentPayload = {
  name: string;
};

type RemoveInstrumentPayload = {
  id: string;
};

const instrumentSlice = createSlice({
  name: "instruments",
  initialState,
  reducers: {
    addInstrument: (
      state,
      { payload: { name } }: PayloadAction<AddInstrumentPayload>,
    ) => {
      state.push({ id: nanoid(), name });
      return state;
    },
    removeInstrument: (
      state,
      { payload: { id } }: PayloadAction<RemoveInstrumentPayload>,
    ) => {
      return state.filter((instrument) => instrument.id !== id);
    },
  },
});

export const { addInstrument, removeInstrument } = instrumentSlice.actions;

export default instrumentSlice.reducer;
